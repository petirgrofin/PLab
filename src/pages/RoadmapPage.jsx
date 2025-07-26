// pages/RoadmapPage.jsx
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { courseLessons } from "../lessons/courseManifests";

export default function RoadmapPage() {
  const { courseId } = useParams();
  const lessons = courseLessons[courseId] || [];

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4 capitalize">{courseId.replace('-', ' ')} Roadmap</h2>
        <ol className="list-decimal ml-6 space-y-2">
          {lessons.map((lesson, idx) => (
            <li key={idx}>
              <Link
                to={`/lesson/${courseId}/${lesson.file}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
