const FeedbackBanner = ({
  isSubmitted,
  isCorrect,
  setIsExerciseAnswerSubmitted,
  handleExerciseFinished
}) => {
  const sharedButtonClasses =
    "shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-bold px-6 py-3 rounded-full cursor-pointer disabled:bg-[#b3b3b3] disabled:cursor-not-allowed transition-colors w-full sm:w-auto";

  if (!isSubmitted) return null;

  return isCorrect ? (
    <div className="fixed w-full flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center bottom-0 p-4 sm:p-6 border-t-2 border-t-[#E5E5E5] bg-[#D4F5DD]">
      <p className="font-bold text-lg sm:text-xl text-center">¡Correcto!</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto justify-center">
        <button
          onClick={() => handleExerciseFinished(true)}
          className={`${sharedButtonClasses} bg-[#BEDCC6] text-black hover:bg-[#4a4a4a]`}
        >
          ¿Por qué?
        </button>
        <button
          onClick={() => handleExerciseFinished(false)}
          className={`${sharedButtonClasses} bg-[#29CC57] text-white hover:bg-[#1a8a3a]`}
        >
          Continuar
        </button>
      </div>
    </div>
  ) : (
    <div className="fixed flex flex-col gap-4 sm:gap-6 bottom-2 left-2 right-2 sm:left-auto sm:right-auto sm:w-[28rem] p-4 sm:p-6 rounded-lg bg-[#FCE49D]">
      <p className="text-base sm:text-lg">La respuesta no es correcta.</p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
        <button
          onClick={() => handleExerciseFinished(true)}
          className={`${sharedButtonClasses} bg-[#333333] text-white hover:bg-[#4a4a4a]`}
        >
          Ver respuesta
        </button>
        <button
          onClick={() => setIsExerciseAnswerSubmitted(false)}
          className={`${sharedButtonClasses} bg-[#E2CD8D] text-black hover:bg-[#4a4a4a]`}
        >
          Intentar otra vez
        </button>
      </div>
    </div>
  );
};

export default FeedbackBanner;
