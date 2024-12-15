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

// 評估 API 數據的複雜度
export const evaluateComplexity = (data) => {
  let complexityScore = 0;
  
  // 檢查請求體的複雜度
  if (data.requestBody) {
    const requestBodyStr = JSON.stringify(data.requestBody);
    complexityScore += (requestBodyStr.match(/{/g) || []).length * 2; // 嵌套層級
    complexityScore += (requestBodyStr.match(/,/g) || []).length;     // 屬性數量
  }

  // 檢查響應的複雜度
  if (data.responses) {
    const responsesStr = JSON.stringify(data.responses);
    complexityScore += (responsesStr.match(/{/g) || []).length * 2;
    complexityScore += (responsesStr.match(/,/g) || []).length;
  }

  // 檢查參數的複雜度
  if (Array.isArray(data.parameters)) {
    complexityScore += data.parameters.length * 2;
    // 檢查是否有複雜的參數類型
    complexityScore += data.parameters.filter(p => 
      p.schema?.type === 'object' || p.schema?.type === 'array'
    ).length * 3;
  }

  // 檢查描述的長度
  if (data.description) {
    complexityScore += Math.floor(data.description.length / 100);
  }

  return complexityScore;
};

// 根據複雜度選擇模型
export const selectModel = (data, forceModel = null) => {
  if (forceModel) return forceModel;
  
  const complexityScore = evaluateComplexity(data);
  console.log(`Complexity score: ${complexityScore}`);
  
  // 複雜度閾值，可以根據需要調整
  return complexityScore > 15 ? 'gpt-4' : 'gpt-3.5';
};

export const createAnalysisChain = (prompt, data, apiKey) => {
  const modelType = selectModel(data);
  const openai = createOpenAIInstance(apiKey, modelType);
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
