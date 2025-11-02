import { useState, useRef } from 'react'
import { Toaster } from 'react-hot-toast'
import { generateAIAnswer, generateMockAnswer } from './services/aiService'
import {
  Header,
  QuestionInput,
  AnswerDisplay,
  Footer,
  Toast
} from './components'

function App() {
  const [question, setQuestion] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [answer, setAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [toastMessage, setToastMessage] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const handleAIToggle = () => {
    setUseAI(!useAI)
    setAnswer('')
    setShowAnswer(false)
  }

  const handleReset = () => {
    setShowAnswer(false)
    setAnswer('')
    setQuestion('')
  }

  const getAnswer = async () => {
    // 防止重复触发和空问题
    if (isThinking || !question.trim()) return

    // 检查字数限制
    if (question.length > 30) {
      setToastMessage('问题不能超过30字，请精简后重试')
      return
    }

    setIsThinking(true)
    setShowAnswer(false)
    setAnswer('')

    try {
      let aiAnswer: string
      if (useAI) {
        // 使用真实AI生成，传入用户问题
        aiAnswer = await generateAIAnswer(question)
      } else {
        // 使用模拟数据
        aiAnswer = await generateMockAnswer()
      }
      setAnswer(aiAnswer)
      setIsThinking(false)
      setShowAnswer(true)
    } catch {
      setAnswer("抱歉，生成答案时出现错误，请稍后再试。")
      setIsThinking(false)
      setShowAnswer(true)
    }
  }

  const handleExceedLimit = () => {
    setToastMessage('问题不能超过30字')
  }
  
  const handlePhoto = async () => {
    if (!answer || !question) return;

    try {
      // 确保字体已加载
      await document.fonts.ready;

      // 使用 Canvas API 直接绘制
      const canvas = document.createElement("canvas");
      canvas.width = 1600; // 2x for retina
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("无法创建 Canvas 上下文");
      }

      // 随机渐变背景色组合
      const gradientColors = [
        ["#f5f7fa", "#c3cfe2"], // 浅蓝灰
        ["#ffecd2", "#fcb69f"], // 暖橙
        ["#e0c3fc", "#8ec5fc"], // 紫蓝
        ["#fbc2eb", "#a6c1ee"], // 粉紫
        ["#fdcbf1", "#e6dee9"], // 粉灰
        ["#a1c4fd", "#c2e9fb"], // 天蓝
        ["#ffd1ff", "#ffeaa7"], // 粉黄
        ["#cfd9df", "#e2ebf0"], // 冷灰
        ["#ffeaa7", "#fdcb6e"], // 金黄
        ["#dfe6e9", "#b2bec3"], // 银灰
        ["#fab1a0", "#ffeaa7"], // 橙黄
        ["#a29bfe", "#dfe6e9"], // 紫灰
      ];

      // 随机选择一组颜色
      const randomColors =
        gradientColors[Math.floor(Math.random() * gradientColors.length)];

      // 绘制渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 1600, 1600);
      gradient.addColorStop(0, randomColors[0]);
      gradient.addColorStop(1, randomColors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1600, 1600);

      // 绘制背景问题（大字、半透明）
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.font = "bold 200px MFBoHeHaiYan, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 处理长文本换行
      const maxWidth = 1400;
      const words = question.split("");
      let line = "";
      const lines: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i];
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // 绘制背景问题文字
      const lineHeight = 240;
      const startY = 800 - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, index) => {
        ctx.fillText(line, 800, startY + index * lineHeight);
      });
      ctx.restore();

      // 绘制答案文字（前景、清晰）
      ctx.save();
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "500 84px MFBoHeHaiYan, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 处理答案换行
      const answerMaxWidth = 1360;
      const answerWords = answer.split("");
      let answerLine = "";
      const answerLines: string[] = [];

      for (let i = 0; i < answerWords.length; i++) {
        const testLine = answerLine + answerWords[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > answerMaxWidth && i > 0) {
          answerLines.push(answerLine);
          answerLine = answerWords[i];
        } else {
          answerLine = testLine;
        }
      }
      answerLines.push(answerLine);

      // 绘制答案文字
      const answerLineHeight = 120;
      const answerStartY =
        800 - ((answerLines.length - 1) * answerLineHeight) / 2;
      answerLines.forEach((line, index) => {
        ctx.fillText(line, 800, answerStartY + index * answerLineHeight);
      });
      ctx.restore();

      // 绘制右下角水印
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";

      // 格式化时间：YYYY-MM-DD HH:mm:ss
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      // 绘制时间（上方，使用 kenpixel 字体）
      ctx.font = "24px kenpixel, monospace";
      ctx.fillText(timeString, 1520, 1510);

      // 绘制来源（下方，使用 sans-serif 字体）
      ctx.font = "24px sans-serif";
      ctx.fillText("答案之书 Agent 生成", 1520, 1540);
      ctx.restore();

      // 下载图片
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `答案之书-${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          throw new Error("生成图片失败");
        }
      }, "image/png");
    } catch (error) {
      console.error("生成图片失败:", error);
      alert(
        `生成图片失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
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
