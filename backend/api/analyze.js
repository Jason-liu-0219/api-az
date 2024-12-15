import { createOpenAIInstance, createAnalysisChain } from './_utils/openai.js';
import { methodAnalysisTemplate } from './_templates/method-analysis.js';
import { pathAnalysisTemplate } from './_templates/path-analysis.js';
import { parametersAnalysisTemplate } from './_templates/parameters-analysis.js';
import { responseAnalysisTemplate } from './_templates/response-analysis.js';
import { requestBodyAnalysisTemplate } from './_templates/request-body-analysis.js';
import { finalAnalysisTemplate } from './_templates/final-analysis.js';
import { RunnableSequence } from "@langchain/core/runnables";
import { allowCors } from './_middleware/cors.js';

const analyzeHandler = async (req, res) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://api-az-frontend.vercel.app',
    'http://localhost:5173'
  ];

  // 處理 OPTIONS 請求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      const methodChain = createAnalysisChain(methodAnalysisTemplate, openai);
      const pathChain = createAnalysisChain(pathAnalysisTemplate, openai);
      const parametersChain = createAnalysisChain(parametersAnalysisTemplate, openai);
      const responseChain = createAnalysisChain(responseAnalysisTemplate, openai);
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, openai);
      const finalAnalysisChain = RunnableSequence.from([
        finalAnalysisTemplate,
        openai,
      ]);

      const {
        method,
        path,
        summary = "無摘要",
        description = "無描述",
        parameters,
        requestBody,
        responses,
      } = apiData;

      // 創建分析任務數組，只包含存在的字段
      const analysisPromises = [];
      const analysisResults = {};

      if (method) {
        analysisPromises.push(
          methodChain
            .invoke({
              query: method,
              data: {
                method,
                path,
                description,
                summary,
              },
            })
            .then((result) => {
              console.log("Method analysis result:", result);
              analysisResults.methodAnalysis = result;
            })
            .catch((error) => {
              analysisResults.methodAnalysis = error.message;
              console.error("Method analysis error:", error);
            })
        );
      }

      if (path) {
        analysisPromises.push(
          pathChain
            .invoke({
              query: path,
              data: {
                path,
                method,
                description,
                summary,
              },
            })
            .then((result) => {
              console.log("Path analysis result:", result);
              analysisResults.pathAnalysis = result;
            })
            .catch((error) => {
              analysisResults.pathAnalysis = error.message;
              console.error("Path analysis error:", error);
            })
        );
      }

      if (parameters) {
        analysisPromises.push(
          parametersChain
            .invoke({
              query: parameters,
              data: {
                parameters: JSON.stringify(parameters),
                description,
                summary,
              },
            })
            .then((result) => {
              console.log("Parameters analysis result:", result);
              analysisResults.parametersAnalysis = result;
            })
            .catch((error) => {
              analysisResults.parametersAnalysis = error.message;
              console.error("Parameters analysis error:", error);
            })
        );
      }

      if (responses) {
        analysisPromises.push(
          responseChain
            .invoke({
              query: responses,
              data: {
                responses: JSON.stringify(responses),
                description,
                summary,
              },
            })
            .then((result) => {
              console.log("Responses analysis result:", result);
              analysisResults.responsesAnalysis = result;
            })
            .catch((error) => {
              analysisResults.responsesAnalysis = error.message;
              console.error("Responses analysis error:", error);
            })
        );
      }

      if (requestBody) {
        analysisPromises.push(
          requestBodyChain
            .invoke({
              query: requestBody,
              data: {
                requestBody: JSON.stringify(requestBody),
                description,
                summary,
              },
            })
            .then((result) => {
              console.log("Request body analysis result:", result);
              analysisResults.requestBodyAnalysis = result;
            })
            .catch((error) => {
              analysisResults.requestBodyAnalysis = error.message;
              console.error("Request body analysis error:", error);
            })
        );
      }

      // 等待所有分析完成
      await Promise.all(analysisPromises);

      // 組合分析內容
      let analysisContent = [];
      if (analysisResults.methodAnalysis) {
        analysisContent.push(analysisResults.methodAnalysis);
      }
      if (analysisResults.pathAnalysis) {
        analysisContent.push(analysisResults.pathAnalysis);
      }
      if (analysisResults.parametersAnalysis) {
        analysisContent.push(analysisResults.parametersAnalysis);
      }
      if (analysisResults.responsesAnalysis) {
        analysisContent.push(analysisResults.responsesAnalysis);
      }
      if (analysisResults.requestBodyAnalysis) {
        analysisContent.push(analysisResults.requestBodyAnalysis);
      }

      // 只有在有分析結果時才添加最終總結
      let finalAnalysis = null;
      if (Object.keys(analysisResults).length > 0) {
        finalAnalysis = await finalAnalysisChain.invoke({
          description,
          summary,
          analysisContent: analysisContent.join("\n\n"),
        });
      }

      // 格式化並返回結果
      res.status(200).json({
        success: true,
        analysis: {
          sections: {
            method: formatAnalysisResult(analysisResults.methodAnalysis),
            path: formatAnalysisResult(analysisResults.pathAnalysis),
            parameters: formatAnalysisResult(analysisResults.parametersAnalysis),
            responses: formatAnalysisResult(analysisResults.responsesAnalysis),
            requestBody: formatAnalysisResult(
              analysisResults.requestBodyAnalysis
            ),
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
