import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
分析{parameters}：
描述：{description}

請依照標準 OpenAPI 規範分析參數設計，包含：
- 參數命名是否符合規範
- 類型定義是否完整
- 必要性標註是否明確

[若發現任何問題，直接列出問題點，否則回答「無問題」]

[若有問題，提供具體改進建議]`,
  inputVariables: ["parameters", "description"]
});
