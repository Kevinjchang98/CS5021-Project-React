const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Password to mysql db in plaintext in password.config file
var fs = require('fs');
const passwordVar = fs.readFileSync('password.config').toString();

// TODO: Make sure database dump has reactClient as an additional user for this to work
const db = mysql.createConnection({
	user: 'reactClient',
	host: 'localhost',
	password: 'password',
	database: 'mm_cpsc502101team07'
});

// Creates a reservation
app.post('/create-reservation', (req, res) => {
	console.log(req.body);
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
	console.log(req.body);

	const customerId = req.body.customerIdAircraft;

	db.query('call mm_cpsc502101team07.listFlyableAircraft(?)', [ customerId ], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.send(result);
		}
	});
});

// Server start message
app.listen(3001, () => {
	console.log('Server started');
});
