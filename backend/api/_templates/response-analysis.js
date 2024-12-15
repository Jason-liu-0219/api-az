import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `
分析{responses}：
描述：{description}

請依照標準 OpenAPI 規範分析響應設計，包含：
- 狀態碼使用是否恰當
- 響應結構是否符合規範
- 錯誤處理是否完善

[若發現任何問題，直接列出問題點，否則回答「無問題」]

[若有問題，提供具體改進建議]`,
  inputVariables: ["responses", "description"]
});
