import { PromptTemplate } from "@langchain/core/prompts";

export const parametersAnalysisTemplate = new PromptTemplate({
  template: `系統角色：{systemRole}

分析以下 API 端點的參數：
路徑：{path}
方法：{method}
參數：{parameters}
描述：{description}

請提供以下分析：
1. 參數的命名是否清晰且符合慣例？
2. 必要參數和可選參數的設計是否合理？
3. 參數的類型和格式是否適當？
4. 有什麼可以改進的建議嗎？

請用中文回答，並保持專業、簡潔的語氣。`,
  inputVariables: ["systemRole", "method", "path", "parameters", "description"]
});
