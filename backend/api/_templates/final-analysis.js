import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `Based on the previous analysis results:
{analysisContent}

Summarize into:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["analysisContent"]
});