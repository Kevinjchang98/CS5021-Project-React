const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Create connection pool
const db = mysql.createPool({
	connectionLimit: 10,
	user: 'b57e165b4c319d',
	host: 'us-cdbr-east-04.cleardb.com',
	// password needs to be set as a config var on heroku with the name DB_PASSWORD
	password: process.env.DB_PASSWORD,
	database: 'heroku_200e0e8c7fc90b0'
});

// View aircraft with soonest annual inspection

// Defines the url from which you'll access this query's results
app.get('/view-aircraft-soonest-annual', (req, res) => {
	db.query(
		// SQL code between ``
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
		// If error log it in console, otherwise return results
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

// Server start message
app.listen(process.env.PORT, () => {
	console.log('Server started on port' + process.env.PORT);
});
