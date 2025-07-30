import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_usuario: nombreUsuario, contrasena_hash: contrasena }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
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
        <div className="flex flex-col items-center gap-4 w-[20%] rounded-lg border-1 border-slate-300 p-10 shadow-xl bg-[#FAFAFA]">
            <h2 className="text-3xl mb-4 font-semibold">Accede</h2>

            <label className="w-full flex flex-col">Nombre de usuario
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    className="mb-2 p-2 border rounded"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                />
            </label>

            <label className="w-full flex flex-col">Contraseña
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="mb-4 p-2 border rounded"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />
            </label>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button onClick={handleLogin} className="bg-black font-semibold text-white w-full px-4 py-2 rounded hover:bg-gray-800 hover:cursor-pointer">
                Iniciar sesión
            </button>
            <span>¿No tienes cuenta aun? <Link to='/signup' className="font-semibold text-blue-500 hover:underline">Regístrate</Link></span>
        </div>
    </div>
  );
}
