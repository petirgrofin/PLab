// components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <h1 className="text-xl font-semibold">Brilliant</h1>
      <div className="space-x-4">
        <Link to="/main" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/courses" className="text-blue-600 hover:underline">Courses</Link>
      </div>
    </nav>
  );
}
