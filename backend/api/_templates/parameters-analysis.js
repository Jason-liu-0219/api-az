import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
分析參數設計：

• 參數：{parameters}
• 結果：[合理/不合理]
• 問題：[若不合理，列出主要問題]
`,
  inputVariables: ["parameters"]
});
