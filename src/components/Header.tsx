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
        答案之书（<div className="inline relative cursor-pointer" onClick={onToggle}>
            AI 版
            <span className={`absolute top-1 left-1 w-full h-0.5 bg-gray-800 rotate-25 ${useAI ? 'scale-x-0' : ''} origin-left transition-all duration-300`}></span>
            </div>）
      </h2>
      <p className="text-xl text-gray-800 font-light">
        The AI-Powered Book of Answers.
      </p>
    </div>
  )

export default Header;

