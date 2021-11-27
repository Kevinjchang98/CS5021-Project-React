import { useState, useEffect } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';

function GetQuery(props) {
	const [ data, setData ] = useState();

	useEffect(
		() => {
			setData();
		},
		[ props.title ]
	);

	const query = () => {
		Axios.get('https://cs5021-project.herokuapp.com/' + props.url) //
			.then((res) => {
				setData(res.data);
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

			<JsonToTable json={data} />
		</div>
	);
}

export default GetQuery;
