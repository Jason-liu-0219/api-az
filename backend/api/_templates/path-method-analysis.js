import { PromptTemplate } from "@langchain/core/prompts";

export const pathMethodAnalysisTemplate = new PromptTemplate({
  template: `
路徑和方法分析：
路徑：{path}
方法：{method}
描述：{description}

請依照標準 OpenAPI 規範分析路徑和方法設計：

1. 路徑設計評估
- 命名規則是否符合 RESTful 規範
- 資源標識是否清晰
- URL 結構是否合理

2. HTTP 方法評估
- 是否符合 RESTful 語義
- 是否適合當前操作

[分析結果]
{問題點列表，若無問題則回答「無問題」}

[改進建議]
{若有問題，列出具體改進建議}`,
  inputVariables: ["path", "method", "description"]
});
