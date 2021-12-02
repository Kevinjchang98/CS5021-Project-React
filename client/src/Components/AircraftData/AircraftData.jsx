import Axios from 'axios';
import { select, axisBottom, axisLeft, scaleLinear, scaleBand, max } from 'd3';
import { useEffect, useRef, useState } from 'react';

import { JsonToTable } from 'react-json-to-table';

import Loader from 'react-loader-spinner';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

function AircraftData() {
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isLoaded, setIsLoaded ] = useState(false);

	const svgRef = useRef();
	const wrapperRef = useRef();

	const [ data, setData ] = useState();

	const dimensions = { width: 500, height: 200 };

	const query = () => {
		setIsLoading(true);
		Axios.get('https://cs5021-project.herokuapp.com/view-aircraft-data') //
			.then((res) => {
				setData(res.data);
				setIsLoading(false);
				setIsLoaded(true);
			});
	};

	useEffect(
		() => {
			if (isLoaded) {
				const classes = [ ...new Set(data.map((aircraft) => aircraft.class)) ];
				console.log(classes);

				let countsByClass = [];

				classes.map((row1) => {
					let aircraftClass1 = row1;
					let count = 0;
					data.map((row2) => {
						let aircraftClass2 = row2.class;

						if (aircraftClass2 == aircraftClass1) {
							count++;
						}
					});

					countsByClass.push(count);
				});

				console.log(countsByClass);

				const svg = select(svgRef.current);

				const xScale = scaleBand()
					.domain(classes.map((value, index) => index)) //
					.range([ 0, dimensions.width ])
					.padding(0.4);

				const xScaleLabels = scaleBand()
					.domain(classes.map((value, index) => value)) //
					.range([ 0, dimensions.width ])
					.padding(0.4);

				const yScale = scaleLinear()
					.domain([ 0, 5 + max(countsByClass) ]) //
					.range([ dimensions.height, 0 ]);

				const xAxis = axisBottom(xScaleLabels);
				svg
					.select('.x-axis') //
					.style('transform', 'translateY(' + dimensions.height + 'px)') //Hard coded 150
					.call(xAxis);

				const yAxis = axisLeft(yScale);
				svg
					.select('.y-axis') //
					.call(yAxis);

				svg
					.selectAll('.bar') //
					.data(countsByClass)
					.join('rect')
					.attr('class', 'bar')
					.attr('x', (value, index) => xScale(index))
					.attr('y', yScale)
					.attr('width', xScale.bandwidth())
					.attr('height', (value) => dimensions.height - yScale(value))
					.attr('fill', 'var(--blue)');
			}
		},
		[ isLoaded ]
	);

	return (
		<div className="GetQueryBody">
			<h1>Aircraft Data</h1>

			<p>Sample visualization of the number of each class of aircraft the flight school has using d3.js.</p>

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

			<div ref={wrapperRef} className="graphWrapper">
				<svg ref={svgRef}>
					<g className="x-axis" />
					<g className="y-axis" />
				</svg>
			</div>

			<JsonToTable json={data} />
		</div>
	);
}

export default AircraftData;
