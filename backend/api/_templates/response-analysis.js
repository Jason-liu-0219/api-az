import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `
響應分析：
描述：{description}

請依照標準 OpenAPI 規範分析響應設計：

1. 狀態碼評估
- 成功響應碼是否恰當
- 錯誤響應碼是否完整
- 是否覆蓋主要場景

2. 響應結構評估
- 數據結構是否合理
- 字段命名是否規範
- 類型定義是否準確

3. 錯誤處理評估
- 錯誤信息是否清晰
- 是否包含必要詳情
- 是否便於排查問題

[分析結果]
{問題點列表，若無問題則回答「無問題」}

[改進建議]
{若有問題，列出具體改進建議}`,
  inputVariables: ["responses", "description"]
});
