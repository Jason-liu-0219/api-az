import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
API 整體評估：

分析結果：
{analysisContent}

• 主要問題：
[列出最重要的 2-3 個問題，每個問題一行]

• 改進建議：
[針對每個主要問題提供簡短的改進建議]
`,
  inputVariables: ["analysisContent"]
});
