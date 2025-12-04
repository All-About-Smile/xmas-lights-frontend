import { Link } from "react-router-dom"

const Home = () => {
    return (
        <>
        <h1>Home</h1>
        <ul>
            <li><Link to="/todo">todo</Link></li>
            <li><Link to="/coin">coin</Link></li>
            <li><Link to="/movie">movie</Link></li>
        </ul>
        </>
    );
}

export default Home