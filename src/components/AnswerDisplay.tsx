import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { generateAnswerImage } from '../utils/imageGenerator'

interface AnswerDisplayProps {
  isThinking: boolean
  showAnswer: boolean
  answer: string
  question: string
  onReset: () => void
  onPhoto: () => void
}

export default function AnswerDisplay({ 
  isThinking, 
  showAnswer, 
  answer,
  question,
  onReset,
  onPhoto
}: AnswerDisplayProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [showButton, setShowButton] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)

  // 复制图片功能 - 优先使用Canvas方案
  const copyAsImage = async () => {
    try {
      // 使用Canvas直接生成图片
      const blob = await generateAnswerImage({
        question,
        answer
      })

      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      
      toast.success('图片已复制到剪贴板！', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: 'white',
          color: '#333',
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      })
      
    } catch (error) {
      console.error('复制图片失败:', error)
      toast.error('复制失败，请重试', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: 'white',
          color: '#333',
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
      })
    }
  }



  useEffect(() => {
    if (showAnswer && answer) {
      // 重置状态
      setDisplayedText('')
      setShowButton(false)
      
      // 逐字显示效果
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex <= answer.length) {
          setDisplayedText(answer.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
          // 文字显示完成后，延迟显示按钮
          setTimeout(() => setShowButton(true), 300)
        }
      }, 50) // 每50ms显示一个字符

      return () => clearInterval(interval)
    }
  }, [showAnswer, answer])

  return (
    <div className="group min-h-[240px] flex items-center justify-center">
      {isThinking && (
        <div className="flex flex-col items-center gap-4 z-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-gray-600 text-sm animate-pulse">命运之书正在翻阅...</p>
        </div>
      )}
      {/* 背景问题 - 弱化显示 */}
          {question && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-300/50 text-6xl font-serif text-center px-8 select-none animate-fadeIn" style={{fontFamily:'Momozhuanji'}}>
                {question}
              </p>
            </div>
          )}
      {showAnswer && answer && (
          <div className="relative z-10" ref={answerRef}>
            {/* 答案文字 */}
            <p className="text-gray-900 text-4xl leading-10 font-serif text-center min-h-[60px] flex items-center justify-center" style={{fontFamily:'Momozhuanji'}}>
              {displayedText}
              {displayedText.length < answer.length && (
                <span className="inline-block w-0.5 h-6 bg-gray-800 ml-1"></span>
              )}
            </p>
          </div>
      )}
        {/* 按钮 - 仅在答案显示完成后hover时显示 */}
          {showAnswer && showButton && (
            <div className='absolute left-1/2 bottom-0 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 z-10 transition-all duration-300'>
              <button
                onClick={onReset}
                className="hover:-translate-y-0.5 transition-transform cursor-pointer"
                title="重新提问"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M44 40.8361C39.1069 34.8632 34.7617 31.4739 30.9644 30.6682C27.1671 29.8625 23.5517 29.7408 20.1182 30.303V41L4 23.5453L20.1182 7V17.167C26.4667 17.2172 31.8638 19.4948 36.3095 24C40.7553 28.5052 43.3187 34.1172 44 40.8361Z" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linejoin="round"/></svg>
              </button>
               <button
                onClick={onPhoto}
                className="hover:-translate-y-0.5 transition-transform cursor-pointer"
                title="拍照保存"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 12L18 6H30L33 12H15Z" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linejoin="round"/><rect x="4" y="12" width="40" height="30" rx="3" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linejoin="round"/><path d="M24 35C28.4183 35 32 31.4183 32 27C32 22.5817 28.4183 19 24 19C19.5817 19 16 22.5817 16 27C16 31.4183 19.5817 35 24 35Z" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linejoin="round"/></svg>
              </button>
              <button
                onClick={copyAsImage}
                className="hover:-translate-y-0.5 transition-transform cursor-pointer"
                title="复制为图片"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163" stroke="#4a4a4a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z" fill="none" stroke="#4a4a4a" stroke-width="2" stroke-linejoin="round"/></svg>
              </button>
            </div>
          )}
    </div>
  )
}
