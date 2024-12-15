import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
分析此 API 的路徑和 HTTP 方法設計：
路徑：{path}
方法：{method}
描述：{description}

規則：
1. 路徑設計：
   - 使用名詞表示資源
   - 使用複數形式表示集合
   - 使用 kebab-case 命名
   - 版本號應在路徑中

2. HTTP 方法：
   - GET：只用於讀取資源
   - POST：創建新資源
   - PUT：完整更新資源
   - PATCH：部分更新資源
   - DELETE：刪除資源

• 問題：
[若完全符合規則才回答「符合規範」，否則列出問題]

• 建議：
[若有問題才提供修正建議]
`,
  inputVariables: ["path", "method", "description"]
});
