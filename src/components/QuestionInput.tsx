interface QuestionInputProps {
  question: string
  isThinking: boolean
  onQuestionChange: (question: string) => void
  onSubmit: () => void
  onExceedLimit: () => void
}

const MAX_QUESTION_LENGTH = 30

export default function QuestionInput({ 
  question, 
  isThinking, 
  onQuestionChange, 
  onSubmit,
  onExceedLimit
}: QuestionInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (question.length > MAX_QUESTION_LENGTH) {
        onExceedLimit()
      } else {
        onSubmit()
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onQuestionChange(newValue)
    
    // 实时提示超出字数
    if (newValue.length > MAX_QUESTION_LENGTH) {
      onExceedLimit()
    }
  }

  const remainingChars = MAX_QUESTION_LENGTH - question.length
  const isExceeded = remainingChars < 0

  return (
    <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <input 
        className="appearance-none border-none shadow-none outline-none w-full leading-9 text-center bg-transparent text-black placeholder:text-gray-400 focus:border-none focus:shadow-none focus:outline-none" 
        value={question} 
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="输入你的问题，回车获取答案（限30字）"
        disabled={isThinking}
        autoFocus
      />
      {question.length > 0 && (
        <div className={`text-center mt-2 text-xs transition-colors ${
          isExceeded ? 'text-red-500' : 'text-gray-400'
        }`}>
          {isExceeded ? `超出 ${Math.abs(remainingChars)} 字` : ''}
        </div>
      )}
    </div>
  )
}
