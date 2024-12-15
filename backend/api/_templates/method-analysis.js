import { PromptTemplate } from "@langchain/core/prompts";

export const methodAnalysisTemplate = new PromptTemplate({
  template: `
分析 HTTP 方法是否符合 RESTful 規範：

• 方法：{method}
• 結果：[符合/不符合]
• 問題：[若不符合，簡述原因]
`,
  inputVariables: ["method"]
});
