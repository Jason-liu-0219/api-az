import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `Analyze the following request body based on these criteria:

Info:
Body: {requestBody}
Desc: {description}

Evaluation Criteria:
1. Structure
- Clear hierarchy
- No deep nesting (max 3)
- No redundancy
- Proper grouping

2. Fields
- camelCase
- Descriptive
- No abbr/special chars
- Consistent style

3. Data
- Clear types
- Valid format
- Default values
- Required marks

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["requestBody", "description"]
});