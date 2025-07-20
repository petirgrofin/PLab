import { useRef, useState } from "react"
import SetIntro from "./SetIntro.json"
import useFadeOutOnScroll from "../hooks/useFadeOutOnScroll";
import useAutoScrollToCurrent from "../hooks/useAutoScrollToCurrent";
import VennDiagramInfo from "../Components/VennDiagramInfo";
import { VennDiagramDragNDrop } from "../Components/VennDiagramDragNDrop";
import BasicTable from "../Components/BasicTable";
import AsideButton from "../Components/AsideButton";
import { Aside } from "../Components/Aside";

function getComponent(name){
    switch (name){
        case "BasicTable":
            return <BasicTable/>
        case "VennDiagramDragNDrop":
            return <VennDiagramDragNDrop/>
        case "VennDiagramInfo":
            return <VennDiagramInfo/>
    }
}

const Template = () => {

    // The shownIndex is used to determine which sections of the article are shown (i.e., if shownIndex is 2, then
    // the first three sections are shown)
    const [shownIndex, setShownIndex] = useState(0);
    const [isAsideActive, setIsAsideActive] = useState(false);
    const sectionRefs = useRef([]);

    useFadeOutOnScroll(sectionRefs, shownIndex);
    useAutoScrollToCurrent(sectionRefs, shownIndex);

    const lessonData = SetIntro;
    if (!lessonData) return <div>Loading...</div>;
    
    // max-h-[calc(100vh-170px)] overflow-y-scroll makes the fade out and auto scroll awkward
    return (
    <div className="bg-white flex flex-col items-center mt-16 gap-4 font-nunito max-h-[calc(100vh-170px)] overflow-y-scroll">
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
                                return <p key={i}>{item.value}</p>
                            } 
                            if (item.type == "component"){
                                return getComponent(item.name);
                            }
                            if (item.type == "image"){
                                return <img src={item.src} />
                            }
                            if (item.type == "aside"){
                                return <AsideButton setIsAsideActive={setIsAsideActive} text={item.buttonText}></AsideButton>
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
                <h2 className='font-bold text-4xl'>Diagramas de Venn</h2>
                <p>Este es un Diagrama de Venn.</p>
                <ul>
                    <li><b>Verde</b>: Solo practica atletismo</li>
                    <li><b>Celeste</b>: Practica ambos</li>
                    <li><b>Naranja</b>: Solo practica baloncesto</li>
                    <li><b>Rectángulo exterior</b>: No practica ninguno</li>
                </ul>
        </Aside>
    </div>
    )

}

export default Template