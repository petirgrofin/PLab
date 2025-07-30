import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Brilliant</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/main" className="text-blue-600 hover:underline">
          Home
        </Link>
        <Link to="/courses" className="text-blue-600 hover:underline">
          Courses
        </Link>
        {username && (
          <span className="mr-4 text-gray-700">Hola, {username}!</span>
        )}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:underline font-semibold"
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
