<template>
  <div class="mb-6 relative">
    <label for="apiKey" class="block text-lg font-medium text-gray-700 mb-2">
      AI API Key
    </label>
    <div class="relative">
      <input id="apiKey" :value="modelValue" :type="showPassword ? 'text' : 'password'"
        placeholder="Enter your AI API key"
        class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
        @input="$emit('update:modelValue', $event.target.value)" />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button @click="toggleVisibility" class="text-gray-400 hover:text-gray-600 focus:outline-none">
          <Eye v-if="showPassword" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])

const showPassword = ref(false)

const toggleVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>
