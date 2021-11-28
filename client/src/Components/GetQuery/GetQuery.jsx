import { useState, useEffect } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';
import Loader from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function GetQuery(props) {
	// Variables for data and loading status
	const [ data, setData ] = useState();
	const [ isLoading, setIsLoading ] = useState(false);

	// Clear the saved data whenever the page title (so the selected query) changes
	useEffect(
		() => {
			setData();
		},
		[ props.title ]
	);

	// Queries the MySQL server, sets loading status properly and sets data once received
	const query = () => {
		setIsLoading(true);
		Axios.get('https://cs5021-project.herokuapp.com/' + props.url) //
			.then((res) => {
				setData(res.data);
				setIsLoading(false);
			});
	};

	return (
		<div className="GetQueryBody">
			<h1>{props.title}</h1>

			<p>{props.description}</p>

			<button
				onClick={() => {
					query();
				}}
			>
				Run query
			</button>

			<br />

			{isLoading ? (
				<div className="LoadIcon">
					<Loader type="TailSpin" color="#1D1D1D" height={80} width={80} />
				</div>
			) : null}

			<JsonToTable json={data} />
		</div>
	);
}

export default GetQuery;
