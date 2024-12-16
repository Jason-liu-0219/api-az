import { createOpenAIInstance, createAnalysisChain } from './_utils/openai.js';
import { baseAnalysisTemplate } from './_templates/base-analysis.js';
import { dataAnalysisTemplate } from './_templates/data-analysis.js';
import { finalAnalysisTemplate } from './_templates/final-analysis.js';
import { allowCors } from './_middleware/cors.js';

const analyzeHandler = async (req, res) => {
  try {
    const { apiKey, ...apiData } = req.body;
    console.log('Received request body:', { ...apiData, apiKey: '***' });

    if (!apiKey) {
      return res.status(401).json({ error: "API key is required" });
    }

    try {
      // 初始化 OpenAI 實例
      const gpt4 = createOpenAIInstance(apiKey, 'gpt-4');
      const gpt4turbo = createOpenAIInstance(apiKey, 'gpt-4-turbo');

      const analysisResults = {};

      // 第一層：基礎分析（路徑、方法、參數）
      if (apiData.path && apiData.method) {
        const baseChain = createAnalysisChain(baseAnalysisTemplate, gpt4);
        analysisResults.baseAnalysis = await baseChain.invoke({
          path: apiData.path,
          method: apiData.method,
          parameters: JSON.stringify(apiData.parameters || [])
        });
      }

      // 第二層：數據分析（請求體、響應）
      if ((apiData.requestBody && Object.keys(apiData.requestBody).length > 0) ||
          (apiData.responses && Object.keys(apiData.responses).length > 0)) {
        const dataChain = createAnalysisChain(dataAnalysisTemplate, gpt4);
        analysisResults.dataAnalysis = await dataChain.invoke({
          requestBody: JSON.stringify(apiData.requestBody || {}),
          responses: JSON.stringify(apiData.responses || {})
        });
      }

      // 第三層：最終綜合分析
      const finalChain = createAnalysisChain(finalAnalysisTemplate, gpt4turbo);
      const finalResult = await finalChain.invoke({
        data: {
          ...apiData,
          baseAnalysis: analysisResults.baseAnalysis || {},
          dataAnalysis: analysisResults.dataAnalysis || {}
        }
      });

      return res.status(200).json({
        success: true,
        analysis: {
          sections: {
            base: analysisResults.baseAnalysis,
            data: analysisResults.dataAnalysis,
            final: finalResult
          }
        }
      });

    } catch (error) {
      console.error('Analysis error:', error);
      return res.status(500).json({ error: "Analysis failed", details: error.message });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: "Request failed", details: error.message });
  }
};

export default allowCors(analyzeHandler);
