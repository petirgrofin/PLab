const PresetButton = ({text}) => {
    return (
        <button className="rounded-xl border-2 border-b-4 py-3 px-4 cursor-pointer hover:bg-gray-200 active:border-b-2 active:bg-gray-300 text-left w-fit">{text}</button>
    )
}

const NarrativeQuestion = ({options}) => {
    console.log(options)
  return (
    <div className='flex flex-col gap-2'>
        {options.map((option, i) => {
            return <PresetButton text={option} key={`narrative-${i}`}/>
        })}
    </div>
  )
}

export default NarrativeQuestion