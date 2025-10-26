export type CategoryType = 'classic'

export interface AnswersByType {
  affirmative: string[]    // 肯定类 5条
  negative: string[]       // 否定类 5条
  mysterious: string[]     // 神秘类 2条
  neutral: string[]        // 中立类 2条
  advice: string[]         // 建议类 2条
}
