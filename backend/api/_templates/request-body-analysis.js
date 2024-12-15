import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `
分析{requestBody}：
描述：{description}

請依照標準 OpenAPI 規範分析請求體設計，包含：
- 數據結構是否合理
- 必要字段是否完整
- 類型定義是否準確

[若發現任何問題，直接列出問題點，否則回答「無問題」]

[若有問題，提供具體改進建議]`,
  inputVariables: ["requestBody", "description"]
});
