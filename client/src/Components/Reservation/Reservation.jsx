import { useState, useEffect } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';
import DatePicker from 'react-datepicker';
import Loader from 'react-loader-spinner';
import * as moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function Reservation() {
	const [ customerId, setCustomerId ] = useState(null);
	const [ aircraft, setAircraft ] = useState('');
	const [ start, setStart ] = useState(new Date());
	const [ end, setEnd ] = useState(new Date());
	const [ startFormatted, setStartFormatted ] = useState('');
	const [ endFormatted, setEndFormatted ] = useState('');
	const [ flightPlan, setFlightPlan ] = useState(null);
	const [ instructorId, setInstructorId ] = useState(null);

	const [ reservationData, setReservationData ] = useState();

	const [ isLoadingCreate, setIsLoadingCreate ] = useState(false);
	const [ isLoadingView, setIsLoadingView ] = useState(false);

	useEffect(
		() => {
			setStartFormatted(moment(start).format('YYYY-MM-DD HH:MM:SS'));
		},
		[ start ]
	);

	useEffect(
		() => {
			setEndFormatted(moment(end).format('YYYY-MM-DD HH:MM:SS'));
		},
		[ end ]
	);

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
