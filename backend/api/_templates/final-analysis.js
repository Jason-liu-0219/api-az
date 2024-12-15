import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
角色:
{systemRole}

API 整體評估，請嚴格按照以下格式回答：
規則：
1. 請根據之前的分析結果，總結出主要問題
2. 若完全符合規範，請直接回答「API 設計符合規範」，不需要詳細說明
3. 若有問題，才需要列出具體問題點和建議

分析結果：
{analysisContent}

• 主要問題：
[若有問題才列出，否則回答「API 設計符合規範」]

• 改進建議：
[若有問題才提供建議，否則不需回答]
`,
  inputVariables: ["analysisContent","systemRole"],
});
