import { useState } from 'react';
import Axios from 'axios';
import { JsonToTable } from 'react-json-to-table';

function GetQuery(props) {
	const [ data, setData ] = useState();

	const query = () => {
		Axios.get('https://cs5021-project.herokuapp.com/' + props.url) //
			.then((res) => {
				setData(res.data);
			});
	};
	return (
		<div className="GetQueryBody">
			<h1>{props.title}</h1>

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
