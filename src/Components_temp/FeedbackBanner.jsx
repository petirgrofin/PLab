const FeedbackBanner = ({
  isSubmitted,
  isCorrect,
  setIsExerciseAnswerSubmitted,
  handleExerciseFinished
}) => {
  const sharedButtonClasses = "shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-bold px-6 py-4 rounded-full cursor-pointer disabled:bg-[#b3b3b3] disabled:cursor-not-allowed";

  if (!isSubmitted) return null;

  return isCorrect ? (
    <div className="fixed w-screen flex gap-6 items-center justify-center bottom-0 p-6 border-t-2 border-t-[#E5E5E5] bg-[#D4F5DD]">
      <p className="font-bold text-xl">Correcto!</p>
      <button onClick={() => {handleExerciseFinished(true)}} className={`${sharedButtonClasses} bg-[#BEDCC6] text-black hover:bg-[#4a4a4a]`}>
        ¿Por qué?
      </button>
      <button onClick={() => {handleExerciseFinished(false)}} className={`${sharedButtonClasses} bg-[#29CC57] text-white hover:bg-[#1a8a3a]`}>
        Continuar
      </button>
    </div>
  ) : (
    <div className="fixed flex flex-col gap-6 bottom-2 p-6 rounded-lg w-xl bg-[#FCE49D]">
      <p>La respuesta no es correcta.</p>
      <div className="flex flex-row gap-4">
        <button onClick={() => {handleExerciseFinished(true)}} className={`${sharedButtonClasses} bg-[#333333] text-white hover:bg-[#4a4a4a]`}>
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
