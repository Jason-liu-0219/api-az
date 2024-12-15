import { PromptTemplate } from "@langchain/core/prompts";

export const methodAnalysisTemplate = new PromptTemplate({
  template: `
  分析此 API 的 HTTP 方法使用，請嚴格按照以下規則進行分析：

規則：
1. 請仔細檢查 HTTP 方法是否完全符合 RESTful 規範：
   - GET：只用於讀取資源，不應修改數據
   - POST：用於創建新資源
   - PUT：用於完整更新資源
   - PATCH：用於部分更新資源
   - DELETE：用於刪除資源

2. 檢查方法是否與描述的操作相符：
   - 創建操作必須使用 POST
   - 更新操作必須使用 PUT 或 PATCH
   - 刪除操作必須使用 DELETE
   - 查詢操作必須使用 GET

3. 任何不符合以上規則的使用都應該被標記為問題

方法：{method}
路徑：{path}
描述：{description}

• 問題：
[若完全符合以上規則才回答「符合規範」，否則必須列出具體違反哪些規則]

• 建議：
[若發現問題必須提供具體的修正建議]
`,
  inputVariables: ["method", "path", "description"]
});
