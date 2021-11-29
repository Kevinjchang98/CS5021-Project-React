import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Sidebar from './Components/Sidebar/Sidebar';
import Home from './Components/Home/Home';
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
						{/* If the url is / then go to intro/home page */}
						<Route path="/" element={<Home />} />

						{/* Creates pages based on the contents of the Components/GetQueryData.js file */}
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
