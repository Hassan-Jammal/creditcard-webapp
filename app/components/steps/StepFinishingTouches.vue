<template>
	<div id="finishing-touches" class="w-full space-y-4">
		<div class="p-4 xl:p-8 rounded-3xl bg-[#F7F7F7]">
			<div class="flex flex-col gap-1 w-full">
				<label class="custom-radio flex gap-4 mt-4 text-gray-500">
					<input type="radio" name="is_agreed" value="Yes" v-model="form.finishing_touches_is_agreed" />
					<span></span>
					<p>
						By checking this box, I agree to the attached
						<a href="/BDLCDR-D3-PP.pdf" target="/_blank" class="text-primary">CDR</a>.
					</p>
				</label>
				<div v-if="touched.finishing_touches_is_agreed && errors.finishing_touches_is_agreed"
					class="text-xs text-red-500">{{ errors.finishing_touches_is_agreed }}</div>
			</div>
		</div>

		<div class="p-4 xl:p-8 rounded-3xl bg-[#F7F7F7]">
			<h3 class="text-2xl font-AeonikMedium">Add your Signature</h3>
			<p class="text-gray-500 pb-4">By singing this document with an electronic signature, I agree that such
				signature will be as valid as handwritten signatures to the extent allowed by local law.</p>

			<canvas ref="canvas" width="620" height="250" class="sig-canvas bg-white  w-2/3"
				:class="{ 'opacity-50 pointer-events-none': !canSign }" @mousedown="canSign && start($event)"
				@mousemove="canSign && move($event)" @mouseup="stop" @touchstart="canSign && start($event)"
				@touchmove="canSign && move($event)" @touchend="stop" />
			<div v-if="signatureError" class="text-xs text-red-500">{{ signatureError }}</div>

			<button type="button" class="mt-4 px-4 py-2 rounded bg-gray-200" @click="clear">Clear</button>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	form: Object,
	errors: Object,
	touched: Object,
	canSign: Boolean,
})

const canvas = ref(null)
const ctx = ref(null)
const drawing = ref(false)
const lastPos = ref({ x: 0, y: 0 })
const hasSignature = ref(false)
const signatureError = ref('')

/* ================= POS ================= */
const getPos = (e) => {
	const rect = canvas.value.getBoundingClientRect()

	if (e.touches?.length) {
		return {
			x: e.touches[0].clientX - rect.left,
			y: e.touches[0].clientY - rect.top,
		}
	}

	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
	}
}

/* ================= DRAW ================= */
const start = (e) => {
	signatureError.value = ''
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
	if (drawing.value) hasSignature.value = true
	drawing.value = false
}

/* ================= CANVAS ================= */
const resizeCanvas = () => {
	const rect = canvas.value.getBoundingClientRect()
	const dpr = window.devicePixelRatio || 1

	canvas.value.width = rect.width * dpr
	canvas.value.height = rect.height * dpr

	ctx.value = canvas.value.getContext('2d')
	ctx.value.setTransform(dpr, 0, 0, dpr, 0, 0)

	ctx.value.strokeStyle = '#222'
	ctx.value.lineWidth = 4
	ctx.value.lineCap = 'round'
}

let savedImage = null

const saveCanvas = () => {
	if (!canvas.value) return
	savedImage = canvas.value.toDataURL()
}

const restoreCanvas = () => {
	if (!savedImage) return

	const img = new Image()
	img.onload = () => {
		ctx.value.drawImage(img, 0, 0)
	}
	img.src = savedImage
}

const resizeCanvasPreserve = () => {
	saveCanvas()
	resizeCanvas()
	restoreCanvas()
}

window.addEventListener('orientationchange', resizeCanvasPreserve)

/* ================= API ================= */
const clear = () => {
	ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
	hasSignature.value = false
}

const getSignature = () => canvas.value.toDataURL('image/png')

const isEmpty = () => !hasSignature.value

defineExpose({
	getSignature,
	isEmpty,
	hasSignature,
	clearSignatureError: () => (signatureError.value = ''),
	setSignatureError: (msg) => (signatureError.value = msg),
})

/* ================= LIFECYCLE ================= */
onMounted(() => {
  resizeCanvas()
  window.addEventListener('orientationchange', resizeCanvasPreserve)
})

onBeforeUnmount(() => {
  window.removeEventListener('orientationchange', resizeCanvasPreserve)
})
</script>


<style lang="sass" scoped>
	.sig-canvas
		border: 2px dotted #ccc
		border-radius: 12px
		cursor: crosshair
		touch-action: none
		@apply w-full xl:w-[620px] h-[350px]

</style>
