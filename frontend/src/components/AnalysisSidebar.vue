<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-gray-500 bg-opacity-30" @click="$emit('close')"></div>

    <!-- Sidebar -->
    <div class="absolute inset-y-4 right-4 w-[600px] bg-white shadow-xl transform transition-transform duration-300 rounded-lg"
      :class="{ 'translate-x-0': show, 'translate-x-full': !show }">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 class="text-lg font-semibold text-gray-800">API 分析結果</h3>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="api" class="space-y-6">
            <!-- Method and Path -->
            <div class="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
              <div class="flex items-center space-x-2">
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="methodColor"
                >
                  {{ api.method }}
                </span>
                <span class="text-gray-700 font-mono break-all">{{ api.path }}</span>
              </div>
            </div>
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center items-center py-8">
              <svg class="h-8 w-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-3 text-gray-600">分析中...</span>
            </div>

            <!-- Analysis Content -->
            <div v-else-if="api?.analysis?.sections" class="space-y-4">
              <!-- Method Analysis -->
              <div v-if="api.analysis.sections.method" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">方法分析</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.method }}</div>
                </div>
              </div>

              <!-- Path Analysis -->
              <div v-if="api.analysis.sections.path" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">路徑分析</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.path }}</div>
                </div>
              </div>

              <!-- Parameters Analysis -->
              <div v-if="api.analysis.sections.parameters" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">參數分析</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.parameters }}</div>
                </div>
              </div>

              <!-- Response Analysis -->
              <div v-if="api.analysis.sections.responses" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">響應分析</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.responses }}</div>
                </div>
              </div>

              <!-- Request Body Analysis -->
              <div v-if="api.analysis.sections.requestBody" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">請求體分析</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.requestBody }}</div>
                </div>
              </div>

              <!-- Final Analysis -->
              <div v-if="api.analysis.sections.final" class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 class="text-lg font-medium text-gray-800">整體評估</h4>
                </div>
                <div class="p-4">
                  <div class="whitespace-pre-wrap text-gray-600">{{ api.analysis.sections.final }}</div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 text-gray-500">
              尚未進行分析
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  api: Object,
  loading: Boolean
})

const emit = defineEmits(['close'])

const methodColor = computed(() => {
  const colors = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  }
  return colors[props.api?.method] || 'bg-gray-100 text-gray-800'
})

// Handle ESC key
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.show) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>
.prose pre {
  margin: 0;
  padding: 0;
  background: transparent;
}
</style>
