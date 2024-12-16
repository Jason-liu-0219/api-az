import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = new PromptTemplate({
  template: `Provide a comprehensive analysis of the API based on previous analysis results:

API Info:
Path: {path}
Method: {method}
Description: {description}

Previous Analysis Results:
1. Base Analysis (Path, Method, Parameters):
{baseAnalysis}

2. Data Analysis (Request/Response):
{dataAnalysis}

Evaluation Focus:
1. Overall Design
- RESTful compliance
- Resource modeling
- URL structure
- HTTP method usage

2. Data Flow
- Request/Response structure
- Parameter organization
- Data validation
- Error handling

3. Best Practices
- Security considerations
- Performance implications
- Documentation quality
- Developer experience

Based on the above criteria, provide these sections:

Final Recommendations:
[List actionable recommendations, one per line]

REFACTORING EXAMPLE:
[List potential refactorings, one per line]
`,
  inputVariables: [
    "path",
    "method",
    "description",
    "baseAnalysis",
    "dataAnalysis",
  ],
});
