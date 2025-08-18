import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-6 lg:px-8">
      {/* Background */}
      <img
        src="/landing-background.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-20"
      />

      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">PLab</h1>
        <div className="space-x-4 font-semibold">
          {/* Optional buttons */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl text-center mt-12 sm:mt-20 px-2">
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Aprende interactivamente.<br />Aprende para la vida.
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-10">
          Construye bases sólidas en matemáticas, ciencias e informática con lecciones prácticas.
        </p>
        <Link
          to="/main"
          className="inline-block bg-indigo-500 font-semibold text-white text-base sm:text-lg px-5 sm:px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Empieza ya
        </Link>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl py-8 sm:py-10 text-sm text-gray-400 text-center mt-12 sm:mt-20">
        &copy; {new Date().getFullYear()} PLab. Hecho con ❤️ por Felipe Bolaños
      </footer>
    </div>
  );
}
