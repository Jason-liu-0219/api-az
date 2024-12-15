<template>
  <div
    class="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
    <div
      class="flex justify-between items-center p-4 bg-gray-50 cursor-pointer transition-colors duration-300 hover:bg-gray-100"
      @click="toggleOpen">
      <div class="flex items-center min-w-0">
        <div class="flex-1 min-w-0">
          <span class="font-bold text-lg text-gray-800 truncate block">{{ api.path }}</span>
        </div>
        <span :class="methodColor" class="ml-2 px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0">
          {{ api.method }}
        </span>
      </div>
      <div class="flex items-center">
        <button 
          @click.stop="$emit('analyze', api)"
          :disabled="!apiKey"
          :class="[
            'mr-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300',
            apiKey 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          ]"
          :title="!apiKey ? '請先輸入 API Key' : '分析此 API'"
        >
          分析
        </button>
        <ChevronDownIcon v-if="!isOpen" class="h-6 w-6 text-gray-600 transition-transform duration-300" />
        <ChevronUpIcon v-else class="h-6 w-6 text-gray-600 transition-transform duration-300" />
      </div>
    </div>

    <div v-if="isOpen" class="p-6">
      <ApiDetails :api="api" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import ApiDetails from './ApiDetails.vue'

const props = defineProps({
  api: {
    type: Object,
    required: true
  },
  apiKey: {
    type: String,
    required: true
  }
})

defineEmits(['analyze'])

const isOpen = ref(false)

const methodColor = computed(() => {
  const colors = {
    GET: 'bg-blue-200 text-blue-800',
    POST: 'bg-green-200 text-green-800',
    PUT: 'bg-yellow-200 text-yellow-800',
    DELETE: 'bg-red-200 text-red-800',
    PATCH: 'bg-purple-200 text-purple-800'
  }
  return colors[props.api?.method] || 'bg-gray-200 text-gray-800'
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped></style>
