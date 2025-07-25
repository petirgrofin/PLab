import { useRef, useState } from "react"
import SetIntro from "./SetIntro.json"
import Test from "./Test.json"
import Probability from "./Probability.json"
import SetOperations from "./SetOperations.json"
import SampleSpaces from "./SampleSpaces.json"
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
import {MultipleChoiceExercise, DemoMultipleChoiceExercise } from "../Components/MultipleChoiceExercise";
import { DemoMultiSelectTextQ, DemoMultiSelectTextR, MultiSelectExercise} from "../Components/MultiSelectExercise";
import VennDiagram from "../Components/VennDiagram";

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
  Definition
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

    // The shownIndex is used to determine which sections of the article are shown (i.e., if shownIndex is 2, then
    // the first three sections are shown)
    const [shownIndex, setShownIndex] = useState(0);
    const [isAsideActive, setIsAsideActive] = useState(false);
    const [asideContent, setAsideContent] = useState(null);
    const [asideTitle, setAsideTitle] = useState("");
    const sectionRefs = useRef([]);

    useFadeOutOnScroll(sectionRefs, shownIndex);
    useAutoScrollToCurrent(sectionRefs, shownIndex);

    const lessonData = SampleSpaces;
    if (!lessonData) return <div>Loading...</div>;
    
    // max-h-[calc(100vh-170px)] overflow-y-scroll makes the fade out and auto scroll awkward
    return (
    <div className="bg-white flex flex-col items-center mt-16 gap-4 font-nunito">
        <header className='fixed w-screen shadow-sm flex top-0 h-16 border-b-2 border-b-[#E5E5E5] bg-white z-10'></header>
        <article className='flex flex-col gap-6 justify-center pt-14 max-w-xl mx-auto px-4'>
            <h1 className='font-bold text-4xl'>{lessonData.title}</h1>
            {lessonData.sections.map((section, i) => {
                return (
                    <section 
                    key={`separator-${i}`} 
                    ref={el => sectionRefs.current[i] = el} 
                    className={`flex flex-col gap-6 transition-opacity duration-500 m-auto
                    ${shownIndex < i ? 'hidden' : ''} 
                    ${shownIndex > i ? 'opacity-0' : ''} 
                    ${shownIndex === i && shownIndex !== 0 ? 'min-h-[calc(100vh-120px)]' : ''}`}>
                        {section.content.map((item, i) => {
                            if (item.type == "text"){
                                return <p key={i}>{renderInlineMathText(item.value, `sec-${i}`)}</p>
                            } 
                            if (item.type == "component"){
                                return item.props ? getComponent(item.name, item.props, i) : getComponent(item.name);
                            }
                            if (item.type == "image"){
                                return <img src={item.src} />
                            }
                            if (item.type == "aside"){
                                return <AsideButton setIsAsideActive={() => {
                                    setAsideTitle(item.title);
                                    setAsideContent(item.info);
                                    setIsAsideActive(true);
                                }} text={item.buttonText}></AsideButton>
                            }
                            if (item.type == "formula"){
                                return <BlockMath math={item.value} />
                            }
                            if (item.type == "definition"){
                                return <Definition definition={item.value}/>
                            }
                        })}
                    </section>
                )
            })}
        </article>
        <div className='fixed w-screen flex items-center justify-center bottom-0 p-6 border-t-2 border-t-[#E5E5E5] bg-white'>
            <button onClick={() => {
                if (shownIndex + 1 < lessonData.sections.length){
                    setShownIndex(shownIndex + 1)
                }
            }} className='bg-[#333333] shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-white font-bold p-4 rounded-full w-sm cursor-pointer hover:bg-[#4a4a4a]'>Continuar</button>
        </div>
        <Aside onClose={() => {setIsAsideActive(false)}} isActive={isAsideActive}>
            {asideTitle && <h2 className="font-bold text-2xl mb-2">{asideTitle}</h2>}
            {Array.isArray(asideContent) && renderAsideContent(asideContent)}
        </Aside>
    </div>
    )

}

export default Template