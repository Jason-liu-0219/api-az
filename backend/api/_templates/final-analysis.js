import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
API 整體分析：

各部分分析結果：
{analysisContent}

請依照標準 OpenAPI 規範進行整體評估：

1. API 設計評估
- RESTful 原則符合度
- 接口語義明確性
- 一致性維護情況

2. 組件規範評估
- 命名規範遵循度
- 數據結構合理性
- 類型定義準確性

3. 文檔完整性評估
- 描述信息充分度
- 示例代碼完整性
- 錯誤處理說明

[最終結論]
{綜合所有分析結果，列出主要問題，若無問題則回答「無問題」}

[整體建議]
{若有問題，提供具體的改進方案}`,
  inputVariables: ["analysisContent"]
});
