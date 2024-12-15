import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { apiPrompts } from "../_prompts/api.js";

export const createOpenAIInstance = (apiKey, modelType = 'gpt-3.5') => {
  const baseConfig = {
    openAIApiKey: apiKey,
    temperature: 0.1,                  // Low temperature for consistent responses
    maxTokens: 500,                    // Balanced token limit
    presencePenalty: 0.1,             // Light penalty for variety
    frequencyPenalty: 0.1,            // Light penalty for repetition
    topP: 0.1,                        // Focused sampling
    timeout: 15000,                   // 15 second timeout
  };

  const modelConfig = {
    'gpt-4': {
      ...baseConfig,
      modelName: "gpt-4-0125-preview",  // Latest GPT-4 Turbo version
      maxTokens: 800,                   // Higher token limit for complex analysis
    },
    'gpt-3.5': {
      ...baseConfig,
      modelName: "gpt-3.5-turbo-0125",  // Latest GPT-3.5 version
    }
  };

  return new OpenAI(modelConfig[modelType] || modelConfig['gpt-3.5']);
};

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
    openai
  ]);
};
