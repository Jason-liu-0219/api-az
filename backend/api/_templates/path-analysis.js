import { PromptTemplate } from "@langchain/core/prompts";

export const pathAnalysisTemplate = new PromptTemplate({
  template: `
分析此 API 路徑設計，請嚴格按照以下格式回答：
路徑：{path}
方法：{method}
描述：{description}

規則：
1. 請只分析路徑命名是否符合 RESTful 規範，以及是否清晰易懂
2. 若符合規範，請直接回答「符合規範」，不需要詳細說明
3. 若有問題，才需要列出具體問題點

• 問題：
[若有問題才列出，否則回答「符合規範」]

• 建議：
[若有問題才提供建議，否則不需回答]`,
  inputVariables: ["path", "method", "description"]
});
