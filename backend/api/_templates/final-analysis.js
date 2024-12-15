import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
整合分析{analysisContent}：

請依照標準 OpenAPI 規範整合以上分析結果，包含：
- API 整體設計是否符合 RESTful 原則
- 所有組件是否遵循標準規範
- 文檔完整性是否符合要求

[整合上述所有問題點，若無問題則回答「無問題」]

[若有問題，提供具體改進建議]`,
  inputVariables: ["analysisContent"]
});
