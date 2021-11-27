import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Sidebar from './Components/Sidebar/Sidebar';
import Home from './Components/Home/Home';
import Reservation from './Components/Reservation/Reservation';
import AircraftRecommendation from './Components/AircraftRecommendation/AircraftRecommendation';
import GetQuery from './Components/GetQuery/GetQuery';

import queryData from './Components/GetQuery/GetQueryData';

function App() {
	return (
		<Router>
			<div className="App">
				<div>
					<Sidebar />
				</div>

				<div className="ContentBody">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/recommended-aircraft" element={<AircraftRecommendation />} />
						<Route path="/reservation" element={<Reservation />} />

						{queryData.map((data) => {
							return (
								<Route
									key={data.url}
									path={'/' + data.url}
									element={
										<GetQuery title={data.title} url={data.url} description={data.description} />
									}
								/>
							);
						})}
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
