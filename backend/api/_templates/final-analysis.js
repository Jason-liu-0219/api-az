import { PromptTemplate } from "@langchain/core/prompts";

export const finalAnalysisTemplate = PromptTemplate.fromTemplate(`
系統角色：{systemRole}

基於之前的分析，為以下 API 端點提供總結：
路徑：{path}
方法：{method}
描述：{description}

請提供以下總結：
1. 整體設計評價
2. 主要優點
3. 需要改進的地方
4. 具體改進建議

請用中文回答，並保持專業、簡潔的語氣。
`);
