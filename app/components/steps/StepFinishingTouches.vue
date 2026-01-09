<template>
  <div class="w-full space-y-4">

    <div class="p-4 xl:p-8 rounded-3xl bg-[#F7F7F7]">
      <div class="flex flex-col gap-1 w-full">
        <label class="custom-radio flex gap-4 mt-4 text-gray-500">
          <input
            type="radio"
            name="is_agreed"
            value="Yes"
            v-model="form.finishing_touches_is_agreed"
          />
          <span></span>
          <p>
            By checking this box, I agree to the attached 
            <a href="#" class="text-primary">CDR</a>.
          </p>
        </label>
        <div v-if="touched.finishing_touches_is_agreed && errors.finishing_touches_is_agreed" class="text-xs text-red-500">{{ errors.finishing_touches_is_agreed }}</div>
      </div>
    </div>


    

        <h3 class="text-2xl font-AeonikMedium">
          E-Signature
        </h3>
        <p class="text-gray-500 pb-4">Please sign in the box below.</p>

        <canvas
          ref="canvas"
          width="620"
          height="160"
          class="sig-canvas"
          :class="{ 'opacity-50 pointer-events-none': !canSign }"
          @mousedown="canSign && start($event)"
          @mousemove="canSign && move($event)"
          @mouseup="stop"
          @touchstart="canSign && start($event)"
          @touchmove="canSign && move($event)"
          @touchend="stop"
        />
          <div v-if="signatureError" class="text-xs text-red-500">{{ signatureError }}</div>

    <!-- <p v-if="!form.finishing_touches_is_agreed" class="text-xs text-red-500">
      You must agree before signing.
    </p> -->

    <button
      type="button"
      class="px-4 py-2 rounded bg-gray-200"
      @click="clear"
    >
      Clear
    </button>
  </div>
</template>

<script setup>
  const props = defineProps({
    form: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      required: true,
    },
    touched: {
      type: Object,
      required: true,
    },
    canSign: {
      type: Boolean,
      required: true,
    },
  })

const canvas = ref(null)
const ctx = ref(null)
const drawing = ref(false)
const lastPos = ref({ x: 0, y: 0 })
const hasSignature = ref(false)

/* ========================
   Helpers
======================== */
const getPos = (e) => {
  // Mouse
  if (e.offsetX !== undefined) {
    return {
      x: e.offsetX,
      y: e.offsetY,
    }
  }

  // Touch
  const rect = canvas.value.getBoundingClientRect()
  const touch = e.touches[0]

  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  }
}

const isEmpty = () => {
  const blank = document.createElement('canvas')
  blank.width = canvas.value.width
  blank.height = canvas.value.height

  return canvas.value.toDataURL() === blank.toDataURL()
}

/* ========================
   Drawing logic
======================== */
const start = (e) => {
  if (signatureError.value) {
    signatureError.value = ''
  }

  drawing.value = true
  lastPos.value = getPos(e)
}

const move = (e) => {
  if (!drawing.value) return

  const pos = getPos(e)

  ctx.value.beginPath()
  ctx.value.moveTo(lastPos.value.x, lastPos.value.y)
  ctx.value.lineTo(pos.x, pos.y)
  ctx.value.stroke()

  lastPos.value = pos
}

const stop = () => {
  if (drawing.value) {
    hasSignature.value = true // 🔥 THIS IS THE MAGIC
  }
  drawing.value = false
}

/* ========================
   Public API
======================== */
const clear = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  hasSignature.value = false
}

const getSignature = () => {
  return canvas.value.toDataURL('image/png')
}

const signatureError = ref('')

const setSignatureError = (msg) => {
  signatureError.value = msg
}

const clearSignatureError = () => {
  signatureError.value = ''
}
/* 🔥 expose methods to parent */
defineExpose({
  getSignature,
  isEmpty,
  hasSignature,
  setSignatureError,
  clearSignatureError,
})

/* ========================
   Lifecycle
======================== */
onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  ctx.value.strokeStyle = '#222'
  ctx.value.lineWidth = 4
})

onBeforeUnmount(() => {
  canvas.value.removeEventListener('mousedown', start)
  canvas.value.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', stop)

  canvas.value.removeEventListener('touchstart', start)
  canvas.value.removeEventListener('touchmove', move)
  canvas.value.removeEventListener('touchend', stop)
})
</script>

<style scoped>
.sig-canvas {
  border: 2px dotted #ccc;
  border-radius: 12px;
  cursor: crosshair;
  touch-action: none;
}
</style>
