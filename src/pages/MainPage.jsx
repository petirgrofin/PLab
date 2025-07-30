import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function MainPage() {
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = parseInt(payload.sub);

      fetch(`http://localhost:8000/usuarios/${userId}/cursos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setJoinedCourses(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, []);

  const handleLeave = async (courseId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Debe iniciar sesión");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = parseInt(payload.sub);

      const res = await fetch(
        `http://localhost:8000/usuarios/${userId}/cursos/${courseId}/leave`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error al salir del curso");

      alert(data.message);

      setJoinedCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading your courses...</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Your Courses</h2>
        {joinedCourses.length === 0 ? (
          <p>You haven't joined any courses yet.</p>
        ) : (
          <ul className="space-y-2">
            {joinedCourses.map((course) => (
              <li key={course.id} className="flex items-center justify-between">
                <Link to={`/roadmap/${course.curso_id}`} className="text-blue-500 underline">
                  {course.titulo}
                </Link>
                <button
                  onClick={() => handleLeave(course.curso_id)}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded"
                >
                  Leave
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
