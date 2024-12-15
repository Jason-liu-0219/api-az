import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import cors from "cors";
import { apiPrompts } from "./prompts/api.js";
import { methodAnalysisTemplate } from "./templates/method-analysis.js";
import { pathAnalysisTemplate } from "./templates/path-analysis.js";
import { parametersAnalysisTemplate } from "./templates/parameters-analysis.js";
import { responseAnalysisTemplate } from "./templates/response-analysis.js";
import { requestBodyAnalysisTemplate } from "./templates/request-body-analysis.js";
import { finalAnalysisTemplate } from "./templates/final-analysis.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://api-az-frontend.vercel.app'] 
    : ['http://localhost:5173'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-KEY'],
  credentials: true
}));
app.use(express.json());

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// OpenAI 配置
const createOpenAIInstance = (apiKey) =>
  new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-4-1106-preview", // 使用最新的 GPT-4 模型
    temperature: 0.7, // 適當的創造性
    maxTokens: 2000, // 足夠的輸出長度
  });

// Prompt 模板定義
const methodAnalysisPrompt = PromptTemplate.fromTemplate(methodAnalysisTemplate);
const pathAnalysisPrompt = PromptTemplate.fromTemplate(pathAnalysisTemplate);
const parametersAnalysisPrompt = PromptTemplate.fromTemplate(parametersAnalysisTemplate);
const responseAnalysisPrompt = PromptTemplate.fromTemplate(responseAnalysisTemplate);
const requestBodyAnalysisPrompt = PromptTemplate.fromTemplate(requestBodyAnalysisTemplate);
const finalAnalysisPrompt = PromptTemplate.fromTemplate(finalAnalysisTemplate);

// 創建分析鏈的輔助函數
const createAnalysisChain = (prompt, openai) => {
  return RunnableSequence.from([
    async (input) => {
      const {
        method,
        path,
        parameters,
        requestBody,
        responses,
        description = "無描述",
      } = input;

      return {
        method: method?.toUpperCase(),
        path,
        parameters,
        requestBody,
        responses,
        description,
        systemRole: apiPrompts.role,
        methodGuidelines: apiPrompts.methodGuidelines,
      };
    },
    prompt,
    openai,
  ]);
};

app.post("/analyze", async (req, res) => {
  try {
    const { apiKey, ...apiData } = req.body;
    console.log('Received request body:', { ...apiData, apiKey: '***' }); // 安全地記錄請求
    console.log('API Key:', apiKey);
    if (!apiKey) {
      return res.status(401).json({ error: "API key is required" });
    }

    try {
      // 使用請求中的 API key 創建實例
      const openai = createOpenAIInstance(apiKey);

      // 重新創建分析鏈
      const methodChain = createAnalysisChain(methodAnalysisPrompt, openai);
      const pathChain = createAnalysisChain(pathAnalysisPrompt, openai);
      const parametersChain = createAnalysisChain(parametersAnalysisPrompt, openai);
      const responseChain = createAnalysisChain(responseAnalysisPrompt, openai);
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisPrompt, openai);
      const finalAnalysisChain = RunnableSequence.from([
        finalAnalysisPrompt,
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
      res.json({
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
    console.error("Error analyzing API:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 添加格式化函數
const formatAnalysisResult = (result) => {
  if (!result) return null;

  // 移除多餘的空行
  return result
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("\n");
};

// 啟動服務器時初始化規範文檔
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
