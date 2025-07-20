const AsideButton = ({text, setIsAsideActive}) => {
  return (
    <div>
        <button onClick={() => {setIsAsideActive(true)}} className='border-2 border-gray-300 hover:border-gray-400 active:border-gray-500  font-bold rounded-full py-2 px-4 cursor-pointer'>{text}</button>
    </div>
  )
}

export default AsideButton