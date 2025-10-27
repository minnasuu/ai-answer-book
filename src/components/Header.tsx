import React from "react"

type Props = {
    useAI: boolean
    onToggle: () => void
}
const Header:React.FC<Props> = ({
    useAI,
    onToggle
}) =>  (
    <div className="text-center mb-12">
      <h1 className="text-6xl leading-none text-gray-800 mb-4 animate-fadeIn">
        📖
      </h1>
      <h2 className="text-4xl font-serif text-gray-800 mb-2">
        答案之书（<div className={`inline relative cursor-pointer ${useAI ? 'text-gray-800' : 'text-gray-400'}`} onClick={onToggle}>AI 版</div>）
      </h2>
      <p className="text-xl text-gray-800 font-light">
        The AI-Powered Book of Answers.
      </p>
    </div>
  )

export default Header;

