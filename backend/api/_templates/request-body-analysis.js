import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `
請求體：{requestBody}
描述：{description}

檢查項目：
1. 數據結構是否合理
2. 必要字段是否完整

• 問題：
[若無問題回答「符合規範」，否則簡述問題]

• 建議：
[若有問題才提供建議]`,
  inputVariables: ["requestBody", "description"]
});
