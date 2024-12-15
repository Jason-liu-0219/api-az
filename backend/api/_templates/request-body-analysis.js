import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `
身為 API 設計專家，請分析此 API 的請求體設計：

API 資訊：
請求體：{requestBody}
描述：{description}

評估依據：
1. 數據結構規範
- 層次結構合理清晰
- 避免過度嵌套（不超過3層）
- 避免不必要的數據冗餘
- 相關數據正確分組

2. 字段規範
- 使用 camelCase 命名
- 名稱具有描述性
- 避免縮寫和特殊字符
- 遵循一致的命名風格

3. 數據規範
- 明確的數據類型
- 合理的格式限制
- 適當的預設值
- 清晰的必填標記

- 問題：
[若有問題則列出，每點一句話；若無則回答「無」]

- 建議：
[若有建議則列出，每點一句話；若無則回答「無」]
`,
  inputVariables: ["requestBody", "description"]
});