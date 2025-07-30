const LessonHeader = ({ isInExerciseMode, currentExercise, totalExercises }) => {
  return (
    <header className="fixed w-screen shadow-sm flex top-0 h-16 border-b-2 border-b-[#E5E5E5] bg-white z-10 items-center justify-center">
      {isInExerciseMode && (
        <div className="text-sm text-gray-600">
          Ejercicio {currentExercise + 1} de {totalExercises}
        </div>
      )}
    </header>
  );
};

export default LessonHeader;
