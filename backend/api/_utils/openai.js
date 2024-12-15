import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { apiPrompts } from "../_prompts/api.js";

export const createOpenAIInstance = (apiKey) =>
  new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4-1106-preview",
    temperature: 0.7,
    maxTokens: 2000,
  });

export const createAnalysisChain = (prompt, openai) => {
  return RunnableSequence.from([
    async (input) => {
      const {
        method,
        path,
        parameters,
        requestBody,
        responses,
        description = "無描述",
      } = input;

      return {
        method: method?.toUpperCase(),
        path,
        parameters,
        requestBody,
        responses,
        description,
        systemRole: apiPrompts.role,
        methodGuidelines: apiPrompts.methodGuidelines,
      };
    },
    prompt,
    openai,
  ]);
};
