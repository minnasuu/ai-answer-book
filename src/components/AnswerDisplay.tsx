import { useState, useEffect, useRef } from "react";

interface AnswerDisplayProps {
  isThinking: boolean;
  showAnswer: boolean;
  answer: string;
  question: string;
  onReset: () => void;
  onPhoto: () => void;
  onCopy: () => void;
}

export default function AnswerDisplay({
  isThinking,
  showAnswer,
  answer,
  question,
  onReset,
  onPhoto,
  onCopy,
}: AnswerDisplayProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showAnswer && answer) {
      // 重置状态
      setDisplayedText("");
      setShowButton(false);

      // 逐字显示效果
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= answer.length) {
          setDisplayedText(answer.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          // 文字显示完成后，延迟显示按钮
          setTimeout(() => setShowButton(true), 300);
        }
      }, 50); // 每50ms显示一个字符

      return () => clearInterval(interval);
    }
  }, [showAnswer, answer]);

  return (
    <div
      className="h-full flex items-center justify-center"
      style={{ fontFamily: "MFBoHeHaiYan" }}
    >
      {isThinking && (
        <div className="flex items-center gap-8 z-1">
          <p className="text-black text-[64px]">
            命运之书正在翻阅
          </p>
          <div className="loading-dots"></div>
        </div>
      )}
      {/* 背景问题 - 弱化显示 */}
      {
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <p
            className="text-gray-300/50 leading-[1em] text-center select-none animate-fadeIn"
            style={{
              fontFamily: "MFBoHeHaiYan",
              fontSize: `${
                question.length > 0
                  ? Math.max(
                      200,
                      Math.min(300, 300 - (question.length - 1) * 10)
                    )
                  : 600
              }px`,
              background:
                "linear-gradient(90deg, #FFF3D7 24.85%, #FFFFEF 48.66%, #D1FEFF 63.38%, #D7E5FF 68.54%, #FFD8FF 75.9%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "blur(4px)",
            }}
          >
            {question}
          </p>
          {question.length === 0 && <div className="absolute w-[253px] h-[448px]" >
            <img src="question.png" alt="question-bg" className="w-full h-full" />
          </div>}
        </div>
      }
      {showAnswer && answer && !isThinking && (
        <div className="relative z-10" ref={answerRef}>
          {/* 答案文字 */}
          <p
            className="text-gray-900 text-[64px] leading-[1.15em] font-serif text-center min-h-[60px] flex items-center justify-center"
            style={{ fontFamily: "MFBoHeHaiYan" }}
          >
            {displayedText}
            {displayedText.length < answer.length && (
              <span className="inline-block w-0.5 h-6 bg-gray-800 ml-1"></span>
            )}
          </p>
        </div>
      )}
      {/* 按钮 - 仅在答案显示完成后hover时显示 */}
      {showAnswer && showButton && (
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 flex items-center gap-4 z-10 transition-all duration-300">
          <button
            onClick={onReset}
            className="hover:-translate-y-0.5 transition-transform cursor-pointer"
            title="重新提问"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4.25 15.4008C4.25005 18.2946 6.37287 20.3713 7.87583 20.9262C8.67473 21.2211 10.0067 21.3594 10.9506 21.4208C12.5804 21.5267 13.8852 21.3623 14.941 20.9806C15.8855 20.6392 16.8865 19.8312 17.8828 18.7122C18.9165 17.5514 19.3486 16.3963 19.5037 15.7297C19.7974 14.4669 19.7901 12.8957 19.6792 11.6436C19.5703 10.4127 19.0713 9.77923 18.3985 8.89805C18.0555 8.44882 17.4181 8.1065 16.6993 7.73985C16.0606 7.41407 14.9745 7.20194 13.4266 6.95676C11.7534 6.83128 10.5101 6.83358 9.85597 6.91403C9.55681 6.95955 9.32418 7.01457 9.03324 7.07767"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M11.2306 2.54785C10.8773 2.97863 9.80491 4.13511 9.07161 4.96427C7.95437 6.22755 7.75237 6.79295 7.53635 7.20021C7.48404 7.29884 7.39679 7.36732 7.49745 7.50858C7.79636 7.92807 8.60373 8.30588 9.43765 8.80545C10.8595 9.80027 11.6453 10.2712 11.8999 10.5136C12.0255 10.6426 12.1438 10.784 12.4308 11.0758"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={onPhoto}
            className="hover:-translate-y-0.5 transition-transform cursor-pointer"
            title="下载图片"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M13.1331 1.0625C13.1331 1.12303 13.1331 1.18355 13.1504 3.13959C13.1676 5.09562 13.2022 8.94533 12.9933 12.0171C12.7844 15.0889 12.3309 17.2662 12.1108 18.5958C11.8908 19.9254 11.9179 20.3414 11.9786 21.0608"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3.25 15.21C4.60131 16.5673 5.95262 17.9246 7.25379 19.1528C9.71111 21.4724 11.3402 22.7076 11.8923 22.9232C12.1997 23.0433 12.528 22.4041 13.3394 21.2481C15.9238 17.5659 16.5064 17.187 17.0705 16.5427C17.5586 16.0975 18.0024 15.8035 18.3441 15.6171C18.5008 15.5203 18.6235 15.419 18.75 15.3145"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={onCopy}
            className="hover:-translate-y-0.5 transition-transform cursor-pointer"
            title="复制图片到剪贴板"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                d="M1.47956 7.72729C1.44414 9.81116 1.33198 13.2762 1.13832 17.1558C0.980137 20.3247 0.893508 21.7972 1.24113 22.1486C1.66893 22.5811 6.22343 22.377 12.4965 22.2957C14.7098 22.2671 14.9534 22.2511 15.1926 22.1811C15.6785 22.0387 16.004 18.3641 16.1921 12.9663C16.2854 10.2883 16.3791 9.25218 16.3046 8.55395C16.2713 8.24271 15.9967 8.07192 15.5783 7.96752C14.5658 7.71488 10.8532 7.70504 6.11158 7.52994C4.4223 7.4738 4.18854 7.48408 3.8994 7.49462C3.61025 7.50516 3.2728 7.51565 2.92513 7.52645"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M19.8605 17.6369C20.1404 14.2626 20.3535 11.5308 19.7133 5.77712C19.5272 4.10477 19.2608 3.43162 19.0118 2.98903C17.9397 2.4651 13.4393 2.35457 7.22537 2.37819C4.95458 2.39958 4.47563 2.44006 3.98216 2.48177"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
