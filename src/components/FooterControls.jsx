import { isAnswerEmpty } from "../utils/validation";

const FooterControls = ({
  handleContinue,
  handleExerciseSubmit,
  isInExerciseMode,
  currentExercise,
  totalExercises,
  isLessonFinished,
  isExerciseActive,
  isNarrativeActive,
  exerciseResponse
}) => {
  if (isNarrativeActive) return null;
  return (
    <div className="fixed w-screen flex items-center justify-center bottom-0 p-6 border-t-2 border-t-[#E5E5E5] bg-white">
      <button
        onClick={isExerciseActive ? handleExerciseSubmit : handleContinue}
        disabled={isExerciseActive && isAnswerEmpty(exerciseResponse)}
        className="bg-[#333333] shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-white font-bold p-4 rounded-full w-sm cursor-pointer hover:bg-[#4a4a4a] disabled:bg-[#b3b3b3] disabled:cursor-not-allowed"
      >
        {isInExerciseMode
          ? currentExercise + 1 < totalExercises
            ? "Siguiente ejercicio"
            : "Finalizar lección"
          : isLessonFinished
          ? "Finalizar"
          : isExerciseActive ? "Revisar" : "Continuar"}
      </button>
    </div>
  );
};

export default FooterControls;
