import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `
身為 API 設計專家，請分析此響應設計：

API 資訊：
響應內容：{responses}
描述：{description}

評估依據：
1. 狀態碼規範
- 200：成功獲取資源
- 201：成功創建資源
- 400：請求錯誤
- 401：未授權
- 403：禁止訪問
- 404：資源未找到
- 500：服務器錯誤

2. 響應結構規範
- 統一的響應格式
- 合理的數據結構
- 規範的字段命名
- 準確的類型定義

3. 錯誤處理規範
- 明確的錯誤碼
- 清晰的錯誤訊息
- 足夠的錯誤詳情

- 問題：
[若有問題則列出，每點一句話；若無則回答「無」]

- 建議：
[若有建議則列出，每點一句話；若無則回答「無」]
`,
  inputVariables: ["responses", "description"]
});