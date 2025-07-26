// pages/LoginPage.jsx
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mb-4">Login</h2>
      <button onClick={() => navigate("/main")} className="bg-blue-500 text-white px-4 py-2 rounded">Enter</button>
    </div>
  );
}
