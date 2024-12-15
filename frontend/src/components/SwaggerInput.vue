<template>
  <div class="space-y-6">
    <div class="mb-6">
      <label for="fileUpload" class="block text-lg font-medium text-gray-700 mb-2">
        Upload Swagger JSON File
      </label>
      <div class="relative">
        <input id="fileUpload" type="file" accept="application/json" @change="handleFileUpload" class="hidden"
          ref="fileInput" />
        <div class="flex items-center space-x-4">
          <button @click="$refs.fileInput.click()"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">
            <UploadIcon class="h-5 w-5 mr-2" />
            Choose File
          </button>
          <span class="text-sm text-gray-500">{{ selectedFileName || 'No file chosen' }}</span>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <label for="urlInput" class="block text-lg font-medium text-gray-700 mb-2">
        Or Paste Swagger JSON URL
      </label>
      <div class="flex">
        <input id="urlInput" v-model="swaggerUrl" type="url" placeholder="https://example.com/swagger.json"
          class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300" />
        <button @click="fetchSwagger" :disabled="isLoading"
          class="inline-flex items-center px-6 py-2 border border-transparent text-lg font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <UploadIcon v-if="!isLoading" class="h-5 w-5 mr-2" />
          <Loader v-else class="h-5 w-5 mr-2 animate-spin" />
          Fetch
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadIcon, Loader } from 'lucide-vue-next'

const emit = defineEmits(['swagger-loaded', 'error'])

const swaggerUrl = ref('')
const isLoading = ref(false)
const selectedFileName = ref('')
const fileInput = ref(null)

function resolveSwaggerRefs(schema, components) {
  if (!schema) return schema;

  // Handle objects
  if (typeof schema === 'object') {
    // If has $ref
    if (schema.$ref) {
      const refPath = schema.$ref.split('/');
      // Remove #/components prefix
      refPath.splice(0, 2);
      // Get actual schema from components
      let resolvedSchema = components;
      for (const path of refPath) {
        resolvedSchema = resolvedSchema[path];
      }
      // Recursively resolve referenced schema
      return resolveSwaggerRefs(resolvedSchema, components);
    }

    // Handle arrays
    if (Array.isArray(schema)) {
      return schema.map(item => resolveSwaggerRefs(item, components));
    }

    // Handle all properties of the object
    const resolved = {};
    for (const [key, value] of Object.entries(schema)) {
      resolved[key] = resolveSwaggerRefs(value, components);
    }
    return resolved;
  }

  return schema;
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const swaggerJson = JSON.parse(e.target.result)
        const resolvedSwagger = resolveSwaggerRefs(swaggerJson, swaggerJson.components)
        emit('swagger-loaded', resolvedSwagger)
      } catch (err) {
        console.error(err)
        emit('error', 'Error parsing JSON file. Please make sure it\'s a valid Swagger JSON.')
      }
    }
    reader.readAsText(file)
  }
}

const fetchSwagger = async () => {
  if (!swaggerUrl.value) {
    emit('error', 'Please enter a valid Swagger JSON URL.')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(swaggerUrl.value)
    const swaggerJson = await response.json()
    const resolvedSwagger = resolveSwaggerRefs(swaggerJson, swaggerJson.components)
    emit('swagger-loaded', resolvedSwagger)
  } catch (err) {
    console.error(err)
    emit('error', 'Error fetching or parsing Swagger JSON. Please check the URL and try again.')
  } finally {
    isLoading.value = false
  }
}
</script>
