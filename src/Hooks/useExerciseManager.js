import { useState, useEffect } from "react";
import { validateExerciseResponse } from "../utils/validation";
import { useNavigate } from "react-router-dom";

// Could benefit from some modularization. I feel like handleContinue doesn't really belong here,
// since it is used independently from exercises. However, a case could be made for it.
export const useExerciseManager = (lessonData, shownIndex, setShownIndex, toggleMode) => {

  const [isInExerciseMode, setIsInExerciseMode] = useState(false);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [isNarrativeActive, setIsNarrativeActive] = useState(false);
  const [displayedExercise, setDisplayedExercise] = useState(0);
  const [exerciseFade, setExerciseFade] = useState("fade-in");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [exerciseResponse, setExerciseResponse] = useState({});
  const [isExerciseAnswerSubmitted, setIsExerciseAnswerSubmitted] = useState(false);
  const [isExerciseCorrect, setIsExerciseCorrect] = useState(false);
  const [exerciseId, setExerciseId] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finishedExercises, setFinishedExercises] = useState([]);

  const navigate = useNavigate();

  // I think this is an unnecessary useEffect. Also kind of violates SRP
  useEffect(() => {
    if (!lessonData) return;

    const section = isInExerciseMode
      ? lessonData.exercises?.[currentExercise]
      : lessonData.sections?.[shownIndex];

    if (!section) return;

    const exerciseBlock = section.content?.find(
      (block) => block.type === "component" && block.isExercise === true
    );

    const narrativeBlock = section.content?.find(
      (block) => block.type === "component" && block.name === "NarrativeQuestion"
    )

    setIsNarrativeActive(!!narrativeBlock);
    setIsExerciseActive(!!exerciseBlock);
    setExerciseId(
      exerciseBlock && typeof exerciseBlock.id !== "undefined"
        ? exerciseBlock.id
        : null
    );
  }, [lessonData, shownIndex, currentExercise, isInExerciseMode]);

  const goToExercise = (newIndex) => {
    if (newIndex < 0 || newIndex >= lessonData.exercises.length) return;
    setExerciseFade("fade-out");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setDisplayedExercise(newIndex);
      setCurrentExercise(newIndex);
      setExerciseFade("fade-in");
    }, 500);
  };

  const handleContinue = () => {
    setShowExplanation(false);
    if (shownIndex + 1 < lessonData.sections.length) {
      setShownIndex(shownIndex + 1);
    } else if (!isInExerciseMode) {
      // setIsInExerciseMode(true);
      // toggleMode();
      navigate("/main");
    } else if (currentExercise + 1 < lessonData.exercises.length) {
      goToExercise(currentExercise + 1);
    }
  };

  const handleExerciseSubmit = async () => {
    setIsExerciseCorrect(await validateExerciseResponse(exerciseResponse, exerciseId));
    setIsExerciseAnswerSubmitted(true);
  };

  const handleExerciseFinished = (shouldShowExplanation = false) => {
    setFinishedExercises([...finishedExercises, exerciseId])
    setShowExplanation(shouldShowExplanation)
    setExerciseResponse({});
    setIsExerciseActive(false);
    setIsExerciseAnswerSubmitted(false);
    if (!shouldShowExplanation) handleContinue();
  };

  return {
    isInExerciseMode,
    isExerciseActive,
    displayedExercise,
    currentExercise,
    exerciseFade,
    isExerciseAnswerSubmitted,
    isExerciseCorrect,
    showExplanation,
    exerciseResponse,
    isNarrativeActive,
    finishedExercises,
    exerciseId,
    setIsNarrativeActive,
    handleContinue,
    handleExerciseSubmit,
    handleExerciseFinished,
    setExerciseResponse,
    setIsExerciseAnswerSubmitted,
  };
};
