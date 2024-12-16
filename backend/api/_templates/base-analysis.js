import { PromptTemplate } from "@langchain/core/prompts";

export const baseAnalysisTemplate = new PromptTemplate({
  template: `Analyze the API's base structure based on these criteria:

Info:
Path: {path}
Method: {method}
Parameters: {parameters}

Evaluation Criteria:
1. RESTful Path Rules
- Use nouns, not verbs (carefully check if word can be both - examples: 'update' is verb, 'report' can be noun)
- Use plurals for collections
- Use lowercase letters
- Keep hierarchy with /
- Use query params for filtering
- Version prefix if needed: /v1

2. RESTful Method Rules
- GET: Read only, no state change
- POST: Create or complex ops
- PUT: Full update
- PATCH: Partial update
- DELETE: Remove resource

3. Parameter Rules
- Clear naming
- Proper location (path/query/header)
- Required flags
- Default values
- Format validation

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["path", "method", "parameters"]
});
