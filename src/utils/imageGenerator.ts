// 图片生成工具函数 - 与拍照功能保持一致的样式

export interface ImageContent {
  question: string
  answer: string
}

export const generateAnswerImage = async (content: ImageContent): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      // 确保字体已加载
      await document.fonts.ready
      
      // 使用 Canvas API 直接绘制
      const canvas = document.createElement('canvas')
      canvas.width = 1600  // 2x for retina
      canvas.height = 1600
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('无法创建 Canvas 上下文')
      }
      
      // 白色背景
      ctx.fillStyle = '#F1F4FB'
      ctx.fillRect(0, 0, 1600, 1600)
      
      // 计算背景文字字号（与AnswerDisplay保持一致）
      const questionLength = content.question.length
      const baseFontSize = questionLength > 0 
        ? Math.max(200, Math.min(300, 300 - (questionLength - 1) * 10))
        : 300
      
      // 绘制背景问题（带渐变色和模糊效果）
      ctx.save()
      
      // 创建渐变色
      const textGradient = ctx.createLinearGradient(0, 0, 1600, 0)
      textGradient.addColorStop(0.2485, '#FFF3D7')
      textGradient.addColorStop(0.4866, '#FFFFEF')
      textGradient.addColorStop(0.6338, '#D1FEFF')
      textGradient.addColorStop(0.6854, '#D7E5FF')
      textGradient.addColorStop(0.759, '#FFD8FF')
      
      ctx.fillStyle = textGradient
      ctx.font = `bold ${baseFontSize}px MFBoHeHaiYan, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      // 应用模糊效果（Canvas的filter属性）
      ctx.filter = 'blur(4px)'
      
      // 处理长文本换行
      const maxWidth = 1400
      const words = content.question.split('')
      let line = ''
      const lines: string[] = []
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line)
          line = words[i]
        } else {
          line = testLine
        }
      }
      lines.push(line)
      
      // 绘制背景问题文字（使用渐变色）
      const lineHeight = baseFontSize * 1.2
      const startY = 800 - ((lines.length - 1) * lineHeight) / 2
      lines.forEach((line, index) => {
        ctx.fillText(line, 800, startY + index * lineHeight)
      })
      ctx.restore()
      
      // 绘制答案文字（前景、清晰）
      ctx.save()
      ctx.fillStyle = '#111827' // text-gray-900
      ctx.font = '500 128px MFBoHeHaiYan, serif' // 对应64px * 2 (retina)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.filter = 'none' // 确保答案文字不模糊
      
      // 处理答案换行
      const answerMaxWidth = 1400
      const answerWords = content.answer.split('')
      let answerLine = ''
      const answerLines: string[] = []
      
      for (let i = 0; i < answerWords.length; i++) {
        const testLine = answerLine + answerWords[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > answerMaxWidth && i > 0) {
          answerLines.push(answerLine)
          answerLine = answerWords[i]
        } else {
          answerLine = testLine
        }
      }
      answerLines.push(answerLine)
      
      // 绘制答案文字 (leading-[1.15em])
      const answerLineHeight = 128 * 1.15
      const answerStartY = 800 - ((answerLines.length - 1) * answerLineHeight) / 2
      answerLines.forEach((line, index) => {
        ctx.fillText(line, 800, answerStartY + index * answerLineHeight)
      })
      ctx.restore()
      
      // 绘制右下角水印
      ctx.save()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.filter = 'none'
      
      // 格式化时间：YYYY-MM-DD HH:mm:ss
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      
      // 绘制时间（上方，使用 kenpixel 字体）
      ctx.font = '28px kenpixel, monospace'
      ctx.fillText(timeString, 1540, 1520)
      
      // 绘制来源（下方，使用 sans-serif 字体）
      ctx.font = '28px sans-serif'
      ctx.fillText('答案之书 Agent 生成', 1540, 1560)
      ctx.restore()
      
      // 转换为blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('生成图片失败'))
        }
      }, 'image/png')
      
    } catch (error) {
      reject(error)
    }
  })
}