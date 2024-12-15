import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `
分析此 API 參數設計，請嚴格按照以下規則進行分析：
參數：{parameters}
描述：{description}

規則：
1. 參數命名規範：
   - 必須使用小駝峰命名法（例如：userId）
   - 名稱必須清晰表達其用途
   - 避免使用縮寫（除非是普遍接受的縮寫如 id）

2. 參數類型設計：
   - 必須明確定義參數類型
   - 數字類型必須有明確的範圍限制
   - 字符串類型必須有長度限制
   - 日期時間必須指定格式

3. 必要性設計：
   - 必要參數必須明確標註
   - 可選參數必須有默認值
   - 相互依賴的參數必須說明

• 問題：
[若完全符合以上規則才回答「符合規範」，否則必須列出具體違反哪些規則]

• 建議：
[若發現問題必須提供具體的修正建議]`,
  inputVariables: ["parameters", "description"]
});
