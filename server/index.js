const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Password to mysql db in plaintext in password.config file
// var fs = require('fs');
// const passwordVar = fs.readFileSync('password.config').toString();

// TODO: Make sure database dump has reactClient as an additional user for this to work
const db = mysql.createConnection({
	user: 'b57e165b4c319d',
	host: 'us-cdbr-east-04.cleardb.com',
	password: '1570dbc1',
	database: 'heroku_200e0e8c7fc90b0'
});

// Creates a reservation
app.post('/create-reservation', (req, res) => {
	const reservationId = req.body.reservationId;
	const customerId = req.body.customerId;
	const aircraft = req.body.aircraft;
	const start = req.body.start;
	const end = req.body.end;
	const flightPlan = req.body.flightPlan;
	const instructorId = req.body.instructorId;

	db.query(
		'INSERT INTO reservation (idReservation, idCustomer, idAircraft, dateStart, dateEnd, idFlightPlan, idInstructor) VALUES (?, ?, ?, ?, ?, ?, ?)',
		[ reservationId, customerId, aircraft, start, end, flightPlan, instructorId ],
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				res.send('Reservation created');
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
				console.log(result);
				res.send(result);
			}
		}
	);
});

// Server start message
app.listen(process.env.PORT, () => {
	console.log(`Server started on port`);
});
