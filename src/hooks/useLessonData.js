import { useEffect, useState } from "react";

export const useLessonData = (lessonId) => {
  const [lessonData, setLessonData] = useState(null);
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [asideContent, setAsideContent] = useState(null);
  const [asideTitle, setAsideTitle] = useState("");
  const [fadeState, setFadeState] = useState("fade-in");
  const [shownIndex, setShownIndex] = useState(0);

  useEffect(() => {
    import(`../lessons/${lessonId}.json`)
      .then((module) => setLessonData(module.default))
      .catch(() => setLessonData(null));
  }, [lessonId]);

  const toggleMode = () => {
    setFadeState("fade-out");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setFadeState("fade-in");
    }, 500);
  };

  return {
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
  };
};
