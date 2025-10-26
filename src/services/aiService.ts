import { HUNYUAN_API_URL, HUNYUAN_API_KEY, HUNYUAN_MODEL, CATEGORY_STYLE } from '../constants'
import { MOCK_ANSWERS } from '../mockData'

/**
 * 使用Mock数据生成答案
 */
export async function generateMockAnswer(): Promise<string> {
  // 模拟AI生成延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 收集所有16条回答
  const allAnswers = [
    ...MOCK_ANSWERS.affirmative,
    ...MOCK_ANSWERS.negative,
    ...MOCK_ANSWERS.mysterious,
    ...MOCK_ANSWERS.neutral,
    ...MOCK_ANSWERS.advice
  ]

  // 随机选择一条
  return allAnswers[Math.floor(Math.random() * allAnswers.length)]
}

/**
 * 使用AI生成答案
 */
export async function generateAIAnswer(userQuestion: string): Promise<string> {
  const systemPrompt = `你是一个智慧的答案之书AI助手。用户会提出一个问题，你需要针对这个问题生成16条不同类型的回答。

要求：
1. 所有回答必须与用户的问题相关
2. 回答要采用${CATEGORY_STYLE}
3. 必须严格按照以下JSON格式返回，不要有任何其他文字

{
  "affirmative": ["肯定回答1", "肯定回答2", "肯定回答3", "肯定回答4", "肯定回答5"],
  "negative": ["否定回答1", "否定回答2", "否定回答3", "否定回答4", "否定回答5"],
  "mysterious": ["神秘回答1", "神秘回答2"],
  "neutral": ["中立回答1", "中立回答2"],
  "advice": ["建议回答1", "建议回答2"]
}

分类说明：
- affirmative（肯定类，5条）：给予肯定、支持、积极的答案
- negative（否定类，5条）：给予否定、警示、消极的答案
- mysterious（神秘类，2条）：模糊、神秘、引人思考的答案
- neutral（中立类，2条）：客观、中立、不偏不倚的答案
- advice（建议类，2条）：给出建议、指导的答案`

  const userPrompt = `用户的问题是：${userQuestion}\n\n请生成16条与此问题相关的回答（肯定5条、否定5条、神秘2条、中立2条、建议2条），严格按照JSON格式返回。`

  try {
    const response = await fetch(HUNYUAN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUNYUAN_API_KEY}`
      },
      body: JSON.stringify({
        model: HUNYUAN_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1200
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content?.trim()
    
    if (!aiResponse) {
      throw new Error('AI返回内容为空')
    }

    // 解析JSON响应
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('无法解析AI返回的JSON格式')
    }

    const answersData = JSON.parse(jsonMatch[0])
    
    // 收集所有16条回答
    const allAnswers: string[] = [
      ...answersData.affirmative,
      ...answersData.negative,
      ...answersData.mysterious,
      ...answersData.neutral,
      ...answersData.advice
    ]

    // 随机选择一条
    const randomIndex = Math.floor(Math.random() * allAnswers.length)
    return allAnswers[randomIndex]

  } catch (error) {
    console.error('AI生成失败:', error)
    return "抱歉，暂时无法生成答案，请稍后再试。"
  }
}
