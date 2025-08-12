import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <img src="../../public/landing-background.png" alt="Background" className="absolute -z-20 m-auto top-5" />
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-gray-900">PLab</h1>
        <div className="space-x-4 font-semibold">
          {/* <Link to="/login" className="text-gray-700 hover:text-gray-800 transition">
            Log In
          </Link> */}
{/*           <Link
            to="/signup"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Sign Up
          </Link> */}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl text-center mt-20">
        <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Aprende interactivamente.<br />Aprende para la vida.
        </h2>
        <p className="text-gray-600 text-lg mb-10">
          Construye bases sólidas en matemáticas, ciencias e informática con lecciones prácticas.
        </p>
        <Link
          to="/main"
          className="inline-block bg-indigo-500 font-semibold text-white text-lg px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Empieza ya
        </Link>
      </main>

      <footer className="w-full max-w-6xl py-10 text-sm text-gray-400 text-center mt-20">
        &copy; {new Date().getFullYear()} PLab. Hecho con ❤️ por Felipe Bolaños
      </footer>
    </div>
  );
}