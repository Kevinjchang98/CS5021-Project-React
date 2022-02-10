const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Create connection pool
// ClearDB
// const db = mysql.createPool({
// 	connectionLimit: 10,
// 	user: 'b57e165b4c319d',
// 	host: 'us-cdbr-east-04.cleardb.com',
// 	password: process.env.DB_PASSWORD,
// 	database: 'heroku_200e0e8c7fc90b0'
// });

// Create connection pool
// AWS
const db = mysql.createPool({
	connectionLimit: 10,
	user: 'root',
	host: 'containers-us-west-28.railway.app',
	password: process.env.DB_PASSWORD_AWS,
	database: 'railway'
});

// Creates a reservation
// TODO: Convert to transaction
// TODO: Return the details/idReservation back instead of static success message
app.post('/create-reservation', (req, res) => {
	const customerId = req.body.customerId;
	const aircraft = req.body.aircraft;
	const start = req.body.start;
	const end = req.body.end;
	const flightPlan = req.body.flightPlan;
	const instructorId = req.body.instructorId;

	// NOTE: ClearDB has auto_increment_increment=10 and can't be changed in the free plan
	db.query(
		'INSERT INTO Reservation (idCustomer, idAircraft, dateStart, dateEnd, idFlightPlan, idInstructor) VALUES (?, ?, ?, ?, ?, ?)',
		[ customerId, aircraft, start, end, flightPlan, instructorId ],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send('Reservation created');
			}
		}
	);
});

// Shows newest 10 reservations
app.get('/view-newest-reservations', (req, res) => {
	db.query(
		`SELECT
            *
        FROM
            Reservation
        ORDER BY
            idReservation DESC
        LIMIT 10`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// View information about all aircraft
app.get('/view-aircraft-data', (req, res) => {
	db.query(
		`SELECT
            *
        FROM
            Aircraft`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Runs stored procedure that takes in customerId and returns flyable aircraft
app.post('/view-aircraft', (req, res) => {
	const customerId = req.body.customerIdAircraft;

	// NOTE: This is using the stored procedure which ClearDB doesn't allow for permissions
	// db.query('call mm_cpsc502101team07.listFlyableAircraft(?)', [ customerId ], (err, result) => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		res.send(result);
	// 	}
	// });

	db.query(
		`SELECT
			Flyable.*,
			max(datePerformed) AS mostRecentMaint
		FROM
			Maintenance
			INNER JOIN (
				SELECT
					idAircraft,
					class,
					100HrDueTime - tachTime as timeBefore100Hr,
					rentalRate,
					annualInspectionDate,
					isTailwheel,
					isComplex,
					isHighPerformance
				FROM
					CustomerHasRating
					INNER JOIN Aircraft ON class = idRating
					AND (
						Aircraft.isTailwheel = EXISTS(
							SELECT
								*
							FROM
								CustomerHasRating
							WHERE
								idCustomer = (?)
								AND idRating = 'TW'
						)
						OR Aircraft.isTailWheel = 0
					)
					AND (
						Aircraft.isComplex = EXISTS(
							SELECT
								*
							FROM
								CustomerHasRating
							WHERE
								idCustomer = (?)
								AND idRating = 'CP'
						)
						OR Aircraft.isComplex = 0
					)
					AND (
						Aircraft.isHighPerformance = EXISTS(
							SELECT
								*
							FROM
								CustomerHasRating
							WHERE
								idCustomer = (?)
								AND idRating = 'HP'
						)
						OR Aircraft.isHighPerformance = '0'
					)
				WHERE
					idCustomer = (?)
					AND annualInspectionDate > NOW() + INTERVAL 1 DAY
					AND 100HrDueTime - tachTime > 0.1
			) Flyable ON Maintenance.idAircraft = Flyable.idAircraft
		GROUP BY
			Flyable.idAircraft
		ORDER BY
			class,
			rentalRate`,
		[ customerId, customerId, customerId, customerId ],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// View aircraft with soonest annual inspection
app.get('/view-aircraft-soonest-annual', (req, res) => {
	db.query(
		`SELECT
			class,
			idAircraft,
			annualInspectionDate,
			tachTime
		FROM
			Aircraft a1
		WHERE
			annualInspectionDate = (
				SELECT
					MIN(annualInspectionDate)
				FROM
					Aircraft a2
				WHERE
					a2.class = a1.class
			)
		ORDER BY
			class`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Finds mechanic that's done the most Maint within the last year and Type of Maint they've done
app.get('/view-mechanic-most-performed', (req, res) => {
	db.query(
		`SELECT
			mech.*,
			maint.maintType,
			count(*) AS typeFrequency,
			A.mechanicCount AS totalCountPerMechanic
		FROM
			Maintenance maint
			JOIN Mechanic mech ON maint.idMechanic = mech.idMechanic
			JOIN (
				SELECT
					idMechanic,
					count(*) AS mechanicCount
				FROM
					Maintenance
				GROUP BY
					idMechanic
				HAVING
					mechanicCount >= (
						SELECT
							MAX(a1.mechanicCount)
						FROM
							(
								SELECT
									count(*) AS mechanicCount
								FROM
									Maintenance
								GROUP BY
									idMechanic
							) a1
					)
			) A ON maint.idMechanic = A.idMechanic
		GROUP BY
			maint.idMechanic,
			maint.maintType
		HAVING
			typeFrequency >= (
				SELECT
					MAX(b1.mechanicCount)
				FROM
					(
						SELECT
							count(*) AS mechanicCount
						FROM
							Maintenance
						GROUP BY
							maintType,
							idMechanic
					) b1
			)`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Selects the most frequently flown-together Customer and Instructor pair(s)
app.get('/view-customer-instructor-pair', (req, res) => {
	db.query(
		`SELECT
			instr.idInstructor,
			instr.nameLast AS 'Instructor Last Name',
			instr.nameFirst AS 'Instructor First Name',
			cust.idCustomer,
			cust.nameLast AS 'Customer Last Name',
			cust.nameFirst AS 'Customer First Name',
			timesFlownTogether AS 'Total Times Flown Together'
		FROM
			(
				SELECT
					idInstructor,
					idCustomer,
					count(*) AS timesFlownTogether
				FROM
					Reservation
				WHERE
					idInstructor IS NOT NULL
				GROUP BY
					idCustomer,
					idInstructor
				HAVING
					timesFlownTogether = (
						# Finds the max num of flights any customer and instructor have flown together
						SELECT
							max(count)
						FROM
							(
								SELECT
									count(*) AS count
								FROM
									Reservation
								WHERE
									idInstructor IS NOT NULL
								GROUP BY
									idCustomer,
									idInstructor
							) AS t1
					)
			) AS t2
			JOIN Customer AS cust ON cust.idCustomer = t2.idCustomer
			JOIN Instructor AS instr ON instr.idInstructor = t2.idInstructor
		ORDER BY
			instr.nameLast,
			instr.nameFirst,
			cust.nameLast,
			cust.nameFirst`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Selects the Aircraft that's been flown the most
app.get('/view-aircraft-most-flown', (req, res) => {
	db.query(
		`SELECT
			idAircraft,
			class,
			tachTime,
			rentalRate
		FROM
			Aircraft
		WHERE
			tachTime = (
				SELECT
					MAX(tachTime)
				FROM
					Aircraft
			)`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Selects the most used Instructor, their current Rate, and largest single Invoice
app.get('/view-instructor-details-most-used', (req, res) => {
	db.query(
		`SELECT
			inst.*,
			CONCAT(
				'$',
				(inst.rate * MAX(inv.hoursBilledInstructor))
			) AS 'HighestInvoice',
			count(res.idInstructor) AS 'TotalReservationCount'
		FROM
			Reservation res
			JOIN Instructor inst ON res.idInstructor = inst.idInstructor
			JOIN Invoice inv ON res.idInvoice = inv.idInvoice
		WHERE
			res.idInstructor IS NOT NULL
		GROUP BY
			res.idInstructor
		HAVING
			TotalReservationCount = (
				SELECT
					MAX(a1.instructorCount)
				FROM
					(
						SELECT
							count(*) AS instructorCount
						FROM
							Reservation res1
						WHERE
							res1.idInstructor IS NOT NULL
						GROUP BY
							res1.idInstructor
					) a1
			)`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select Aircraft that have gone through more than 15 reservations
// TODO: Consider making 15 variable and this a post() instead of get()
app.get('/view-aircraft-high-reservations', (req, res) => {
	db.query(
		`SELECT
			ac.idAircraft,
			ac.class,
			res.numReservations AS 'Number of Reservation'
		FROM
			Aircraft AS ac
			JOIN (
				SELECT
					idAircraft,
					count(*) AS numReservations
				FROM
					Reservation
				WHERE
					idAircraft IS NOT NULL
				GROUP BY
					idAircraft
				HAVING
					count(*) > 15
			) AS res ON ac.idAircraft = res.idAircraft
		ORDER BY
			class,
			idAircraft`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select all Customers with unpaid Invoices
app.get('/view-customers-unpaid-invoices', (req, res) => {
	db.query(
		`SELECT
			cust.*,
			inv.idInvoice
		FROM
			Customer cust
			JOIN Reservation res ON cust.idCustomer = res.idCustomer
			JOIN Invoice inv ON inv.idInvoice = res.idInvoice
		WHERE
			inv.isPaid = 0`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select Customers with more than 5 Reservations that have no Invoices
app.get('/view-customers-reservations-no-invoices', (req, res) => {
	db.query(
		`SELECT
			cust.idCustomer,
			nameLast,
			nameFirst,
			email
		FROM
			Customer AS cust
			JOIN (
				SELECT
					idCustomer
				FROM
					Reservation
				WHERE
					idInvoice IS NULL
					AND (datediff(curdate(), dateStart) < 31)
				GROUP BY
					idCustomer
				HAVING
					count(idReservation) > 5
			) AS res ON res.idCustomer = cust.idCustomer`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select Customers with no saved Payment information that already have Reservations
app.get('/view-customers-reservations-no-payment', (req, res) => {
	db.query(
		`SELECT
			DISTINCT nameLast,
			nameFirst,
			email
		FROM
			(
				SELECT
					cust.idCustomer,
					nameLast,
					nameFirst,
					email
				FROM
					Customer AS cust
					JOIN Reservation AS res ON cust.idCustomer = res.idCustomer
			) AS custWithRes
			LEFT JOIN PaymentMethod AS pay ON custWithRes.idCustomer = pay.idCustomer
		WHERE
			idPaymentMethod IS NULL
		ORDER BY
			nameLast,
			nameFirst`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select Instructors that have Reservations within the next 24 hours
app.get('/view-instructors-with-reservations', (req, res) => {
	db.query(
		`SELECT
			inst.*,
			res.idReservation,
			res.idCustomer,
			res.dateStart,
			res.dateEnd
		FROM
			Instructor inst
			JOIN Reservation res ON inst.idInstructor = res.idInstructor
		WHERE
			res.dateStart >= (NOW() - INTERVAL 1 DAY)
			AND res.idInstructor IS NOT NULL`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select Ratings of Customers that have booked High Performance Aircraft
// TODO: Consider changing HP to a variable to allow selection for others
app.get('/view-customer-ratings-hp-booked', (req, res) => {
	db.query(
		`SELECT
			a.idCustomer,
			nameFirst,
			nameLast,
			idRating
		FROM
			CustomerHasRating
			RIGHT JOIN (
				SELECT
					Reservation.idCustomer,
					Customer.nameFirst,
					Customer.nameLast
				FROM
					Reservation
					LEFT JOIN Aircraft ON Reservation.idAircraft = Aircraft.idAircraft
					LEFT JOIN Customer ON Reservation.idCustomer = Customer.idCustomer
				WHERE
					isHighPerformance = 1
				GROUP BY
					Reservation.idCustomer
			) a ON a.idCustomer = CustomerHasRating.idCustomer
		ORDER BY
			idCustomer`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Select all Customers and Instructors that have .edu emails
app.get('/view-people-edu-emails', (req, res) => {
	db.query(
		`SELECT
			email,
			nameFirst,
			nameLast
		FROM
			Customer
		WHERE
			email LIKE '%.edu'
		UNION
		SELECT
			email,
			nameFirst,
			nameLast
		FROM
			Instructor
		WHERE
			email LIKE '%.edu'
		UNION
		SELECT
			email,
			nameFirst,
			nameLast
		FROM
			Mechanic
		WHERE
			email LIKE '%.edu'`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Categorize Customer by frequency of Reservations made
app.get('/view-customer-categories-reservation-frequency', (req, res) => {
	db.query(
		`SELECT
			DISTINCT cust.*,
			A1.numberOfReservation,
			CASE
				WHEN A1.numberOfReservation = 1 THEN 'One-time Customer'
				WHEN A1.numberOfReservation >= 2
				AND A1.numberOfReservation < 5 THEN 'Repeated Customer'
				WHEN A1.numberOfReservation >= 5
				AND A1.numberOfReservation < 10 THEN 'Frequent Customer'
				WHEN A1.numberOfReservation >= 10 THEN 'Loyal Customer'
			END customerType
		FROM
			Reservation res
			JOIN Customer cust ON res.idCustomer = cust.idCustomer
			JOIN (
				SELECT
					idCustomer,
					COUNT(*) AS 'numberOfReservation'
				FROM
					Reservation
				GROUP BY
					idCustomer
			) A1 ON res.idCustomer = A1.idCustomer
		ORDER BY
			idCustomer`,
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send(result);
			}
		}
	);
});

// Server start message
app.listen(process.env.PORT, () => {
	console.log('Server started on port ' + process.env.PORT);
});
