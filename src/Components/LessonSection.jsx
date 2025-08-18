import { renderContentBlock } from "../utils/LessonUtils";

const LessonSection = ({ articleRef, sectionRefs, lessonData, shownIndex, setIsAsideActive, setAsideTitle, setAsideContent}) => {
  return (
    <article ref={articleRef} className="flex flex-col gap-6 justify-center pt-14 max-w-xl mx-auto px-2 sm:px-4 transition-opacity duration-500">
      <h1 className="font-bold text-3xl md:text-4xl">{lessonData.title}</h1>
      {lessonData.sections.map((section, i) => (
        <section
          key={`section-${i}`}
          ref={(el) => (sectionRefs.current[i] = el)}
          className={`flex flex-col gap-6 transition-opacity duration-500 m-auto
            ${shownIndex < i ? "hidden" : ""} 
            ${shownIndex === i && shownIndex !== 0 ? "min-h-[calc(100vh-120px)]" : ""}`}
        >
          {section.content.map((item, j) => renderContentBlock(item, j, setAsideContent, setAsideTitle, setIsAsideActive))}
        </section>
      ))}
    </article>
  );
};

export default LessonSection;
