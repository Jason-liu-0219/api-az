import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
Based on the following API analysis:
{analysisContent}

Please evaluate the API considering RESTful standards, consistency standards, and usability standards, then provide only these sections:

Pros:
[List key strengths, one per line]

Issues:
[List all issues found, one per line]

Suggest:
[List specific improvement suggestions, one per line]
`,
  inputVariables: ["analysisContent"]
});