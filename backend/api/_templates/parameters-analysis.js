import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `Analyze the following parameters based on these criteria:

Info:
Parameters: {parameters}
Desc: {description}

Evaluation Criteria:
1. Naming Rules
- Use camelCase
- Be descriptive
- Avoid abbreviations
- Consistent style

2. Definition Rules
- Clear data types
- Proper location (path/query/header)
- Clear descriptions
- Usage examples

3. Validation Rules
- Required flags
- Default values
- Value constraints
- Format validation

Based on the above criteria, provide ONLY these sections in your response:

Issues:
[List issues, one per line; or "None"]

Suggest:
[List suggestions, one per line; or "None"]`,
  inputVariables: ["parameters", "description"]
});