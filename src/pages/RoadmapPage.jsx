import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

export default function RoadmapPage() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState(""); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Debe iniciar sesión");
      setLoading(false);
      return;
    }

    const courseNumericId = parseInt(courseId); // if courseId is numeric

    // Fetch course title
    fetch(`http://localhost:8000/cursos/${courseNumericId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Error fetching course title");
        }
        return res.json();
      })
      .then((data) => {
        setCourseTitle(data.titulo);  // Store the course name
      })
      .catch((err) => {
        setError(err.message);
      });


    fetch(`http://localhost:8000/cursos/${courseNumericId}/lecciones`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.detail || "Error fetching lessons");
        }
        return res.json();
      })
      .then((data) => {
        setLessons(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const lessonFilesById = {
    1: "Probability",
    2: "SampleSpaces",
    3: "SetIntro",
    4: "SetOperations",
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4 capitalize">{courseTitle}</h2>
        <ol className="list-decimal ml-6 space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                to={`/lesson/${courseId}/${lessonFilesById[lesson.id]}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {lesson.titulo}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
