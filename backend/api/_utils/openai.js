import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { apiPrompts } from "../_prompts/api.js";

export const createOpenAIInstance = (apiKey) =>
  new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo-0125",  // Much faster than GPT-4, latest version
    temperature: 0.1,                  // Low temperature for consistent responses
    maxTokens: 500,                    // Balanced token limit
    presencePenalty: 0.1,             // Light penalty for variety
    frequencyPenalty: 0.1,            // Light penalty for repetition
    topP: 0.1,                        // Focused sampling
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
