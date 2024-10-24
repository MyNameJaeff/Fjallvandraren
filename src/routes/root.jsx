import React, { useState, useRef } from "react";
import { scroller } from "react-scroll"; // Import scroller from react-scroll
import Trips from "../assets/trips.json";
import SelectedTrip from "../components/SelectedTrip";

export default function Root() {
	const [isFocused, setIsFocused] = useState(false);
	const [tripIsSelected, setTripIsSelected] = useState(false);
	const [selectedTrip, setSelectedTrip] = useState(null);
	const timeoutRef = useRef(null);
	const list = Trips.Trips;

	const handleTripClick = (trip) => {
		setSelectedTrip(trip);
		setTripIsSelected(true);
		setIsFocused(false);
	};

	const handleFocus = () => {
		// Clear any pending timeouts when the user focuses on the textarea or dropdown
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsFocused(true);
	};

	const handleBlur = () => {
		// Use a small delay before hiding the dropdown, so clicks can still be detected
		timeoutRef.current = setTimeout(() => {
			setIsFocused(false);
		}, 200); // Adjust delay time if needed
	};

	const scrollToSelectedTrip = () => {
		scroller.scrollTo("selected-trip", {
			duration: 800, // Duration in ms (800ms = 0.8s)
			delay: 0,
			smooth: "easeInOutQuad", // Optional: can be "linear", "easeInOutQuad", etc.
		});
	};

	return (
		<>
			<main>
				<div
					style={{
						textAlign: "center",
						color: "white",
						fontSize: 64,
						fontFamily: "Julius Sans One",
						fontWeight: "400",
						letterSpacing: 6.4,
						wordWrap: "break-word",
					}}
					className="main-title"
				>
					Fjällvandraren
				</div>
				<div className="main-search">
					<div className={`search-box ${isFocused ? "focused" : ""}`}>
						<textarea
							className="search-bar"
							placeholder="Search..."
							onFocus={handleFocus}
							onBlur={handleBlur}
						/>
					</div>
					{isFocused && (
						<div
							className="dropdown-content"
							style={{ maxHeight: "130px", overflowY: "auto" }}
							onMouseEnter={handleFocus} // Keep dropdown visible when hovering
						>
							{list.map((trip) => (
								<div
									key={trip.id}
									className="dropdown-item"
									onClick={() => handleTripClick(trip)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											handleTripClick(trip);
										}
									}}
								>
									{trip.location}
								</div>
							))}
						</div>
					)}
				</div>
				{tripIsSelected && (
					<div
						className="scroll-indicator"
						onClick={scrollToSelectedTrip}
						onKeyUp={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								scrollToSelectedTrip();
							}
						}}
						role="button"
						tabIndex="0" // Make it focusable
					>
						<span className="arrow-down">⬇</span>
					</div>
				)}
				<img
					src="https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD.jpg"
					alt="Astronaut"
					className="main-image"
				/>
			</main>
			<div id="selected-trip" className="selected-trip">
				{selectedTrip ? <SelectedTrip trip={selectedTrip} /> : <SelectedTrip />}
				<div className="grassFooter">
					<img src="public/Grass.png" className="footer-image" alt="Grass" />
				</div>
			</div>
			<style>
				@import
				url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');
			</style>
		</>
	);
}
