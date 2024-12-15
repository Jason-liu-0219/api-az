import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
身為 API 設計專家，請分析此 API 的路徑和方法設計：

API 資訊：
路徑：{path}
方法：{method}
描述：{description}

評估依據：
1. RESTful 路徑規範
- 使用名詞表示資源
- 使用複數形式表示集合
- 使用連字符(-)分隔字詞
- 避免動詞和特殊字符
- 資源層級要清晰

2. RESTful 方法規範
- GET：讀取資源，不改變狀態
- POST：創建資源或複雜操作
- PUT：完整更新資源
- PATCH：部分更新資源
- DELETE：刪除資源

- 問題：
[若有問題則列出，每點一句話；若無則回答「無」]

- 建議：
[若有建議則列出，每點一句話；若無則回答「無」]
`,
  inputVariables: ["path", "method", "description"]
});