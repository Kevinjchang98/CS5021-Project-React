import { useState } from 'react';
import Axios from 'axios';

function Reservation() {
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

	return (
		<div className="Reservation">
			{/* TODO: Set value to display properly; single source of truth */}
			<h1>Create Reservation</h1>
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
				Create
			</button>
		</div>
	);
}

export default Reservation;
