import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `
請求體分析{requestBody}：
描述：{description}

請依照標準 OpenAPI 規範分析請求體設計：

1. 數據結構評估
- 結構設計是否合理
- 層級關係是否清晰
- 是否避免冗餘

2. 字段定義評估
- 命名是否規範
- 類型是否準確
- 格式是否合適

3. 必要性評估
- 必要字段是否完整
- 可選字段是否合理
- 預設值是否適當

[分析結果] 問題點列表，若無問題則回答「無問題」

[改進建議] 若有問題，列出具體改進建議
`,
  inputVariables: ["requestBody", "description"]
});
