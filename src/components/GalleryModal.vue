<template>
  <el-dialog v-model="value" title="Gallery" width="400px" align-center>
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="item in cpUploadedImages"
        :key="item.uid"
        class="image-container"
        :style="selectedImageUUID === item.uid ? selectionStyle : 'cursor: pointer; border-radius: 10px;'"
        @click="selectedImageUUID = item.uid"
      >
        <img
          :src="`${baseURL}back-bridge/image/get/${item.uid}`"
          alt="Image"
          style="border-radius: 10px;"
        />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog()">Cancel</el-button>
        <el-button type="primary" @click="chooseImage()" :disabled="selectedImageUUID ? false : true">Choose</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { ImagesGet } from '@/intefaces'
import { computed, ref } from 'vue'

const baseURL = import.meta.env.VITE_API_HOST

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  uploadedImages: {}
})
const emit = defineEmits(['update:modelValue', 'select'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const cpUploadedImages = computed(() => props.uploadedImages as ImagesGet)
const selectionStyle = computed(() => {
  return 'cursor: pointer; border-radius: 10px; border-style: solid; border-width: 5px; border-color: #409eff;'
})

const selectedImageUUID = ref<string | undefined>(undefined)

//// METHODS ////
function closeDialog() {
  value.value = false
}

function chooseImage() {
  emit('select', selectedImageUUID);
  closeDialog()
}
</script>

<style scoped>
.image-containter {
  overflow: hidden;
}

.image-containter img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
