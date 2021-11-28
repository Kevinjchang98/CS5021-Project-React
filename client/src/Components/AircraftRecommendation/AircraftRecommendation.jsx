import { useState } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';
import Loader from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function AircraftRecommendation() {
	const [ aircraftList, setAircraftList ] = useState([]);
	const [ customerIdAircraft, setCustomerIdAircraft ] = useState(null);
	const [ isLoading, setIsLoading ] = useState(false);

	const getAircraft = () => {
		setIsLoading(true);
		Axios.post('https://cs5021-project.herokuapp.com/view-aircraft', { customerIdAircraft: customerIdAircraft }) //
			.then((res) => {
				setAircraftList(res.data);
				setIsLoading(false);
			});
	};
	return (
		<div className="AircraftRecommendation">
			<h1>Show recommended aircraft</h1>

			<p>
				This procedure takes in a customer’s id number and produces a list of aircraft that are flyable for the
				customer based on their ratings, the annual inspection date, flyable hours before the aircraft is due
				for the 100 hour maintenance, and also shows the date of the most recent maintenance that was performed
				on the aircraft.
			</p>
			<p>
				The procedure checks all available aircraft in the school and only selects classes that the customer
				holds ratings for. For example, if a customer only has a Private Pilot License rating for Aircraft
				Single Engine Land, the procedure will not show aircraft of class Aircraft Single Engine Sea. The
				various endorsements/ratings such as if the aircraft are Tailwheel, Comlex, or High Performance are also
				checked against the customer’s ratings they hold.
			</p>
			<p>
				The procedure then ensures that the plane is not scheduled for its Annual Inspection within 1 day of
				when the procedure is run. The procedure also shows how many hours is left on the engine before it is
				due for the 100 Hour Inspection which is to be done every 100 hours the engine is run in a certain RPM
				band, and important for the customer to choose a suitable plane (e.g., If an aircraft only has 1.2 hours
				left before it’s due for its 100 Hour but the customer wants to make a 3 hour flight then the customer
				won’t choose that aircraft).
			</p>
			<p>Finally, the procedure also shows the date of the most recent maintenance that was performed on it.</p>
			<p>
				This could be a commonly used query that is complex enough to be stored instead of manually recreated
				each time, and suitable to be implemented on the front-end as something that is accessible for each
				customer where the results could be included as a list of “Recommended” or “Most Suitable” aircraft for
				the particular moment the customer is attempting to create a new reservation.
			</p>
			<p>
				Recommended sample Customer ID values for testing on the current set of sample data are 1, 4, and 422.
			</p>

			<label>Customer ID</label>

			<input type="number" onChange={(e) => setCustomerIdAircraft(e.target.value)} />

			<br />

			<button
				onClick={() => {
					getAircraft();
				}}
			>
				Show
			</button>

			{isLoading ? (
				<div className="LoadIcon">
					<Loader type="TailSpin" color="#1D1D1D" height={80} width={80} />
				</div>
			) : null}

			<br />

			{/* {aircraftList.map((val) => {
				return (
					<div key={val.idAircraft}>
						{val.idAircraft} -- {val.class}
					</div>
				);
			})} */}

			<JsonToTable json={aircraftList} />
		</div>
	);
}

export default AircraftRecommendation;
