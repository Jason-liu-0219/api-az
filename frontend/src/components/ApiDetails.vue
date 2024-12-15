<template>
  <div class="space-y-6">
    <!-- Summary Section -->
    <div class="animate-fade-in">
      <h3 class="font-semibold text-xl mb-2 text-gray-700">摘要</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-gray-600">{{ api.summary }}</p>
        <p v-if="api.deprecated" class="mt-2 text-red-600 font-semibold">
          ⚠️ 此 API 已棄用
        </p>
      </div>
    </div>

    <!-- Description Section -->
    <div class="animate-fade-in">
      <h3 class="font-semibold text-xl mb-2 text-gray-700">描述</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-gray-600 whitespace-pre-line">{{ api.description }}</p>
      </div>
    </div>

    <!-- Parameters Section -->
    <div class="animate-fade-in">
      <h3 class="font-semibold text-xl mb-2 text-gray-700">參數</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <ul class="space-y-3">
          <li v-for="param in api.parameters" :key="param.name"
            class="hover:bg-white p-3 rounded-md transition-colors duration-200">
            <div class="flex items-center flex-wrap gap-2">
              <span class="font-medium text-gray-800">{{ param.name }}</span>
              <span class="px-2 py-1 text-xs rounded-full"
                :class="param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'">
                {{ param.in }}
              </span>
              <span class="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {{ getSchemaType(param.schema) }}
              </span>
              <span v-if="param.required"
                class="text-xs font-semibold text-red-500 px-2 py-1 bg-red-50 rounded-full">必填</span>
            </div>
            <p class="mt-1 text-sm text-gray-600">{{ param.description || '無描述' }}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- Request Body Section -->
    <div class="animate-fade-in" v-if="api.requestBody">
      <h3 class="font-semibold text-xl mb-2 text-gray-700">請求內容</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div v-for="(content, contentType) in api.requestBody.content" :key="contentType" class="mb-6 last:mb-0">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-medium text-gray-800">{{ contentType }}</span>
            <span v-if="api.requestBody.required"
              class="text-xs font-semibold text-red-500 px-2 py-1 bg-red-50 rounded-full">必填</span>
          </div>

          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <pre class="text-sm bg-white p-4 overflow-x-auto">{{ formatJson(content.schema) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Responses Section -->
    <div class="animate-fade-in">
      <h3 class="font-semibold text-xl mb-2 text-gray-700">響應</h3>
      <div class="space-y-4">
        <div v-for="(response, code) in api.responses" :key="code"
          class="bg-gray-50 rounded-lg p-4 hover:bg-white transition-colors duration-200">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg font-medium" :class="getStatusCodeColor(code)">
              {{ code }}
            </span>
            <span class="text-sm text-gray-600">{{ response.description || '無描述' }}</span>
          </div>
          <div v-if="response.content" class="mt-4 space-y-4">
            <div v-for="(content, type) in response.content" :key="type">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium text-gray-700">{{ type }}</span>
              </div>
              <pre class="text-sm bg-white p-4 rounded-md overflow-x-auto">{{ formatJson(content.schema) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  api: {
    type: Object,
    required: true
  }
})

function getSchemaType(schema) {
  if (!schema) return 'unknown'
  if (schema.type === 'array') {
    const itemType = schema.items ? getSchemaType(schema.items) : 'unknown'
    return `array<${itemType}>`
  }
  return schema.type || 'object'
}

function formatJson(obj) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (e) {
    console.error(e)
    return '{}'
  }
}

function getStatusCodeColor(code) {
  if (code.startsWith('2')) return 'text-green-600'
  if (code.startsWith('3')) return 'text-blue-600'
  if (code.startsWith('4')) return 'text-yellow-600'
  if (code.startsWith('5')) return 'text-red-600'
  return 'text-gray-600'
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
