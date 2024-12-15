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
      // 為每個分析任務創建獨立的鏈，讓系統根據數據複雜度動態選擇模型
      const pathMethodChain = createAnalysisChain(pathMethodAnalysisTemplate, apiData, apiKey);
      const parametersChain = createAnalysisChain(parametersAnalysisTemplate, apiData, apiKey);
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, apiData, apiKey);
      const responseChain = createAnalysisChain(responseAnalysisTemplate, apiData, apiKey);

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

      // 最終分析總是使用 GPT-4，因為需要綜合所有結果
      const finalChain = createAnalysisChain(
        finalAnalysisTemplate, 
        apiData,
        apiKey,
        'gpt-4' // 強制使用 GPT-4 進行最終分析
      );

      const finalResult = await finalChain.invoke({
        data: {
          ...apiData,
          pathMethodAnalysis: pathMethodResult,
          parametersAnalysis: parametersResult,
          requestBodyAnalysis: requestBodyResult,
          responseAnalysis: responseResult
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
