import { renderContentBlock } from "../utils/LessonUtils";

const ExerciseSection = ({ fade, exercise }) => {
  return (
    <div className={`transition-opacity duration-500 ${fade === "fade-in" ? "opacity-100" : "opacity-0"}`}>
      <section className="w-full min-h-screen pt-20 px-4 max-w-xl mx-auto flex flex-col gap-6 items-center">
        {exercise.content.map((item, i) => renderContentBlock(item, i))}
      </section>
    </div>
  );
};

export default ExerciseSection;
