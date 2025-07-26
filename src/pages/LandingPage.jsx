// pages/LandingPage.jsx
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Brilliant!</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link>
        <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </div>
  );
}
