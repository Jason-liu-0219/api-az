<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <AppHeader />

    <main class="flex-grow overflow-auto p-6">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <ApiKeyInput v-model="apiKey" />

        <SwaggerInput @swagger-loaded="handleSwaggerLoaded" @error="handleError" />

        <transition name="fade">
          <div v-if="error" class="mt-4 text-red-500 bg-red-100 p-4 rounded-md animate-pulse">
            {{ error }}
          </div>
        </transition>

        <ApiResults 
          :apis="apiResults" 
          :api-key="apiKey" 
          :is-analyzing="isAnalyzing"
          @analyze="analyzeAPI" 
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ApiKeyInput from './components/ApiKeyInput.vue'
import SwaggerInput from './components/SwaggerInput.vue'
import ApiResults from './components/ApiResults.vue'
import { analyzeEndpoint } from './services/api'

const apiKey = ref('')
const apiResults = ref([])
const error = ref('')
const isAnalyzing = ref(false)

const handleSwaggerLoaded = (swagger) => {
  apiResults.value = []
  error.value = ''

  for (const [path, methods] of Object.entries(swagger.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      apiResults.value.push({
        path,
        method: method.toUpperCase(),
        summary: details.summary || 'No summary provided',
        description: details.description || 'No description provided',
        parameters: details.parameters || [],
        requestBody: details.requestBody || null,
        responses: details.responses || {},
        isOpen: false,
        analysis: ''
      })
    }
  }
}

const handleError = (message) => {
  error.value = message
}

const analyzeAPI = async (api) => {
  if (!apiKey.value) {
    error.value = 'Please enter an AI API key to analyze the API.'
    return
  }

  isAnalyzing.value = true
  api.analysis = null

  try {
    const result = await analyzeEndpoint({
      method: api.method,
      path: api.path,
      summary: api.summary,
      description: api.description,
      parameters: api.parameters,
      requestBody: api.requestBody,
      responses: api.responses
    }, apiKey.value)

    if (result.success) {
      api.analysis = result.analysis
      return result
    } else {
      throw new Error(result.error || 'Analysis failed')
    }
  } catch (err) {
    error.value = err.message || 'Failed to analyze API'
    api.analysis = null
    throw err
  } finally {
    isAnalyzing.value = false
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
