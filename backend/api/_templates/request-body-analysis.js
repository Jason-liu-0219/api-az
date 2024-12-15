import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `
  分析此 API 請求體設計，請嚴格按照以下格式回答：
規則：
1. 請只分析請求體的數據結構設計是否合理，以及必要字段是否完整
2. 若符合規範，請直接回答「符合規範」，不需要詳細說明
3. 若有問題，才需要列出具體問題點

請求體：{requestBody}
描述：{description}

• 問題：
[若有問題才列出，否則回答「符合規範」]

• 建議：
[若有問題才提供建議，否則不需回答]
`,
  inputVariables: ["requestBody", "description"]
});
