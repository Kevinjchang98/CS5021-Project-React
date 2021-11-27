import { useState } from 'react';
import Axios from 'axios';

function AircraftRecommendation() {
	const [ aircraftList, setAircraftList ] = useState([]);
	const [ customerIdAircraft, setCustomerIdAircraft ] = useState(null);

	const getAircraft = () => {
		Axios.post('https://cs5021-project.herokuapp.com/view-aircraft', { customerIdAircraft: customerIdAircraft }) //
			.then((res) => {
				console.log(res.data);
				setAircraftList(res.data);
			});
	};
	return (
		<div className="AircraftRecommendation">
			<h1>Show recommended aircraft</h1>

			<label>Customer ID</label>
			<input type="number" onChange={(e) => setCustomerIdAircraft(e.target.value)} />

			<button
				onClick={() => {
					getAircraft();
				}}
			>
				Show
			</button>

			{aircraftList.map((val, key) => {
				return (
					<div key={val.idAircraft}>
						{val.idAircraft} -- {val.class}
					</div>
				);
			})}
		</div>
	);
}

export default AircraftRecommendation;
