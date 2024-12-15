import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `Analyze the following response based on these criteria:

Info:
Responses: {responses}
Desc: {description}

Evaluation Criteria:
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

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["responses", "description"]
});