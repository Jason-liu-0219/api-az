import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
根據以下分析結果進行總結：
{analysisContent}

• 主要問題：
[整合上述分析中提到的主要問題，若無問題則回答「API 設計符合規範」]

• 改進建議：
[若有問題，整合上述分析中的改進建議]
`,
  inputVariables: ["analysisContent"]
});
