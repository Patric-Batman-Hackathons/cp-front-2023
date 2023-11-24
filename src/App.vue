<template>
  <div class="main-container">
    <div class="content-container">
      <img v-if="lastUploadedImageURL" :src="lastUploadedImageURL" alt="Image" class="image" />
      <div class="buttons grid grid-cols-2 gap-4">
        <el-button type="success" class="button" @click="selectFile()">Upload Sample</el-button>
        <el-button type="primary" class="button" @click="galleryVisible = true"
          >Open Gallery</el-button
        >
      </div>
    </div>
    <!-- Poppers -->
    <GalleryModal
      v-model="galleryVisible"
      :uploadedImages="uploadedImages"
      @select="onSelectImage($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElLoading, ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type ImagesGet } from '@/intefaces'
import { loader } from '@/utils/animations'

const fileInput = ref<HTMLInputElement>(document.createElement('input'))
const uploadedImages = ref<ImagesGet>([])
const imageLoading = ref<any | undefined>(undefined)
const uploadCheckInterval = ref<number | undefined>(undefined)
const galleryVisible = ref(false)
const selectedImageURL = ref<string | undefined>(undefined)

const baseURL = import.meta.env.VITE_API_HOST
const axios: any = inject('axios')

const lastUploadedImageURL = computed(() => {
  if (selectedImageURL.value) {
    return selectedImageURL.value
  }

  const length = uploadedImages.value.length
  if (!length) {
    return undefined
  }

  return `${baseURL}back-bridge/image/get/${uploadedImages.value[length - 1].uid}`
})

const imagesLength = computed(() => uploadedImages.value.length)

function selectFile() {
  fileInput.value.click()
}

function startImagesCheck() {
  if (uploadCheckInterval.value) {
    clearInterval(uploadCheckInterval.value)
  }

  imageLoading.value = ElLoading.service({
    lock: true,
    text: 'Image processing',
    background: 'rgba(0, 0, 0, 0.7)',
    spinner: loader
  })
  uploadCheckInterval.value = setInterval(() => {
    getImages()
  }, 200)
}

function getImages() {
  axios.get(baseURL + 'back-bridge/image/get/').then((response: any) => {
    uploadedImages.value = response.data
  })
}

function uploadFile(file: File) {
  const bodyFormData = new FormData()
  bodyFormData.append('photo', file)
  bodyFormData.append('title', uuidv4())
  axios
    .post(baseURL + 'back-bridge/image/post/', bodyFormData)
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Image uploaded'
      })

      startImagesCheck()
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: 'Image was not uploaded'
      })
    })
}

function clearCheckUnterval() {
  if (imageLoading.value) {
    imageLoading.value.close()
  }

  if (selectedImageURL.value) {
    selectedImageURL.value = undefined
  }

  if (uploadCheckInterval.value) {
    clearInterval(uploadCheckInterval.value)
  }
}

function onSelectImage(event: any) {
  selectedImageURL.value = `${baseURL}back-bridge/image/get/${event.value}`
}

watch(imagesLength, () => {
  clearCheckUnterval()
})

onMounted(() => {
  fileInput.value.type = 'file'
  fileInput.value.accept = '.jpg, .jpeg, .png'

  fileInput.value.addEventListener('change', (event: any) => {
    const selectedFile: File | undefined = event.target.files[0]
    if (selectedFile) {
      uploadFile(selectedFile)
    } else {
      ElMessage({
        type: 'info',
        message: 'File was not selected'
      })
    }
  })

  getImages()
})

onBeforeUnmount(() => {
  clearCheckUnterval()
})
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.main-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-container {
  padding-top: 41px;
  width: 100%;
  max-width: 700px;
}

.image {
  width: calc(100% - 80px); /* ширина всего контейнера за вычетом отступа */
  margin: auto;
  display: block;
  border-radius: 10px;
}

.buttons {
  width: calc(100% - 80px);
  height: 40px;
  margin: auto;
  margin-top: 20px;
}

.button {
  height: 40px;
}

.el-button + .el-button {
  margin: 0;
}

.el-loading-mask {
  z-index: 9;
}
</style>
