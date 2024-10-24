import React, { useState, useEffect } from "react";

export default function SelectedTrip({ trip }) {
	const [selectedImage, setSelectedImage] = useState({});
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [tripTitle, setTripTitle] = useState("");
    const [tripDescription, setTripDescription] = useState("");
    const [images, setImages] = useState([]);


	// Update trip title and description based on selected trip
	useEffect(() => {
		if (!trip) {
			setTripTitle("No trip selected");
			setTripDescription("Please select a trip from the list");
			setSelectedImage({
				imageSrc:
					"https://cdn.britannica.com/10/241010-049-3EB67AA2/highest-mountains-of-the-world-on-each-continent.jpg",
				imageAlt: "Placeholder image",
				imageDescription: "Placeholder image description",
			});
		} else {
			setTripTitle(trip.location);
			setTripDescription(trip.description);
			setImages(trip.images || []);
			setSelectedImage(trip.images[0] || {}); // Set the first image or an empty object
		}
        setCurrentImageIndex(0); // Reset the current image index
	}, [trip]); // Only run when the trip changes

	const handleLeftArrowClick = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1,
		);
	};

	const handleRightArrowClick = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1,
		);
	};

	// Update selected image based on the current image index
	useEffect(() => {
		if (images.length > 0) {
			setSelectedImage(images[currentImageIndex]);
		}
	}, [currentImageIndex, images]);

	return (
		<div className="theSelectedTrip">
			<h2 className="tripTitle">{tripTitle}</h2>
			<p className="tripDescription">{tripDescription}</p>
			<div className="trip-images">
				<div className="imageContainer">
					<div
						className="imageArrow"
						onClick={handleLeftArrowClick}
						onKeyDown={(e) => e.key === "Enter" && handleLeftArrowClick()}
						role="button"
						tabIndex="0" // Make it focusable
					>
						<span className="arrow-left">⬅</span>
					</div>
					<div className="trip-image-container">
						<img
							src={selectedImage.imageSrc}
							alt={selectedImage.imageAlt}
							className="trip-image"
						/>
					</div>
					<div
						className="imageArrow"
						onClick={handleRightArrowClick}
						onKeyDown={(e) => e.key === "Enter" && handleRightArrowClick()}
						role="button"
						tabIndex="0" // Make it focusable
					>
						<span className="arrow-right">➡</span>
					</div>
				</div>
				<p className="trip-image-description">
					{selectedImage.imageDescription}
				</p>
			</div>
		</div>
	);
}
