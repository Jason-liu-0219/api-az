import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
API 整體評估，請嚴格按照以下規則進行簡短分析：
規則：
1. 必須檢查以下幾個方面：
   - 路徑設計是否符合 RESTful 規範
   - HTTP 方法使用是否正確
   - 參數設計是否合理
   - 請求/響應格式是否標準
   - 錯誤處理是否完善

2. 對於每個問題：
   - 明確指出具體違反了哪個規範
   - 解釋為什麼這是一個問題
   - 提供具體的修正建議

分析結果：{analysisContent}
`,
  inputVariables: ["analysisContent"]
});
