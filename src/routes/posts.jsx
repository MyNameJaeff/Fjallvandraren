import Post from "../components/post";
import Trips from "../assets/trips.json";

export default function Posts() {
	const list = Trips.Trips;
    console.log(list);
    return (
        <>
            <ul>
                {list.map((trip) => {
                    return <Post key={trip.id} trip={trip} />;
                })}
            </ul>
            <Post />
        </>
    );
}