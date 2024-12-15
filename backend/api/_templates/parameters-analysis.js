import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
參數分析：
描述：{description}

請依照標準 OpenAPI 規範分析參數設計：

1. 參數定義評估
- 命名規則是否規範
- 參數位置是否合適
- 是否包含必要說明

2. 類型定義評估
- 數據類型是否準確
- 格式限制是否合理
- 是否有效驗證

3. 必要性評估
- 必要參數標註是否清晰
- 可選參數是否合理
- 預設值是否適當

[分析結果]
{問題點列表，若無問題則回答「無問題」}

[改進建議]
{若有問題，列出具體改進建議}`,
  inputVariables: ["parameters", "description"]
});
