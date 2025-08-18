import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Link } from "react-router-dom";
import { X, CircleSmall } from 'lucide-react'

export default function MainPage() {
  //const [joinedCourses, setJoinedCourses] = useState([]);
  //const [courseLessons, setCourseLessons] = useState({});
  const [loading, setLoading] = useState(false);


   /* useEffect(() => {
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
 */

  const joinedCourses = [
    {
        "curso_id": 2,
        "titulo": "Introducción a la Teoría de Conjuntos",
        "descripcion": "Curso sobre el manejo de conjuntos, sus operaciones y su uso del lenguaje matemático."
    },
    {
        "curso_id": 1,
        "titulo": "Introducción a la Probabilidad",
        "descripcion": "Curso básico para comprender eventos aleatorios y calcular probabilidades inciertas."
    },
  ]

  const courseLessons = {
    "1": [
        {
            "titulo": "Probabilidad",
            "curso_id": 1,
            "orden_en_curso": 1,
            "id": 1,
            "contenido": "Conceptos básicos de probabilidad"
        },
        {
            "titulo": "Espacios muestrales",
            "curso_id": 1,
            "orden_en_curso": 2,
            "id": 2,
            "contenido": "Definición de espacio muestral"
        }
    ],
    "2": [
        {
            "titulo": "Conjuntos",
            "curso_id": 2,
            "orden_en_curso": 1,
            "id": 3,
            "contenido": "Definición y ejemplos"
        },
        {
            "titulo": "Diagramas de Venn",
            "curso_id": 2,
            "orden_en_curso": 2,
            "id": 4,
            "contenido": "Unión, intersección y diferencia"
        }
    ],
  }

  if (loading) return <p>Loading your courses...</p>;

  const lessonFilesById = {
    1: "Probability",
    2: "SampleSpaces",
    3: "SetIntro",
    4: "SetOperations",
  };

return (
  <div className="min-h-screen">
    <Navbar />
    <div className="p-4 sm:p-6 md:m-8 flex flex-col">
      {joinedCourses.length === 0 ? (
        <p className="text-center text-gray-600 text-base sm:text-lg">
          No te has unido a ningún curso todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center w-full">
          {joinedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-black relative flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg min-h-[20rem] rounded-lg transition-transform hover:scale-[1.02]"
            >
              {/* Header */}
              <div className="w-full p-4 sm:p-6 flex justify-between items-start gap-2">
                <div className="flex flex-col text-white">
                  <h3 className="font-semibold text-lg sm:text-xl">
                    {course.titulo}
                  </h3>
                  <p className="text-sm sm:text-base opacity-90">
                    {course.descripcion}
                  </p>
                </div>
              </div>

              {/* Lessons */}
              <div className="w-full bg-white flex-1 border border-black rounded-b-md p-4 overflow-y-auto">
                <ul className="m-2 sm:m-4 text-sm sm:text-base space-y-3 sm:space-y-4">
                  {(courseLessons[course.curso_id] || []).map((lesson) => (
                    <li key={lesson.id}>
                      <Link
                        to={`/lesson/${course.curso_id}/${
                          lessonFilesById[lesson.id] || lesson.id
                        }`}
                        className="font-semibold flex items-center gap-1 text-black hover:text-indigo-700 transition-colors"
                      >
                        <CircleSmall className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{lesson.titulo}</span>
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