import { PromptTemplate } from "@langchain/core/prompts";

export const methodAnalysisTemplate = new PromptTemplate({
  template: `系統角色：{systemRole}

方法指南：
{methodGuidelines}

分析以下 API 端點的 HTTP 方法：
方法：{method}
路徑：{path}
描述：{description}

請提供以下分析：
1. 此方法是否符合 RESTful API 最佳實踐？為什麼？
2. 此方法是否適合該端點的用途？為什麼？
3. 此方法的安全性和冪等性如何？
4. 有什麼可以改進的建議嗎？

請用中文回答，並保持專業、簡潔的語氣。`,
  inputVariables: ["systemRole", "methodGuidelines", "method", "path", "description"]
});
