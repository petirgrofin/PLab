import { useEffect, useRef, useState } from "react";
import SetIntro from "./SetIntro.json"
import Test from "./Test.json"
import Probability from "./Probability.json";
import SetOperations from "./SetOperations.json";
import SampleSpaces from "./SampleSpaces.json";
import useFadeOutOnScroll from "../hooks/useFadeOutOnScroll";
import useAutoScrollToCurrent from "../hooks/useAutoScrollToCurrent";
import VennDiagramInfo from "../Components/VennDiagramInfo";
import { VennDiagramDragNDrop } from "../Components/VennDiagramDragNDrop";
import BasicTable from "../Components/BasicTable";
import AsideButton from "../Components/AsideButton";
import { Aside } from "../Components/Aside";
import SetClassifierDndKit from "../Components/SetClassifierDND";
import CoinSampleSpaceDnD from "../Components/CoinSampleSpaceDnD";
import DiceSampleSpaceSelector from "../Components/DiceSampleSpaceSelector";
import CoinFlipSimulator from "../Components/CoinFlipSimulator";
import { TwoSetVennCardinality } from "../Components/VennCardinality";
import { BlockMath } from "react-katex";
import Definition from "../Components/Definition";
import { renderInlineMathText } from "../utils/latexUtils";
import { MultipleChoiceExercise, DemoMultipleChoiceExercise } from "../Components/MultipleChoiceExercise";
import { DemoMultiSelectTextQ, DemoMultiSelectTextR, MultiSelectExercise } from "../Components/MultiSelectExercise";
import VennDiagram from "../Components/VennDiagram";
import NarrativeQuestion from "../Components/NarrativeQuestion";
import FreeResponse from "../Components/FreeResponse";
import VennDiagramStatic from "../Components/VennDiagramStatic";
import VennDiagramMutuallyExclusive from "../Components/VennDiagramMutuallyExclusive";
import { useParams } from "react-router-dom";


const COMPONENT_REGISTRY = {
  BasicTable,
  VennDiagramDragNDrop,
  VennDiagramInfo,
  SetClassifierDndKit,
  CoinSampleSpaceDnD,
  DiceSampleSpaceSelector,
  CoinFlipSimulator,
  VennCardinality: TwoSetVennCardinality,
  MultipleChoiceExercise,
  DemoMultiSelectTextQ,
  DemoMultiSelectTextR,
  MultiSelectExercise,
  VennDiagram,
  Definition,
  NarrativeQuestion,
  FreeResponse,
  VennDiagramStatic,
  VennDiagramMutuallyExclusive
};

function getComponent(name, props = {}, key) {
  const Comp = COMPONENT_REGISTRY[name];
  if (!Comp) {
    console.warn(`Unknown component: ${name}`);
    return <div key={key}>Missing component: {name}</div>;
  }
  return <Comp key={key} {...props} />;
}

function renderAsideContent(infoBlocks) {
  return infoBlocks.map((block, index) => {
    if (block.type === "p") {
      return <p key={index}>{renderInlineMathText(block.value)}</p>;
    }
    if (block.type === "ul") {
      return (
        <ul key={index} className="list-disc pl-5 space-y-1">
          {block.items.map((item, i) => (
            <li key={i}>{renderInlineMathText(item)}</li>
          ))}
        </ul>
      );
    }
    return null;
  });
}

const Template = () => {
  const [shownIndex, setShownIndex] = useState(0);
  const [isAsideActive, setIsAsideActive] = useState(false);
  const [asideContent, setAsideContent] = useState(null);
  const [asideTitle, setAsideTitle] = useState("");
  const [isInExerciseMode, setIsInExerciseMode] = useState(false);
  const [fadeState, setFadeState] = useState('fade-in');
  const [displayedExercise, setDisplayedExercise] = useState(0); // used for rendering
  const [exerciseFade, setExerciseFade] = useState("fade-in");
  const [currentExercise, setCurrentExercise] = useState(0);

  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);

  useEffect(() => {
    import(`./${lessonId}.json`)
      .then((module) => {
        console.log("Loaded lesson:", module.default); 
        const data = module.default;
        setLessonData(data);
      })
      .catch((err) => {
        console.error("Failed to load lesson:", err);
        setLessonData(null);
      });
  }, [lessonId]);

  const toggleMode = () => {
    setFadeState('fade-out');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setIsInExerciseMode((prev) => !prev);
      setFadeState('fade-in');
    }, 500); // match this to your Tailwind transition duration
  };

  const goToExercise = (newIndex) => {
    if (newIndex < 0 || newIndex >= lessonData.exercises.length) return;
    setExerciseFade("fade-out");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setDisplayedExercise(newIndex);
      setCurrentExercise(newIndex); // optional, if you track both
      setExerciseFade("fade-in");
    }, 500); // match Tailwind duration
  };

  const sectionRefs = useRef([]);
  const articleRef = useRef(null);

  useFadeOutOnScroll(sectionRefs, shownIndex);
  useAutoScrollToCurrent(sectionRefs, shownIndex);

  const handleContinue = () => {
    if (!isLessonFinished) {
      setShownIndex(shownIndex + 1);
    } else if (!isInExerciseMode) {
      toggleMode();
    } else if (currentExercise + 1 < totalExercises) {
      goToExercise(currentExercise + 1);
    }
  };

  const renderContentBlock = (item, i) => {
    if (item.type === "text") {
      return <div key={i}>{renderInlineMathText(item.value, `sec-${i}`)}</div>;
    }
    if (item.type === "component") {
      return item.props ? getComponent(item.name, item.props, i) : getComponent(item.name);
    }
    if (item.type === "image") {
      return <img className="object-scale-down" key={i} src={item.src} alt="" />;
    }
    if (item.type === "aside") {
      return (
        <AsideButton
          key={i}
          setIsAsideActive={() => {
            setAsideTitle(item.title);
            setAsideContent(item.info);
            setIsAsideActive(true);
          }}
          text={item.buttonText}
        />
      );
    }
    if (item.type === "formula") {
      return <BlockMath key={i} math={item.value} />;
    }
    if (item.type === "definition") {
      return <Definition key={i} definition={item.value} />;
    }
    if (item.type === "ul"){
      return (
        <ul className="list-disc ml-8">
          {item.listItems.map((listItem, i) => {
            return <li key={i}>{listItem}</li>
          })}
        </ul>
      )
    }
    return null;
  };

  if (!lessonData) {
    return <div className="p-6">Loading...</div>;
  }

  // const lessonData = SetOperations;
  const isLessonFinished = shownIndex + 1 >= lessonData.sections.length;
  const totalExercises = lessonData.exercises?.length || 0;

  return (
    <div className="bg-white flex flex-col items-center mt-16 gap-4 font-nunito">
      <header className="fixed w-screen shadow-sm flex top-0 h-16 border-b-2 border-b-[#E5E5E5] bg-white z-10 items-center justify-center">
        {isInExerciseMode && (
          <div className="text-sm text-gray-600">
            Ejercicio {currentExercise + 1} de {totalExercises}
          </div>
        )}
      </header>
      <div className={`transition-opacity duration-500 ${fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}>
        {!isInExerciseMode ? (
          <article ref={articleRef} className="flex flex-col gap-6 justify-center pt-14 max-w-xl mx-auto px-4 transition-opacity duration-500">
            <h1 className="font-bold text-4xl">{lessonData.title}</h1>
            {lessonData.sections.map((section, i) => (
              <section
                key={`section-${i}`}
                ref={(el) => (sectionRefs.current[i] = el)}
                className={`flex flex-col gap-6 transition-opacity duration-500 m-auto
                  ${shownIndex < i ? "hidden" : ""} 
                  ${shownIndex > i ? "opacity-0" : ""} 
                  ${shownIndex === i && shownIndex !== 0 ? "min-h-[calc(100vh-120px)]" : ""}`}
              >
                {section.content.map((item, j) => renderContentBlock(item, j))}
              </section>
            ))}
          </article>
        ) : (
          <div
          className={`transition-opacity duration-500 ${
            exerciseFade === "fade-in" ? "opacity-100" : "opacity-0"
          }`}
          >
            <section className="w-full min-h-screen pt-20 px-4 max-w-xl mx-auto flex flex-col gap-6 items-center">
              {lessonData.exercises[displayedExercise].content.map((item, i) =>
                renderContentBlock(item, i)
              )}
            </section>
          </div>
        )}
      </div>
      <div className="fixed w-screen flex items-center justify-center bottom-0 p-6 border-t-2 border-t-[#E5E5E5] bg-white">
        <button
          onClick={handleContinue}
          className="bg-[#333333] shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-white font-bold p-4 rounded-full w-sm cursor-pointer hover:bg-[#4a4a4a]"
        >
          {isInExerciseMode
            ? currentExercise + 1 < totalExercises
              ? "Siguiente ejercicio"
              : "Finalizar lección"
            : isLessonFinished
            ? "Empezar ejercicios"
            : "Continuar"}
        </button>
      </div>
      <Aside onClose={() => setIsAsideActive(false)} isActive={isAsideActive}>
        {asideTitle && <h2 className="font-bold text-2xl mb-2">{asideTitle}</h2>}
        {Array.isArray(asideContent) && renderAsideContent(asideContent)}
      </Aside>
    </div>
  );
};

export default Template;
