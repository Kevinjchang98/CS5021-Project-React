import { useState } from 'react';
import Axios from 'axios';
import Loader from 'react-loader-spinner';
import { JsonToTable } from 'react-json-to-table';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function Reservation() {
	const [ customerId, setCustomerId ] = useState(null);
	const [ aircraft, setAircraft ] = useState('');
	const [ start, setStart ] = useState('2021-11-12 13:45:00'); // TODO: Update default value
	const [ end, setEnd ] = useState('2021-11-12 13:45:00');
	const [ flightPlan, setFlightPlan ] = useState(null);
	const [ instructorId, setInstructorId ] = useState(null);

	const [ reservationData, setReservationData ] = useState();

	const [ isLoadingCreate, setIsLoadingCreate ] = useState(false);
	const [ isLoadingView, setIsLoadingView ] = useState(false);

	const addReservation = () => {
		setIsLoadingCreate(true);
		Axios.post('https://cs5021-project.herokuapp.com/create-reservation', {
			customerId: customerId,
			aircraft: aircraft,
			start: start,
			end: end,
			flightPlan: flightPlan,
			instructorId: instructorId
		}).then((res) => {
			setIsLoadingCreate(false);
		});
	};

	const viewNewestReservations = () => {
		setIsLoadingView(true);
		Axios.get('https://cs5021-project.herokuapp.com/view-newest-reservations').then((res) => {
			setIsLoadingView(false);
			setReservationData(res);
		});
	};

	return (
		<div className="Reservation">
			{/* TODO: Set value to display properly; single source of truth */}
			<h1>Create Reservation</h1>

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

			{isLoadingCreate ? (
				<div className="LoadIcon">
					<Loader type="TailSpin" color="#1D1D1D" height={80} width={80} />
				</div>
			) : (
				<button
					onClick={() => {
						addReservation();
					}}
				>
					Create new reservation
				</button>
			)}

			<br />

			{isLoadingView ? (
				<div className="LoadIcon">
					<Loader type="TailSpin" color="#1D1D1D" height={80} width={80} />
				</div>
			) : (
				<button
					onClick={() => {
						viewNewestReservations();
					}}
				>
					View newest reservations
				</button>
			)}

			<JsonToTable json={reservationData} />
		</div>
	);
}

export default Reservation;
