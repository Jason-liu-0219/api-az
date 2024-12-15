import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
分析{path}和{method}：
描述：{description}

請依照標準 OpenAPI 規範分析路徑和方法設計，包含：
- 路徑是否使用正確的命名規則
- HTTP 方法是否符合 RESTful 規範

[若發現任何問題，直接列出問題點，否則回答「無問題」]

[若有問題，提供具體改進建議]
`,
  inputVariables: ["path", "method", "description"]
});
