// pages/CoursesPage.jsx
import Navbar from "../components/Navbar";

const allCourses = [
  { id: "sets", title: "Introduction to Set Theory" },
  { id: "probability", title: "Introduction to Probability" }
];

export default function CoursesPage() {
  const joined = JSON.parse(localStorage.getItem("joinedCourses")) || [];

  const handleJoin = (course) => {
    const updated = [...joined, course];
    localStorage.setItem("joinedCourses", JSON.stringify(updated));
    alert(`Joined ${course.title}`);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Available Courses</h2>
        <ul className="space-y-3">
          {allCourses.map((course) => (
            <li key={course.id} className="flex justify-between items-center bg-white p-4 shadow rounded">
              <span>{course.title}</span>
              <button
                onClick={() => handleJoin(course)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
