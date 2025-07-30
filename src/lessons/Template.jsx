// Template.jsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useFadeOutOnScroll from "../hooks/useFadeOutOnScroll";
import useAutoScrollToCurrent from "../hooks/useAutoScrollToCurrent";
import { ComponentContext } from "./ComponentContext";

import { useLessonData } from "../hooks/useLessonData";
import { useExerciseManager } from "../hooks/useExerciseManager";

import LessonHeader from "../components/LessonHeader";
import LessonSection from "../components/LessonSection";
import ExerciseSection from "../components/ExerciseSection";
import FooterControls from "../components/FooterControls";
import FeedbackBanner from "../components/FeedbackBanner";
import { Aside } from "../components/Aside";

const Template = () => {
  const { lessonId } = useParams();
  const sectionRefs = useRef([]);
  const articleRef = useRef(null);

  const {
    lessonData,
    isAsideActive,
    setIsAsideActive,
    asideContent,
    setAsideContent,
    asideTitle,
    setAsideTitle,
    fadeState,
    shownIndex,
    setShownIndex,
    toggleMode
  } = useLessonData(lessonId);

  const {
    isInExerciseMode, // refactor to TestMode so as to not confuse with plain lesson exercises
    isExerciseActive,
    displayedExercise,
    currentExercise,
    exerciseFade,
    isExerciseAnswerSubmitted,
    isExerciseCorrect,
    isNarrativeActive,
    showExplanation,
    finishedExercises,
    exerciseResponse,
    exerciseId,
    handleContinue,
    handleExerciseSubmit,
    setIsNarrativeActive,
    handleExerciseFinished,
    setExerciseResponse,
    setIsExerciseAnswerSubmitted
  } = useExerciseManager(lessonData, shownIndex, setShownIndex, toggleMode);

  useAutoScrollToCurrent(sectionRefs, shownIndex);
  useFadeOutOnScroll(sectionRefs, shownIndex);

  if (!lessonData) return <div className="p-6">Loading...</div>;

  const isLessonFinished = shownIndex + 1 >= lessonData.sections.length;
  const totalExercises = lessonData.exercises?.length || 0;

  return (
    <div className="bg-white flex flex-col items-center mt-16 gap-4 font-nunito">
      <LessonHeader
        isInExerciseMode={isInExerciseMode}
        currentExercise={currentExercise}
        totalExercises={totalExercises}
      />

      <div
        className={`transition-opacity duration-500 ${
          fadeState === "fade-in" ? "opacity-100" : "opacity-0"
        }`}
      >
        <ComponentContext value={{ finishedExercises, isExerciseActive, exerciseId, showExplanation, handleContinue, setExerciseResponse, setIsNarrativeActive }}>
          {!isInExerciseMode ? (
            <LessonSection
              articleRef={articleRef}
              sectionRefs={sectionRefs}
              lessonData={lessonData}
              shownIndex={shownIndex}
              setIsAsideActive={setIsAsideActive}
              setAsideTitle={setAsideTitle}
              setAsideContent={setAsideContent}
            />
          ) : (
            <ExerciseSection
              fade={exerciseFade}
              exercise={lessonData.exercises[displayedExercise]}
            />
          )}
        </ComponentContext>
      </div>

      {!isExerciseAnswerSubmitted && (
        <FooterControls
          handleContinue={handleContinue}
          handleExerciseSubmit={handleExerciseSubmit}
          isInExerciseMode={isInExerciseMode}
          currentExercise={currentExercise}
          totalExercises={totalExercises}
          isLessonFinished={isLessonFinished}
          isExerciseActive={isExerciseActive}
          exerciseResponse={exerciseResponse}
          isNarrativeActive={isNarrativeActive}
        />
      )}

      <FeedbackBanner
        isSubmitted={isExerciseAnswerSubmitted}
        isCorrect={isExerciseCorrect}
        setIsExerciseAnswerSubmitted={setIsExerciseAnswerSubmitted}
        handleExerciseFinished={handleExerciseFinished}
      />

      <Aside onClose={() => setIsAsideActive(false)} title={asideTitle} info={asideContent} isActive={isAsideActive}/>
    </div>
  );
};

export default Template;