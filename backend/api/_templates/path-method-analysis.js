import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `Analyze the following path and method based on these criteria:

Info:
Path: {path}
Method: {method}
Desc: {description}

Evaluation Criteria:
1. RESTful Path Rules
- Use nouns for resources, including:
  * State nouns: status, health, state, condition
  * Action results: report, log, audit, summary
  * Resource states: draft, published, archived
  * Metadata: config, setting, preference
- Use plurals for collections
- Use hyphens for separators
- Avoid action verbs that modify resources:
  * Creation: create, add, insert
  * Modification: update, modify, change
  * Deletion: delete, remove, clear
- Clear resource hierarchy

2. RESTful Method Rules
- GET: Read only, no state change
- POST: Create or complex ops
- PUT: Full update
- PATCH: Partial update
- DELETE: Remove resource

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["path", "method", "description"]
});