export default function TripsListItem(props) {
	const {
		date,
		location,
		shortDescription,
		description,
		images,
		extraStuff,
		id,
	} = props;

    const largeFirstLetter = (location).charAt(0).toUpperCase() + (location).slice(1);

	function handleClick(e) {
		if (props.number !== 0) {
			let imagesStr = "";
			// biome-ignore lint/complexity/noForEach: <I dont know>
			images.forEach((image) => {
				imagesStr += `
                    <img src="/images/${image}" alt="${image}" class="projectImage">
                `;
			});

			const projectMonitor = document.querySelector(".projectText");
			projectMonitor.style.justifyContent = "start";
			projectMonitor.style.alignItems = "start";

			const project = document.querySelector(".project");
			project.scrollTop = 0;
			project.style.width = "100%";
			project.style.height = "80%";
			project.style.padding = "5%";
			project.style.overflow = "scroll";
			project.style.flexDirection = "column";
			project.innerHTML = `
            <a href="${list[props.number - 1].link}" target="_blank"><h3 class="projectTitle">${largeFirstLetter}</h3></a>
            <p class="projectTextContent"> ${list[props.number - 1].text} </p>
            <div class="projectImages"> ${imagesStr} </div>
            `;
		}
	}
	if (props.number !== 0) {
		return (
			<li onClick={handleClick} onKeyDown={handleClick} className={`Date:${date} - ID:${id}`}>
				<p className="projectListName">{`${largeFirstLetter} `}</p><span className="listItemNumber">{id}</span>
			</li>
		);
	}
	return (
		<li className={props.name + props.number}>
			<a href={list[list.length - 1].link} rel="noreferrer" target="_blank">
				{largeFirstLetter}
			</a>
			<span className="listItemNumber">*</span>
		</li>
	);
}
