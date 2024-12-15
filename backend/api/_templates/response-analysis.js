import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `
響應：{responses}
描述：{description}

檢查項目：
1. 狀態碼使用是否恰當
2. 響應結構是否合理

• 問題：
[若無問題回答「符合規範」，否則簡述問題]

• 建議：
[若有問題才提供建議]`,
  inputVariables: ["responses", "description"]
});
