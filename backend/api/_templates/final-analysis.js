import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `
API Expert Analysis - Final Review:

Analysis Results:
{analysisContent}

Criteria:
1. RESTful Standards
- Resource-oriented design
- Proper HTTP methods
- Uniform interface
- Stateless interaction

2. Consistency Standards
- Unified naming
- Consistent structure
- Standard error handling
- Complete status codes

3. Usability Standards
- Clear documentation
- Complete params
- Valid rules
- Useful examples

Pros:
[List strengths, one per line; or "None"]

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]
`,
  inputVariables: ["analysisContent"]
});