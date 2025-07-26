// pages/MainPage.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function MainPage() {
  const [joinedCourses, setJoinedCourses] = useState(
    JSON.parse(localStorage.getItem("joinedCourses")) || []
  );

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Your Courses</h2>
        {joinedCourses.length === 0 ? (
          <p>You haven’t joined any courses yet.</p>
        ) : (
          <ul className="space-y-2">
            {joinedCourses.map((course) => (
              <li key={course.id}>
                <Link to={`/roadmap/${course.id}`} className="text-blue-500 underline">
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
