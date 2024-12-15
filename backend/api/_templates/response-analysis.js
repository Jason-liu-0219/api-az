import { PromptTemplate } from "@langchain/core/prompts";

export const responseAnalysisTemplate = new PromptTemplate({
  template: `系統角色：{systemRole}

分析以下 API 端點的響應：
路徑：{path}
方法：{method}
響應：{responses}
描述：{description}

請提供以下分析：
1. 響應狀態碼的使用是否恰當？
2. 響應格式是否統一且易於理解？
3. 錯誤處理是否完善？
4. 有什麼可以改進的建議嗎？

請用中文回答，並保持專業、簡潔的語氣。`,
  inputVariables: ["systemRole", "method", "path", "responses", "description"]
});
