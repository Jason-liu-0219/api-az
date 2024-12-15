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
      // 使用請求中的 API key 創建實例
      const openai = createOpenAIInstance(apiKey);

      // 重新創建分析鏈
      const pathMethodChain = createAnalysisChain(pathMethodAnalysisTemplate, openai);
      const parametersChain = createAnalysisChain(parametersAnalysisTemplate, openai);
      const responseChain = createAnalysisChain(responseAnalysisTemplate, openai);
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, openai);
      const finalAnalysisChain = createAnalysisChain(finalAnalysisTemplate, openai);

      const {
        method,
        path,
        summary = "無摘要",
        description = "無描述",
        parameters,
        requestBody,
        responses,
      } = apiData;

      // 創建分析任務對象
      const analysisPromises = {};

      if (method && path) {
        analysisPromises.pathMethod = pathMethodChain.invoke({
          data: {
            path,
            method,
            description,
            summary,
          },
        });
      }

      if (parameters && Array.isArray(parameters) && parameters.length > 0) {
        analysisPromises.parameters = parametersChain.invoke({
          data: {
            parameters,
            description,
          },
        });
      }

      if (requestBody && Object.keys(requestBody).length > 0) {
        analysisPromises.requestBody = requestBodyChain.invoke({
          data: {
            requestBody,
            description,
          },
        });
      }

      if (responses && Object.keys(responses).length > 0) {
        analysisPromises.responses = responseChain.invoke({
          data: {
            responses,
            description,
          },
        });
      }

      // 並行執行所有分析
      const analysisResults = await Promise.all(Object.entries(analysisPromises).map(async ([key, promise]) => {
        try {
          const result = await promise;
          return [key, result];
        } catch (error) {
          console.error(`Error in ${key} analysis:`, error);
          return [key, `分析時發生錯誤: ${error.message}`];
        }
      }));

      // 將結果轉換為物件
      const analysisObject = Object.fromEntries(analysisResults);

      // 最終分析
      const finalAnalysis = await finalAnalysisChain.invoke({
        data: {
          analysisContent: Object.entries(analysisObject)
            .map(([key, value]) => `${key}分析結果：\n${value}`)
            .join('\n\n')
        }
      });

      res.json({
        success: true,
        analysis: {
          sections: {
            ...analysisObject,
            final: finalAnalysis
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
