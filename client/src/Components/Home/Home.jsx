import internalModel from './ModelExport.png';

function Home() {
	return (
		<div className="Home">
			<h1>CS5021-01 Group 7 Project</h1>
			<p>Kevin Chang, Kenny Halim, William McDonnell</p>

			<h2>Web Application</h2>
			<p>
				This web application was created with a React front-end hosted on Netlify and utilizes a Node.js server
				hosted on Heroku to query the MySQL database hosted with ClearDB on the same Heroku dyno. For those
				unfamiliar with the original project, the mission statement and a diagram of the underlying database are
				detailed in the following sections.
			</p>

			<p>
				The basic functionality of the class's Queryrunner application is implemented through the sample queries
				section on the left sidebar where the table returned by the MySQL database is displayed directly.
			</p>

			<p>
				Additional functionality of creating a new reservation is also implemented where a basic input form is
				given through which a new Reservation ID is generated and inserted into the MySQL database's Reservation
				table. Additionally, the stored procedure functionality is included, albeit with the SQL code not
				running the stored procedure on the ClearDB server but sending the entire query each time the function
				is called. This is due to limitations with admin permissions on the ClearDB's free plan, and the code to
				call the stored procedure is properly implemented in a comment in the source code.
			</p>

			<h2>Mission Statement</h2>
			<p>
				Our mission is to make aircraft management and planning easier for flight schools. Our application will
				allow for scheduling of aircraft by customers and keeping track of aircraft availability, maintenance
				schedules, customer and instructor information, as well as billing information to reduce mistakes and
				provide a better overview of resources for the flight school.
			</p>

			<h2>Internal Model of the MySQL Database</h2>
			<img src={internalModel} alt="Internal model" height="100%" width="100%" />
		</div>
	);
}

export default Home;
