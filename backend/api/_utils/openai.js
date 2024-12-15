import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { apiPrompts } from "../_prompts/api.js";

export const createOpenAIInstance = (apiKey) =>
  new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4-1106-preview",  // 使用更快的模型
    temperature: 0.3,                  // 降低創造性，提高確定性
    maxTokens: 1000,                   // 減少 token 限制
    cache: true,                       // 啟用快取
  });

export const createAnalysisChain = (prompt, openai) => {
  return RunnableSequence.from([
    async (input) => {
      const { data } = input;
      const {
        method,
        path,
        parameters,
        requestBody,
        responses,
        description = "無描述",
        summary = "無摘要",
        analysisContent,
      } = data;

      return {
        method: method?.toUpperCase(),
        path,
        parameters: parameters ? JSON.stringify(parameters) : undefined,
        requestBody: requestBody ? JSON.stringify(requestBody) : undefined,
        responses: responses ? JSON.stringify(responses) : undefined,
        description,
        summary,
        analysisContent,
        systemRole: apiPrompts.role,
        methodGuidelines: apiPrompts.methodGuidelines,
      };
    },
    prompt,
    openai,
  ]);
};
