<template>
  <div v-if="apis.length > 0" class="mt-8">
    <h2 class="text-3xl font-semibold mb-6 text-center text-gray-800">API Analysis Results</h2>
    <div class="space-y-4">
      <div v-for="api in apis" :key="api.path" class="api-card">
        <ApiCard :api="api" :api-key="apiKey" @analyze="handleAnalyze" />
      </div>
    </div>

    <AnalysisSidebar
      :show="!!selectedApi"
      :api="selectedApi"
      :loading="isAnalyzing"
      @close="selectedApi = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ApiCard from './ApiCard.vue'
import AnalysisSidebar from './AnalysisSidebar.vue'

defineProps({
  apis: {
    type: Array,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  isAnalyzing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['analyze'])
const selectedApi = ref(null)

const handleAnalyze = async (api) => {
  selectedApi.value = api
  try {
    const result = await emit('analyze', api)

    if (result && result[0] && result[0].success && result[0].analysis) {
      // Process each section of the analysis result
      const sections = result[0].analysis.sections
      for (const key in sections) {
        if (sections[key]) {
          // Convert string to structured data
          try {
            const content = sections[key]
            const lines = content.split('\n')
            let structured = {
              score: null,
              issues: [],
              suggestions: []
            }

            // Parse score
            const scoreMatch = content.match(/Score.*?(\d+)/)
            if (scoreMatch) {
              structured.score = parseInt(scoreMatch[1])
            }

            // Parse issues and suggestions
            let currentSection = ''
            lines.forEach(line => {
              line = line.trim()
              if (line.startsWith('2. Issues:')) {
                currentSection = 'issues'
              } else if (line.startsWith('3. Suggestions:')) {
                currentSection = 'suggestions'
              } else if (line && !line.startsWith('[') && !line.startsWith('#')) {
                if (currentSection === 'issues' && line !== 'None') {
                  structured.issues.push(line)
                } else if (currentSection === 'suggestions' && line !== 'None') {
                  structured.suggestions.push(line)
                }
              }
            })

            sections[key] = {
              raw: content,
              structured
            }
          } catch (e) {
            console.error(`Error parsing section ${key}:`, e)
            sections[key] = {
              raw: sections[key],
              structured: null
            }
          }
        }
      }

      selectedApi.value = {
        ...api,
        analysis: result[0].analysis
      }
    }
  } catch (error) {
    console.error('Analysis failed:', error)
  }
}
</script>

<style scoped>
.api-card {
  @apply transition-all duration-300 hover:transform hover:-translate-y-1;
}
</style>
