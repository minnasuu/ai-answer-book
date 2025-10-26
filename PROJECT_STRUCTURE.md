# 项目结构说明

## 📁 目录结构

```
src/
├── components/          # UI组件
│   ├── Header.tsx      # 页面头部
│   ├── AIToggle.tsx    # AI模式开关
│   ├── CategorySelector.tsx  # 分类选择器
│   ├── QuestionInput.tsx     # 问题输入框
│   ├── AnswerDisplay.tsx     # 答案显示区域
│   └── Footer.tsx      # 页脚
├── services/           # 业务逻辑
│   └── aiService.ts    # AI服务（包含真实AI和Mock数据生成）
├── types.ts            # TypeScript类型定义
├── constants.ts        # 常量配置
├── mockData.ts         # Mock数据
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 📝 文件说明

### 类型定义 (`types.ts`)
- `CategoryType`: 答案类型（经典/电影/歌词/诗词/文学）
- `AnswersByType`: 分类答案结构（肯定/否定/神秘/建议/鼓励）

### 常量配置 (`constants.ts`)
- 混元API配置（URL、Key、Model）
- 分类样式配置
- 分类标签映射

### Mock数据 (`mockData.ts`)
- 5种类型的预设答案
- 每种类型包含5类回答，每类3条

### AI服务 (`services/aiService.ts`)
- `generateMockAnswer()`: 生成模拟答案
- `generateAIAnswer()`: 调用混元API生成真实答案

### 组件说明

#### Header
- 显示应用标题和图标
- 纯展示组件，无状态

#### AIToggle
- AI模式/模拟模式切换开关
- Props: `useAI`, `onToggle`

#### CategorySelector
- 答案类型选择（经典/电影/歌词/诗词/文学）
- Props: `selectedCategory`, `onCategoryChange`

#### QuestionInput
- 问题输入框
- 支持回车键提交
- Props: `question`, `isThinking`, `onQuestionChange`, `onSubmit`

#### AnswerDisplay
- 显示思考状态和答案
- 包含"再问一次"按钮
- Props: `isThinking`, `showAnswer`, `answer`, `onReset`

#### Footer
- 页脚提示文字
- 纯展示组件，无状态

### 主应用 (`App.tsx`)
- 状态管理
- 组件组合
- 业务逻辑协调

## 🎯 设计原则

1. **单一职责**: 每个组件只负责一个功能
2. **可复用性**: 组件通过Props接收数据和回调
3. **关注点分离**: UI、逻辑、数据分离
4. **类型安全**: 完整的TypeScript类型定义
5. **易于维护**: 清晰的文件组织和命名

## 🔄 数据流

```
用户输入 → QuestionInput → App (getAnswer)
                                ↓
                          aiService (generateAIAnswer/generateMockAnswer)
                                ↓
                          App (setAnswer) → AnswerDisplay
```

## 🚀 扩展建议

1. **添加新的答案类型**: 在 `types.ts` 和 `constants.ts` 中添加新类型
2. **自定义AI配置**: 修改 `constants.ts` 中的API配置
3. **扩展Mock数据**: 在 `mockData.ts` 中添加更多预设答案
4. **新增组件**: 在 `components/` 目录下创建新组件
5. **添加新服务**: 在 `services/` 目录下创建新的服务模块
