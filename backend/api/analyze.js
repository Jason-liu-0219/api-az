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
      // Create OpenAI instance with API key from request
      const openai = createOpenAIInstance(apiKey);

      // Recreate analysis chains
      const pathMethodChain = createAnalysisChain(pathMethodAnalysisTemplate, openai);
      const parametersChain = createAnalysisChain(parametersAnalysisTemplate, openai);
      const responseChain = createAnalysisChain(responseAnalysisTemplate, openai);
      const requestBodyChain = createAnalysisChain(requestBodyAnalysisTemplate, openai);
      const finalAnalysisChain = createAnalysisChain(finalAnalysisTemplate, openai);

      const {
        method,
        path,
        summary = "No summary",
        description = "No description",
        parameters,
        requestBody,
        responses,
      } = apiData;

      // Create analysis task object with prioritization
      const analysisPromises = {};
      
      // First priority: Path and Method analysis (most important)
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

      // Second priority: Parameters and Request Body (critical for API usage)
      const secondaryAnalyses = [];
      
      if (parameters?.length > 0) {
        secondaryAnalyses.push(
          parametersChain.invoke({
            data: { parameters, description }
          }).then(result => ['parameters', result])
        );
      }

      if (Object.keys(requestBody || {}).length > 0) {
        secondaryAnalyses.push(
          requestBodyChain.invoke({
            data: { requestBody, description }
          }).then(result => ['requestBody', result])
        );
      }

      // Third priority: Response analysis (can be done last)
      const tertiaryAnalyses = [];
      
      if (Object.keys(responses || {}).length > 0) {
        tertiaryAnalyses.push(
          responseChain.invoke({
            data: { responses, description }
          }).then(result => ['responses', result])
        );
      }

      // Execute analyses in priority order
      const pathMethodResult = method && path ? await analysisPromises.pathMethod : null;
      const secondaryResults = await Promise.all(secondaryAnalyses);
      const tertiaryResults = await Promise.all(tertiaryAnalyses);

      // Combine all results
      const analysisResults = [
        ...(pathMethodResult ? [['pathMethod', pathMethodResult]] : []),
        ...secondaryResults,
        ...tertiaryResults
      ];

      // Convert results to object
      const analysisObject = Object.fromEntries(analysisResults);

      // Final analysis with optimized content
      const finalAnalysis = await finalAnalysisChain.invoke({
        data: {
          analysisContent: Object.entries(analysisObject)
            .map(([key, value]) => `${key} Analysis:\n${value?.trim()}`)
            .filter(Boolean)
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
