import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
API Expert Analysis - Path & Method:

Info:
Path: {path}
Method: {method}
Desc: {description}

Criteria:
1. RESTful Path Rules
- Use nouns for resources
- Use plurals for collections
- Use hyphens for separators
- Avoid verbs and special chars
- Clear resource hierarchy

2. RESTful Method Rules
- GET: Read only, no state change
- POST: Create or complex ops
- PUT: Full update
- PATCH: Partial update
- DELETE: Remove resource

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]
`,
  inputVariables: ["path", "method", "description"]
});