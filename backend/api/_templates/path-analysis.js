import { PromptTemplate } from "@langchain/core/prompts";

export const pathAnalysisTemplate = PromptTemplate.fromTemplate(`
系統角色：{systemRole}

分析以下 API 端點的路徑：
路徑：{path}
方法：{method}
描述：{description}

請提供以下分析：
1. 路徑的設計是否符合 RESTful API 最佳實踐？為什麼？
2. 路徑是否清晰表達了資源和操作的意圖？
3. 路徑的版本控制策略是什麼？
4. 有什麼可以改進的建議嗎？

請用中文回答，並保持專業、簡潔的語氣。
`);
