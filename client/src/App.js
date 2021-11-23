import { useState } from 'react';
import Axios from 'axios';
import './App.css';

function App() {
	// Reservation
	const [ reservationId, setReservationId ] = useState(null);
	const [ customerId, setCustomerId ] = useState(null);
	const [ aircraft, setAircraft ] = useState('');
	const [ start, setStart ] = useState('2021-11-12 13:45:00');
	const [ end, setEnd ] = useState('2021-11-12 13:45:00');
	const [ flightPlan, setFlightPlan ] = useState(null);
	const [ instructorId, setInstructorId ] = useState(null);

	const addReservation = () => {
		Axios.post('https://cs5021-project.herokuapp.com/create-reservation', {
			reservationId: reservationId,
			customerId: customerId,
			aircraft: aircraft,
			start: start,
			end: end,
			flightPlan: flightPlan,
			instructorId: instructorId
		}).then((res) => {
			console.log('Success');
		});
	};

	// Aircraft
	const [ aircraftList, setAircraftList ] = useState([]);
	const [ customerIdAircraft, setCustomerIdAircraft ] = useState(null);

	const getAircraft = () => {
		Axios.post('https://cs5021-project.herokuapp.com/view-aircraft', { customerIdAircraft: customerIdAircraft }) //
			.then((res) => {
				console.log(res);
				// setAircraftList(res);
			});
	};

	return (
		<div className="App">
			<div className="Reservation Test">
				{/* TODO: Set value to display properly; single source of truth */}
				<h1>Add Reservation</h1>
				<label>Reservation ID</label>
				<input type="number" onChange={(e) => setReservationId(e.target.value)} />

				<label>Customer ID</label>
				<input type="number" onChange={(e) => setCustomerId(e.target.value)} />

				<label>Aircraft</label>
				<input type="text" onChange={(e) => setAircraft(e.target.value)} />

				<label>Start date</label>
				<input type="text" onChange={(e) => setStart(e.target.value)} />

				<label>End date</label>
				<input type="text" onChange={(e) => setEnd(e.target.value)} />

				<label>Flight plan ID</label>
				<input type="number" onChange={(e) => setFlightPlan(e.target.value)} />

				<label>Instructor ID</label>
				<input type="number" onChange={(e) => setInstructorId(e.target.value)} />

				<hr />

				<button
					onClick={() => {
						addReservation();
					}}
				>
					Add Reservation
				</button>
			</div>

			<div className="AircraftData">
				<h1>Show recommended aircraft</h1>

				<label>Customer ID</label>
				<input type="number" onChange={(e) => setCustomerIdAircraft(e.target.value)} />

				<hr />

				<button
					onClick={() => {
						getAircraft();
					}}
				>
					Show
				</button>

				<hr />

				{/* {aircraftList.map((val, key) => {
					return (
						<div key={val.idAircraft}>
							{val.idAircraft} -- {val.class}
						</div>
					);
				})} */}
			</div>
		</div>
	);
}

export default App;
