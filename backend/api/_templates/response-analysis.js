import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `
API Expert Analysis - Response:

Info:
Response: {responses}
Desc: {description}

Criteria:
1. Status Code Rules
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

2. Structure Rules
- Consistent format
- Logical structure
- Standard naming
- Accurate types

3. Error Rules
- Clear error codes
- Helpful messages
- Sufficient details

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]
`,
  inputVariables: ["responses", "description"]
});