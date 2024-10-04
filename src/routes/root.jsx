import { Outlet } from "react-router-dom";
import TripsList from "../assets/trips.json";
import TripsListItem from "../components/TripsListItem";

export default function Root() {
	const list = TripsList.Trips;
	return (
		<>
		
			<h1>Hello!</h1>
			<div>
				<ul>
					{list.map((project) => {
						return (
							<TripsListItem
								key={project.id}
								date={project.date}
								location={project.location}
								shortDescription={project.shortDescription}
								description={project.description}
								images={project.images}
								extraStuff={project.extraStuff}
								id={project.id}
							/>
						);
					})}
				</ul>
			</div>
		</>
	);
}

/*
<div id="sidebar">
				<h1>React Router Contacts</h1>
				<div>
					<form id="search-form" role="search">
						<input
							id="q"
							aria-label="Search contacts"
							placeholder="Search"
							type="search"
							name="q"
						/>
						<div id="search-spinner" aria-hidden hidden={true} />
						<div className="sr-only" aria-live="polite" />
					</form>
					<form method="post">
						<button type="submit">New</button>
					</form>
				</div>
				<nav>
					<ul>
						<li>
							<a href={"/contacts/1"}>Your Name</a>
						</li>
						<li>
							<a href={"/contacts/2"}>Your Friend</a>
						</li>
					</ul>
				</nav>
			</div>
			<div id="detail">
				<Outlet />
			</div>
*/
