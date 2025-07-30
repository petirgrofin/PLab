import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const allCourses = [
  { id: 1, title: "Introduction to Set Theory" },
  { id: 2, title: "Introduction to Probability" }
];

export default function CoursesPage() {
  const [joined, setJoined] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch user info from token or API
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Decode token to get userId (simplified)
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUserId(parseInt(payload.sub));

    // Fetch joined courses from backend (you need to create this endpoint)
    fetch(`http://localhost:8000/usuarios/${payload.sub}/cursos`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setJoined(data))
      .catch(console.error);
  }, []);

  const handleJoin = async (course) => {
    if (!userId) {
      alert("Debe iniciar sesión");
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(`http://localhost:8000/usuarios/${userId}/cursos/${course.id}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error al unirse");

      alert(data.message);

      // Update joined courses locally
      setJoined((prev) => [...prev, course]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Check if course is joined
  const isJoined = (course) => joined.some((c) => c.id === course.id);

  return (
    <div>
      <Navbar />
      <div className="p-6 mx-[20%] mt-10">
        <h2 className="text-2xl mb-4 font-bold">Cursos disponibles</h2>
        <ul className="space-y-3">
          {allCourses.map((course) => (
            <li
              key={course.id}
              className="flex justify-between items-center bg-white p-4 shadow rounded"
            >
              <span className="font-semibold">{course.title}</span>
              <button
                onClick={() => handleJoin(course)}
                disabled={isJoined(course)}
                className={`px-3 py-1 rounded ${
                  isJoined(course)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black font-semibold text-white hover:bg-gray-800 hover:cursor-pointer"
                }`}
              >
                {isJoined(course) ? "Joined" : "Join"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
