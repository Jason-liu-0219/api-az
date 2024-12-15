import { createOpenAIInstance, createAnalysisChain } from './_utils/openai.js';
import { pathMethodAnalysisTemplate } from './_templates/path-method-analysis.js';
import { parametersAnalysisTemplate } from './_templates/parameters-analysis.js';
import { responseAnalysisTemplate } from './_templates/response-analysis.js';
import { requestBodyAnalysisTemplate } from './_templates/request-body-analysis.js';
import { finalAnalysisTemplate } from './_templates/final-analysis.js';
import { allowCors } from './_middleware/cors.js';

const analyzeHandler = async (req, res) => {
  try {
    const { apiKey, ...apiData } = req.body;
    console.log('Received request body:', { ...apiData, apiKey: '***' });
    console.log('API Key:', apiKey);

    if (!apiKey) {
      return res.status(401).json({ error: "API key is required" });
    }

    try {
      // 基礎分析使用 GPT-3.5
      const gpt35 = createOpenAIInstance(apiKey, 'gpt-3.5');
      // 複雜分析使用 GPT-4
      const gpt4 = createOpenAIInstance(apiKey, 'gpt-4');

      // 使用 GPT-3.5 進行基礎分析
      const pathMethodChain = createAnalysisChain(pathMethodAnalysisTemplate, gpt35);
      const parametersChain = createAnalysisChain(parametersAnalysisTemplate, gpt35);

      // 使用 GPT-4 進行複雜分析
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, gpt4);
      const responseChain = createAnalysisChain(responseAnalysisTemplate, gpt4);

      // 並行執行所有分析任務
      const [
        pathMethodResult,
        parametersResult,
        requestBodyResult,
        responseResult
      ] = await Promise.all([
        pathMethodChain.invoke({ data: apiData }),
        parametersChain.invoke({ data: apiData }),
        requestBodyChain.invoke({ data: apiData }),
        responseChain.invoke({ data: apiData })
      ]);

      // 使用 GPT-4 進行最終綜合分析
      const finalChain = createAnalysisChain(finalAnalysisTemplate, gpt4);
      const finalResult = await finalChain.invoke({
        data: {
          ...apiData,
          analysisContent:{
            pathMethodAnalysis: pathMethodResult,
            parametersAnalysis: parametersResult,
            requestBodyAnalysis: requestBodyResult,
            responseAnalysis: responseResult
          }
        }
      });

      res.json({
        success: true,
        analysis: {
          sections: {
            pathMethod: pathMethodResult,
            parameters: parametersResult,
            requestBody: requestBodyResult,
            response: responseResult,
            final: finalResult
          }
        }
      });
    } catch (error) {
      console.error("Error analyzing API:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export default allowCors(analyzeHandler);
