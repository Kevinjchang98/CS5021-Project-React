import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';

import queryData from '../GetQuery/GetQueryData';

function Sidebar() {
	return (
		<div className="SidebarWrapper">
			<ProSidebar width="100%">
				<SidebarHeader>
					<div
						style={{
							padding: '20px',
							textTransform: 'uppercase',
							fontWeight: 'bold',
							fontSize: 14,
							letterSpacing: '1px',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap'
						}}
					>
						{/* Title at the top of the sidebar */}
						CS5021-1 Group 7
						<br />
						Flight School Management Database
					</div>
				</SidebarHeader>

				<Menu>
					{/* Link to the introduction page */}
					<MenuItem>
						<Link to="/">Introduction</Link>
					</MenuItem>

					{/* Sample queries submenu drop-down */}
					<SubMenu title="Sample Queries" defaultOpen="true">
						{/* Creates links from the contents of the Components/GetQueryData.js file */}
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
		</div>
	);
}

export default Sidebar;
