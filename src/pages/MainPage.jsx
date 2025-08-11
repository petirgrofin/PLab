import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { X, CircleSmall } from 'lucide-react'

export default function MainPage() {
  const [joinedCourses, setJoinedCourses] = useState([]);
  const [courseLessons, setCourseLessons] = useState({});
  const [loading, setLoading] = useState(false);


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
         .then(async (courses) => {
           setJoinedCourses(courses);

           // Ahora traemos las lecciones de cada curso
           const lessonsByCourse = {};
           for (const course of courses) {
             try {
               const res = await fetch(
                 `http://localhost:8000/cursos/${course.curso_id}/lecciones`,
                 {
                   headers: { Authorization: `Bearer ${token}` },
                 }
               );
               const data = await res.json();
               lessonsByCourse[course.curso_id] = data;
             } catch (e) {
               lessonsByCourse[course.curso_id] = [];
             }
           }
           setCourseLessons(lessonsByCourse);
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

      setJoinedCourses((prev) =>
        prev.filter((course) => course.curso_id !== courseId)
      );

      // Eliminar también las lecciones asociadas
      setCourseLessons((prev) => {
        const copy = { ...prev };
        delete copy[courseId];
        return copy;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading your courses...</p>;

  const lessonFilesById = {
    1: "Probability",
    2: "SampleSpaces",
    3: "SetIntro",
    4: "SetOperations",
  };

  return (
    <div className="min-h-screen bg-gradient-to-tl">
      <Navbar />
      <div className="p-6 m-8 flex flex-col">
        {joinedCourses.length === 0 ? (
          <p>You haven't joined any courses yet.</p>
        ) : (
          <div className="flex flex-wrap p-4 gap-6 justify-center items-center">
            {joinedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-black relative flex flex-col h-96 items-center w-110 border-1 border-black hover:scale-102 rounded-lg transition-all"
              >
                <div className="w-full h-fit p-6 flex justify-between items-center gap-2">
                  <div className="flex flex-col justify-evenly text-white">
                    <h3 className="font-semibold text-xl">{course.titulo}</h3>
                    <p>{course.descripcion}</p>
                  </div>
                  <button
                    onClick={() => handleLeave(course.curso_id)}
                    className="flex justify-center items-center p-1 border-red-500 text-red-500 rounded transition-all hover:bg-red-500 hover:text-white hover:cursor-pointer"
                  >
                    <X size={30} />
                  </button>
                </div>

                <div className="w-full bg-white h-full border-t-1 border-t-slate-300 rounded-b-md p-4 overflow-y-auto">
                  <ul className="m-4 decoration-0 text-lg space-y-4">
                    {(courseLessons[course.curso_id] || []).map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          to={`/lesson/${course.curso_id}/${lessonFilesById[lesson.id] || lesson.id}`}
                          className="font-semibold flex items-center text-black hover:text-indigo-700"
                        >
                          <CircleSmall></CircleSmall>{lesson.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}