import React from 'react'
import { renderInlineMathText } from '../utils/LatexUtils'

const Definition = ({definition}) => {
  return (
    <div className='border border-gray-400 rounded-md p-6'>{renderInlineMathText(definition)}</div>
  )
}

export default Definition