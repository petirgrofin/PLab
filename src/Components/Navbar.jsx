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
      <h1 className="text-xl font-semibold">PLab</h1>
      <div className="space-x-4 flex items-center">
        <Link to="/main" className="text-white hover:bg-gray-800 bg-black px-4 py-2 rounded-sm font-semibold transition-all">
          Home
        </Link>
        <Link to="/courses" className="text-white hover:bg-gray-800 bg-black px-4 py-2 rounded-sm font-semibold transition-all">
          Courses
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:cursor-pointer hover:text-white border-1 border-red-500 hover:bg-red-500 font-semibold px-4 py-2 rounded-sm transition-all"
          type="button"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
