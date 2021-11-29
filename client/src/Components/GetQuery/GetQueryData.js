const queryData = [
	{
		title: 'Soonest Annual',
		// url needs to match what you set in the server's index.js file
		url: 'view-aircraft-soonest-annual',
		description:
			'This query allows the flight school to see which annual inspections are coming up the soonest for planes of each category. Results are split by category as flight schools may choose to allocate inspections differently for classes, send the aircraft to different places for inspections, etc.'
	},
	{
		title: 'View the Most Worked Mechanic',
		url: 'view-mechanic-most-performed',
		description:
			'Shows the mechanic and their basic information that’s performed the largest number of maintenance instances and shows out the most common type of fix they’ve performed.'
	}
];

export default queryData;
