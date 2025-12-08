import { Link } from "react-router-dom";

function TestHome() {
  return (
    <>
      <h1 className="text-lg">Home</h1>
      <ul>
        <li>
          <Link to="/light">light</Link>
        </li>
        <li>
          <Link to="/login">login</Link>
        </li>
      </ul>
    </>
  );
}

export default TestHome;
