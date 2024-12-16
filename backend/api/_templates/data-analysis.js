import { PromptTemplate } from "@langchain/core/prompts";

export const dataAnalysisTemplate = new PromptTemplate({
  template: `Analyze the API's data structure based on these criteria:

Info:
Request Body: {requestBody}
Responses: {responses}

Evaluation Criteria:
1. Request Body Rules
- Clear structure
- Required fields
- Data types
- Validation rules
- Examples provided

2. Response Rules
- Status codes usage
- Error handling
- Response structure
- Data format
- Performance considerations

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["requestBody", "responses"]
});
