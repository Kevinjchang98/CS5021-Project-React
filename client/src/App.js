import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Reservation from './Components/Reservation/Reservation';
import AircraftRecommendation from './Components/AircraftRecommendation/AircraftRecommendation';
import Sidebar from './Components/Sidebar/Sidebar';

function App() {
	return (
		<Router>
			<div className="App">
				<div>
					<Sidebar />
				</div>

				<div className="ContentBody">
					<Routes>
						<Route path="/recommended-aircraft" element={<AircraftRecommendation />} />
						<Route path="/reservation" element={<Reservation />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

export default App;
