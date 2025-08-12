import BasicTable from "../Components/BasicTable";
import { VennDiagramDragNDrop } from "../Components/VennDiagramDragNDrop";
import VennDiagramInfo from "../Components/VennDiagramInfo";
import SetClassifierDndKit from "../Components/SetClassifierDND";
import CoinSampleSpaceDnD from "../Components/CoinSampleSpaceDnD";
import DiceSampleSpaceSelector from "../Components/DiceSampleSpaceSelector";
import CoinFlipSimulator from "../Components/CoinFlipSimulator";
import { TwoSetVennCardinality } from "../Components/VennCardinality";
import { MultipleChoiceExercise } from "../Components/MultipleChoiceExercise";
import { DemoMultiSelectTextQ, DemoMultiSelectTextR, MultiSelectExercise } from "../Components/MultiSelectExercise";
import VennDiagram from "../Components/VennDiagram";
import Definition from "../Components/Definition";
import NarrativeQuestion from "../Components/NarrativeQuestion";
import FreeResponse from "../Components/FreeResponse";
import VennDiagramStatic from "../Components/VennDiagramStatic";
import VennDiagramMutuallyExclusive from "../Components/VennDiagramMutuallyExclusive";
import AsideButton from "../Components/AsideButton";
import DropdownExplanation from "../Components/DropdownExplanation";
import { BlockMath } from "react-katex";
import { renderInlineMathText } from "./LatexUtils";
import DiceThrowAnimation from "../Components/DiceThrowAnimation";

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
  VennDiagramMutuallyExclusive,
  DiceThrowAnimation
};

export function getComponent(name, props = {}, key) {
  const Comp = COMPONENT_REGISTRY[name];
  if (!Comp) {
    console.warn(`Unknown component: ${name}`);
    return <div key={key}>Missing component: {name}</div>;
  }
  return <Comp key={key} {...props} />;
}

export function renderContentBlock(item, i, setAsideContent, setAsideTitle, setIsAsideActive) {
  if (item.type === "text") {
    return <div key={i}>{renderInlineMathText(item.value, `sec-${i}`)}</div>;
  }
  if (item.type === "component") {
    return item.props ? getComponent(item.name, item.props, i) : getComponent(item.name, {}, i);
  }
  if (item.type === "image") {
    return <img className="object-scale-down h-[300px]" key={i} src={item.src} alt="" />;
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

  if (item.type === "explanation"){
    return <DropdownExplanation key={i} src={item?.src} explanation={item.explanation} id={item.id}/>
  }

  if (item.type === "formula") {
    return <BlockMath key={i} math={item.value} />;
  }
  if (item.type === "definition") {
    return <Definition key={i} definition={item.value} />;
  }
  if (item.type === "ul") {
    return (
      <ul className="list-disc ml-8" key={i}>
        {item.listItems.map((listItem, j) => (
          <li key={j}>{listItem}</li>
        ))}
      </ul>
    );
  }
  return null;
}
