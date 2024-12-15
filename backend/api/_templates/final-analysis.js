import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
API 整體評估，請嚴格按照以下規則進行分析：

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

3. 評估嚴重程度：
   - 阻斷性問題（影響 API 正常運作）
   - 重要問題（影響 API 使用體驗）
   - 建議性問題（可以改進的地方）

分析結果：
{analysisContent}

• 問題分類：
1. 阻斷性問題：
[列出所有阻斷性問題，若無則填"無"]

2. 重要問題：
[列出所有重要問題，若無則填"無"]

3. 建議性問題：
[列出所有建議性問題，若無則填"無"]

• 具體改進建議：
[針對每個問題提供具體、可執行的改進建議]

• 優先處理順序：
[列出問題的建議處理順序，從最緊急到最不緊急]
`,
  inputVariables: ["analysisContent"]
});
