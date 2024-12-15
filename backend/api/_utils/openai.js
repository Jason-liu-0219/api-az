import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { apiPrompts } from "../_prompts/api.js";

export const createOpenAIInstance = (apiKey) =>
  new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4-0125-preview",  // Use fastest model
    temperature: 0,                    // Zero temperature for most consistent and fastest responses
    maxTokens: 250,                   // Reduced token limit for faster responses
    presencePenalty: 0,               // Remove penalties for faster processing
    frequencyPenalty: 0,              // Remove penalties for faster processing
    topP: 0.1,                        // More focused sampling for faster responses
    timeout: 15000,                   // 15 second timeout
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
        description = "No description",
        summary = "No summary",
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
