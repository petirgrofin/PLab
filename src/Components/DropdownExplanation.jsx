import { useState, useRef, useEffect } from "react";
import { useComponentContext } from "../lessons/ComponentContext";
import { renderInlineMathText } from "../utils/LatexUtils";

const DropdownExplanation = ({ explanation, id, src }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExerciseCompleted, setIsExerciseCompleted] = useState(false); // workaround using an id
  const explanationRef = useRef(null);

  const { showExplanation, exerciseId, finishedExercises } = useComponentContext();

  const toggleExplanation = () => {
    setIsOpen(!isOpen);
  };

  // Scroll into view when opened
  useEffect(() => {
    if (isOpen && explanationRef.current) {
      const timeoutId = setTimeout(() => {
        explanationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150); // Adjust delay as needed (e.g., 100–300ms)

      return () => clearTimeout(timeoutId); // Cleanup on unmount or change
    }
  }, [isOpen]);


  useEffect(() => {
    if (id != exerciseId){
      return;
    }
    if (showExplanation){
      toggleExplanation();
      setIsExerciseCompleted(true);
    }
    if (finishedExercises.includes(id)){
      setIsExerciseCompleted(true)
    }
  }, [showExplanation, exerciseId, finishedExercises])

  // The dropdown button only renders until isExerciseCompleted. However, it seems to be rendering *after* the next
  // element, so it looks awkward when transitioning. Setting opacity-100 and disabling the button is a hackish
  // workaround, but it will work for now since I don't have a lot of time to set up a proper rendering pipeline.
  
  return (
    <div className={`mt-4 ${isExerciseCompleted ? 'opacity-100' : 'opacity-0'}`} ref={explanationRef}>
      <button
        disabled={!isExerciseCompleted}
        onClick={toggleExplanation}
        className={`mb-2 bg-[#333333] text-white font-bold px-4 py-4 rounded-full cursor-pointer hover:bg-[#4a4a4a] disabled:bg-[#b3b3b3] disabled:cursor-auto`}
      >
        {isOpen ? "Esconder explicación" : "Mostrar explicación"}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-fit opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          <p className="font-bold font-nunito">Explicación</p>
          {src !== undefined ? <img src={src} alt="" /> : <></>}
          <p className="font-nunito">{renderInlineMathText(explanation)}</p>
        </div>
      </div>
    </div>
  );
};

export default DropdownExplanation;
