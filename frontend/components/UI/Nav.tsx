import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';

import './Nav.css'
import { Link } from 'react-router';

export default function TopNav() {
	// return a top navigation bar component here
	return <div className="top-nav">
		<div className="logo">
			<img src="/favicon.ico" alt="Logo" />
			<h1>Tirocinio</h1>
		</div>
		<nav>
			<ul>
				<li><Link to="/">Index</Link></li>
			</ul>
		</nav>
	</div>
}

export function PageNav({ sitemap }: { sitemap: MenuItem[] }) {
	return <div className="side-nav">
		<PanelMenu model={sitemap} />
	</div>
}
