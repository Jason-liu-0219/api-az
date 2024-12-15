import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
參數：{parameters}
描述：{description}

檢查項目：
1. 命名是否清晰（使用小駝峰）
2. 類型定義是否完整
3. 必要性標註是否明確

• 問題：
[若無問題回答「符合規範」，否則簡述問題]

• 建議：
[若有問題才提供建議]`,
  inputVariables: ["parameters", "description"]
});
