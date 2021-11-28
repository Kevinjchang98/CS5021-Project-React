import { useState, useEffect } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';
import DatePicker from 'react-datepicker';
import Loader from 'react-loader-spinner';
import * as moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function Reservation() {
	// Input form data
	const [ customerId, setCustomerId ] = useState(null);
	const [ aircraft, setAircraft ] = useState('');
	const [ start, setStart ] = useState(new Date());
	const [ end, setEnd ] = useState(new Date());
	const [ flightPlan, setFlightPlan ] = useState(null);
	const [ instructorId, setInstructorId ] = useState(null);

	// Start and end Date objects reformatted to SQL datetime strings
	const [ startFormatted, setStartFormatted ] = useState('');
	const [ endFormatted, setEndFormatted ] = useState('');

	// Reservation table data
	const [ reservationData, setReservationData ] = useState();

	// Loading statuses for creating reservation and viewing Reservation table
	const [ isLoadingCreate, setIsLoadingCreate ] = useState(false);
	const [ isLoadingView, setIsLoadingView ] = useState(false);

	// Format start date every time it's changed
	useEffect(
		() => {
			setStartFormatted(moment(start).format('YYYY-MM-DD HH:MM:SS'));
		},
		[ start ]
	);

	// Format end date every time it's changed
	useEffect(
		() => {
			setEndFormatted(moment(end).format('YYYY-MM-DD HH:MM:SS'));
		},
		[ end ]
	);

	// Sends a post request to MySQL server, sets loading status properly and automatically runs the viewNewestReservations() function once the new reservation is successfully created
	const addReservation = () => {
		setIsLoadingCreate(true);
		Axios.post('https://cs5021-project.herokuapp.com/create-reservation', {
			customerId: customerId,
			aircraft: aircraft,
			start: startFormatted,
			end: endFormatted,
			flightPlan: flightPlan,
			instructorId: instructorId
		}).then((res) => {
			setIsLoadingCreate(false);
			viewNewestReservations();
		});
	};

	// Queries the MySQL server, sets loading status properly, deletes old reservationData when awaiting new data
	const viewNewestReservations = () => {
		setIsLoadingView(true);
		setReservationData(null);
		Axios.get('https://cs5021-project.herokuapp.com/view-newest-reservations').then((res) => {
			setIsLoadingView(false);
			setReservationData(res.data);
		});
	};

	return (
		<div className="Reservation">
			{/* TODO: Set value to display properly; single source of truth */}
			<h1>Create Reservation</h1>

			{/* TODO: CSS for input boxes */}
			<label>Customer ID</label>
			<input type="number" onChange={(e) => setCustomerId(e.target.value)} />

			<label>Aircraft</label>
			<input type="text" onChange={(e) => setAircraft(e.target.value)} />

			<label>Start date and time</label>
			<DatePicker
				dateFormat="yyyy-MM-dd HH:mm"
				selected={start}
				onChange={(date) => {
					setStart(date);
				}}
				showTimeSelect
				timeFormat="HH:mm"
			/>

			<label>End date and time</label>
			<DatePicker
				dateFormat="yyyy-MM-dd HH:mm"
				selected={end}
				onChange={(date) => {
					setEnd(date);
				}}
				showTimeSelect
				timeFormat="HH:mm"
			/>

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

			<br />

			<JsonToTable json={reservationData} />
		</div>
	);
}

export default Reservation;
