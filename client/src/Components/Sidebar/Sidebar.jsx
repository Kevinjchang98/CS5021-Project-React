import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

import { Link } from 'react-router-dom';

function Sidebar() {
	return (
		<ProSidebar>
			<Menu>
				<MenuItem>
					<Link to="/">Home</Link>
				</MenuItem>
				<SubMenu title="Sample Queries">
					<MenuItem>
						<Link to="/recommended-aircraft">Recommended Aircraft</Link>
					</MenuItem>
					<MenuItem>
						<Link to="/reservation">Create Reservation</Link>
					</MenuItem>
				</SubMenu>
			</Menu>
		</ProSidebar>
	);
}

export default Sidebar;
