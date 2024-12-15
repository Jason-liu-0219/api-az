import { PromptTemplate } from "@langchain/core/prompts";

export const requestBodyAnalysisTemplate = new PromptTemplate({
  template: `系統角色：{systemRole}

分析以下 API 端點的請求體：
路徑：{path}
方法：{method}
請求體：{requestBody}
描述：{description}

請提供以下分析：
1. 請求體的結構是否清晰合理？
2. 必要欄位和可選欄位的設計是否恰當？
3. 數據類型和格式是否適當？
4. 有什麼可以改進的建議嗎？

請用中文回答，並保持專業、簡潔的語氣。`,
  inputVariables: ["systemRole", "method", "path", "requestBody", "description"]
});
