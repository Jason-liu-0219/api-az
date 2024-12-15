import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
路徑：{path}
方法：{method}
描述：{description}

檢查項目：
1. 路徑是否使用名詞且格式正確
2. HTTP 方法是否符合操作類型

• 問題：
[若無問題回答「符合規範」，否則簡述問題]

• 建議：
[若有問題才提供建議]
`,
  inputVariables: ["path", "method", "description"]
});
