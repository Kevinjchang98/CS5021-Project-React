const queryData = [
	{
		title: 'Soonest Annual',
		url: 'view-aircraft-soonest-annual',
		description:
			'This query allows the flight school to see which annual inspections are coming up the soonest for planes of each category. Results are split by category as flight schools may choose to allocate inspections differently for classes, send the aircraft to different places for inspections, etc.'
	},
	{
		title: 'View the Most Worked Mechanic',
		url: 'view-mechanic-most-performed',
		description:
			'Shows the mechanic and their basic information that’s performed the largest number of maintenance instances and shows out the most common type of fix they’ve performed.'
	},
	{
		title: 'View the Most Frequently Flown-together Customer and Instructor Pair(s)',
		url: 'view-customer-instructor-pair',
		description:
			'Allows the flight school to inspect which pair(s) of Customer and Instructor have flown together the most. Could be used in further analysis for staffing decisions, or allocation of resources.'
	},
	{
		title: 'View the Most Flown Aircraft',
		url: 'view-aircraft-most-flown',
		description:
			'Allows the school to see the aircraft that has the current highest time logged on its tachometer timer and also includes the class of aircraft and the current rental rate for that aircraft. Could be useful for business decisions regarding purchasing of new aircraft or updating of current rental rates. Also informs business of which aircraft may be nearing the time where an engine rebuild could be considered.'
	},
	{
		title: 'View the Most Worked Instructor',
		url: 'view-instructor-details-most-used',
		description:
			'Shows the instructor that had the highest number of reservations, their current rate for customers to fly with them and the value of the highest Invoice created by a reservation they were in. Could allow for the school to make decisions based on rates of this instructor or other instructors, and hiring/staffing decisions.'
	},
	{
		title: 'Select Aircraft with more than 15 Reservations',
		url: 'view-aircraft-high-reservations',
		description:
			'Shows all the aircraft that have had at least 15 reservations. Could be easily modified for any number of reservations, but this allows the flight school to see which are their most popular aircraft as well as the class of aircraft. May inform the flight school of future purchasing decisions of new aircraft.'
	},
	{
		title: 'Select all Customers with Unpaid Invoices',
		url: 'view-customers-unpaid-invoices',
		description:
			'Shows all the customers that have made reservations that generate invoices but have not paid them. Would allow the flight school to follow up with customers that have unpaid invoices through means such as sending a reminder email or text message.'
	},
	{
		title: 'Select Customers with more than 5 Reservations but no Invoices',
		url: 'view-customers-reservations-no-invoices',
		description:
			'Shows customers that have had more than 5 reservations with no linked invoices (i.e. Reservations that had to be canceled thus no instructor or aircraft charges were applied and no invoice was generated) within the last month. Could allow flight schools to gain insight into if any customers repeatedly cancel appointments, or if weather or other conditions cancelled an excessive amount of reservations for a particular student who should then be given priority to reschedule their cancelled reservations.'
	},
	{
		title: 'Select Customers with Reservations but no Payment Info',
		url: 'view-customers-reservations-no-payment',
		description:
			'Lists out all customers that don’t have any payment information saved but already made reservations, which may let the flight school know which customers to request information from if the particular flight school’s business rules require saved payment information, for example.'
	},
	{
		title: 'Select Instructors with Reservations',
		url: 'view-instructors-with-reservations',
		description:
			'Shows all instructors that have upcoming reservations. Could be used by a flight school for automated reminders, checking that instructors won’t overfly their maximum allowed 8 hours of instruction flight time per 24 hours, ensuring the front desk is always staffed by at least one person, etc.'
	},
	{
		title: "Show HP Reservations' Customers' Ratings",
		url: 'view-customer-ratings-hp-booked',
		description:
			'Lists out all the customers that have reservations for high performance aircraft and the ratings they hold. Could allow flight schools to apply their own business rules such as ensuring that these customers have an instructor with them, a friend that will act as pilot with the appropriate ratings, etc. A null value indicates a student pilot that hasn’t obtained any ratings yet but has a reservation scheduled.'
	},
	{
		title: 'Show .edu Emails',
		url: 'view-people-edu-emails',
		description:
			'Selects all customers, instructors and/or mechanics that have email addresses that end in .edu. May be useful if a flight school wants to advertise its relations with various schools, or connecting students/alumni with each other.'
	},
	{
		title: 'Categorize Customers',
		url: 'view-customer-categories-reservation-frequency',
		description:
			'This creates a new attribute that categorizes customers into three groups: one-time customers, repeated customers, and frequent customers. Could be useful for further business analysis where the school might want to only run various analyses on certain types of customers.'
	}
];

export default queryData;
