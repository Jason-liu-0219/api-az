import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `{analysisContent}

Evaluate based on:
- RESTful design
- Naming consistency
- Documentation clarity

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["analysisContent"]
});