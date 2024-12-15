import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
身為 API 設計專家，請分析此 API 的參數設計：

API 資訊：
參數：{parameters}
描述：{description}

評估依據：
1. 參數命名規範
- 使用 camelCase 命名
- 名稱具描述性，避免縮寫
- 遵循一致的命名風格
- 避免特殊字符

2. 參數定義規範
- 明確的數據類型
- 合理的參數位置（path/query/header）
- 清晰的參數描述
- 具體的使用說明

3. 參數驗證規範
- 明確的必填標記
- 合理的預設值
- 適當的值範圍限制
- 正確的格式驗證

- 問題：
[若有問題則列出，每點一句話；若無則回答「無」]

- 建議：
[若有建議則列出，每點一句話；若無則回答「無」]
`,
  inputVariables: ["parameters", "description"]
});