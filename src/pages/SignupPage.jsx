import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario: nombreUsuario, contrasena_hash: contrasena }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }

      const data = await res.json();

      // Save JWT token in localStorage
      localStorage.setItem("access_token", data.access_token);

      // Save username
      localStorage.setItem("username", nombreUsuario);

      // Redirect to main page
      navigate("/main");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <input
        type="text"
        placeholder="Nombre de usuario"
        className="mb-2 p-2 border rounded"
        value={nombreUsuario}
        onChange={(e) => setNombreUsuario(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="mb-4 p-2 border rounded"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">
        Join
      </button>
    </div>
  );
}
