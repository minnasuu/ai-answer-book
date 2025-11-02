import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from "react-hot-toast";
import { generateAIAnswer, generateMockAnswer } from "./services/aiService";
import { generateAnswerImage } from "./utils/imageGenerator";
import {
  Header,
  QuestionInput,
  AnswerDisplay,
  Footer,
  Toast,
} from "./components";

function App() {
  const [question, setQuestion] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAIToggle = () => {
    setUseAI(!useAI);
    setAnswer("");
    setShowAnswer(false);
  };

  const handleReset = () => {
    setShowAnswer(false);
    setAnswer("");
    setQuestion("");
  };

  const getAnswer = async () => {
    // 防止重复触发和空问题
    if (isThinking || !question.trim()) return;

    // 检查字数限制
    if (question.length > 30) {
      setToastMessage("问题不能超过30字，请精简后重试");
      return;
    }

    setIsThinking(true);
    setShowAnswer(false);
    setAnswer("");

    try {
      let aiAnswer: string;
      if (useAI) {
        // 使用真实AI生成，传入用户问题
        aiAnswer = await generateAIAnswer(question);
      } else {
        // 使用模拟数据
        aiAnswer = await generateMockAnswer();
      }
      setAnswer(aiAnswer);
      setIsThinking(false);
      setShowAnswer(true);
    } catch {
      setAnswer("抱歉，生成答案时出现错误，请稍后再试。");
      setIsThinking(false);
      setShowAnswer(true);
    }
  };

  const handleExceedLimit = () => {
    setToastMessage("问题不能超过30字");
  };

  // 复制图片功能
  const handleCopyAsImage = async () => {
    try {
      const blob = await generateAnswerImage({
        question,
        answer,
      });

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast.success("图片已复制到剪贴板！", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "white",
          color: "#333",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    } catch (error) {
      console.error("复制图片失败:", error);
      toast.error("复制失败，请重试", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "white",
          color: "#333",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

  // 下载图片功能
  const handlePhoto = async () => {
    if (!answer || !question) return;

    try {
      const blob = await generateAnswerImage({
        question,
        answer,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `答案之书-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("生成图片失败:", error);
      toast.error("下载失败，请重试", {
        duration: 2000,
        position: "top-center",
        style: {
          background: "white",
          color: "#333",
          border: "1px solid #e5e5e5",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center px-10 py-7">
      <Header useAI={useAI} onToggle={handleAIToggle} />
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="w-full h-full relative" ref={cardRef}>
          {!showAnswer && !isThinking && (
            <QuestionInput
              question={question}
              isThinking={isThinking}
              onQuestionChange={setQuestion}
              onSubmit={getAnswer}
              onExceedLimit={handleExceedLimit}
            />
          )}

          <AnswerDisplay
            isThinking={isThinking}
            showAnswer={showAnswer}
            answer={answer}
            question={question}
            onReset={handleReset}
            onPhoto={handlePhoto}
            onCopy={handleCopyAsImage}
          />
        </div>
      </div>

      <Footer />

      {/* Toast 提示 */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      {/* React Hot Toast */}
      <Toaster />
    </div>
  );
}

export default App
