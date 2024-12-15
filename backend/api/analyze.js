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

      if (parameters) {
        analysisPromises.parameters = parametersChain.invoke({
          data: {
            parameters,
            method,
            path,
            description,
            summary,
          },
        });
      }

      if (responses) {
        analysisPromises.responses = responseChain.invoke({
          data: {
            responses,
            method,
            path,
            description,
            summary,
          },
        });
      }

      if (requestBody) {
        analysisPromises.requestBody = requestBodyChain.invoke({
          data: {
            requestBody,
            method,
            path,
            description,
            summary,
          },
        });
      }

      // 等待所有分析完成並處理結果
      const results = await Promise.all(
        Object.entries(analysisPromises).map(async ([key, promise]) => {
          try {
            const result = await promise;
            console.log(`${key} analysis result:`, result);
            return { [key]: result };
          } catch (error) {
            console.error(`${key} analysis error:`, error);
            return { [key]: error.message };
          }
        })
      );

      // 合併所有分析結果
      const analysisResults = Object.assign({}, ...results);

      // 組合分析內容
      const analysisContent = Object.values(analysisResults)
        .filter(result => result !== null && result !== undefined)
        .join("\n\n");

      // 只有在有分析結果時才添加最終總結
      let finalAnalysis = null;
      if (Object.keys(analysisResults).length > 0) {
        try {
          finalAnalysis = await finalAnalysisChain.invoke({
            data: {
              analysisContent,
            }
          });
        } catch (error) {
          console.error("Final analysis error:", error);
          finalAnalysis = error.message;
        }
      }

      // 格式化並返回結果
      res.status(200).json({
        success: true,
        analysis: {
          sections: {
            pathMethod: formatAnalysisResult(analysisResults.pathMethod),
            parameters: formatAnalysisResult(analysisResults.parameters),
            responses: formatAnalysisResult(analysisResults.responses),
            requestBody: formatAnalysisResult(analysisResults.requestBody),
            final: formatAnalysisResult(finalAnalysis),
          },
        },
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

const formatAnalysisResult = (result) => {
  if (!result) return null;
  if (typeof result === "string") return result;
  return result.content || result;
};

export default allowCors(analyzeHandler);
