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
      // 中等複雜度分析使用標準 GPT-4
      const gpt4 = createOpenAIInstance(apiKey, 'gpt-4');
      // 最終分析使用 GPT-4 Turbo
      const gpt4turbo = createOpenAIInstance(apiKey, 'gpt-4-turbo');

      // 準備執行的分析任務
      const analysisPromises = [];
      const analysisResults = {};

      // 路徑和方法分析（必需）
      if (apiData.path && apiData.method) {
        const pathMethodChain = createAnalysisChain(pathMethodAnalysisTemplate, gpt35);
        analysisPromises.push(
          pathMethodChain.invoke({ data: apiData })
            .then(result => {
              analysisResults.pathMethodAnalysis = result;
            })
        );
      }

      // 參數分析（可選）
      if (Array.isArray(apiData.parameters) && apiData.parameters.length > 0) {
        const parametersChain = createAnalysisChain(parametersAnalysisTemplate, gpt35);
        analysisPromises.push(
          parametersChain.invoke({ data: apiData })
            .then(result => {
              analysisResults.parametersAnalysis = result;
            })
        );
      }

      // 請求體分析（可選）
      if (apiData.requestBody && Object.keys(apiData.requestBody).length > 0) {
        const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, gpt4);
        analysisPromises.push(
          requestBodyChain.invoke({ data: apiData })
            .then(result => {
              analysisResults.requestBodyAnalysis = result;
            })
        );
      }

      // 響應分析（可選）
      if (apiData.responses && Object.keys(apiData.responses).length > 0) {
        const responseChain = createAnalysisChain(responseAnalysisTemplate, gpt4);
        analysisPromises.push(
          responseChain.invoke({ data: apiData })
            .then(result => {
              analysisResults.responseAnalysis = result;
            })
        );
      }

      // 等待所有分析完成
      await Promise.all(analysisPromises);

      // 使用 GPT-4 Turbo 進行最終綜合分析
      const finalChain = createAnalysisChain(finalAnalysisTemplate, gpt4turbo);
      const finalResult = await finalChain.invoke({
        data: {
          ...apiData,
          analysisContent: `
          ${analysisResults.pathMethodAnalysis ? `Path and Method Analysis:${analysisResults.pathMethodAnalysis}` : ''}
          ${analysisResults.parametersAnalysis ? `Parameters Analysis:${analysisResults.parametersAnalysis}` : ''}
          ${analysisResults.requestBodyAnalysis ? `Request Body Analysis:${analysisResults.requestBodyAnalysis}` : ''}
          ${analysisResults.responseAnalysis ? `Response Analysis:${analysisResults.responseAnalysis}` : ''}`
        }
      });

      return res.status(200).json({
        success: true,
        analysis: {
          sections: {
            pathMethod: analysisResults.pathMethodAnalysis,
            parameters: analysisResults.parametersAnalysis,
            requestBody: analysisResults.requestBodyAnalysis,
            response: analysisResults.responseAnalysis,
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
