import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';

import queryData from '../GetQuery/GetQueryData';

function Sidebar() {
	return (
		<ProSidebar width="400px">
			<Menu>
				<MenuItem>
					<Link to="/">Home</Link>
				</MenuItem>
				<MenuItem>
					<Link to="/reservation">Create Reservation</Link>
				</MenuItem>
				<SubMenu title="Sample Queries" defaultOpen="true">
					<MenuItem>
						<Link to="/recommended-aircraft">Recommended Aircraft</Link>
					</MenuItem>
					{queryData.map((data) => {
						return (
							<MenuItem key={data.url}>
								<Link to={'/' + data.url}>{data.title}</Link>
							</MenuItem>
						);
					})}
				</SubMenu>
			</Menu>
		</ProSidebar>
	);
}

export default Sidebar;
