import { Link } from "react-router";

const LessonHeader = ({ isInExerciseMode, currentExercise, totalExercises }) => {
  return (
    <header className="fixed w-screen shadow-sm flex top-0 h-16 border-b-2 border-b-[#E5E5E5] bg-white z-10 items-center pr-4 justify-end">
      <Link to="/main" className="text-white hover:bg-gray-800 bg-black px-4 py-2 rounded-sm font-semibold transition-all">
          Inicio
      </Link>
      {isInExerciseMode && (
        <div className="text-sm text-gray-600">
          Ejercicio {currentExercise + 1} de {totalExercises}
        </div>
      )}
    </header>
  );
};

export default LessonHeader;
