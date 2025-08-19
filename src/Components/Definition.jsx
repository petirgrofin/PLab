import React from 'react'
import { renderInlineMathText } from '../utils/LatexUtils'

const Definition = ({definition, px_size}) => {
  return (
    <div className='border border-gray-400 rounded-md p-6'>{renderInlineMathText(definition, "txt", px_size)}</div>
  )
}

export default Definition