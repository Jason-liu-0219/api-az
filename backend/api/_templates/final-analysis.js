import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
身為 API 設計專家，請根據以下分析結果提供整體評估：

分析內容：
{analysisContent}

評估依據：
1. RESTful 規範
- 資源導向的設計
- 正確的 HTTP 方法使用
- 統一的介面規範
- 無狀態交互

2. 一致性規範
- 統一的命名風格
- 一致的數據結構
- 標準的錯誤處理
- 完整的狀態碼

3. 可用性規範
- 清晰的文檔說明
- 完整的參數描述
- 合理的驗證規則
- 實用的範例

- 優點：
[列出主要優點，每點一句話；若無則回答「無」]

- 問題：
[列出主要問題，每點一句話；若無則回答「無」]

- 建議：
[列出改進建議，每點一句話；若無則回答「無」]
`,
  inputVariables: ["analysisContent"]
});