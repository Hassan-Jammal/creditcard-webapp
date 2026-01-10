<template>
	<div class="range_container">
		<div class="sliders_control">
			<!-- FROM tooltip -->
			<div class="slider-tooltip from-tooltip shadow-xl" ref="fromTooltip">{{ MIN.toLocaleString() }}</div>

			<!-- FROM slider (locked) -->
			<input ref="fromSlider" type="range" :min="MIN" :max="MAX" :step="STEPS" :value="MIN"
				class="from-slider-locked" tabindex="-1" />

			<!-- TO tooltip -->
			<div class="slider-tooltip to-tooltip shadow-xl" ref="toTooltip">{{ formattedToValue }}</div>

			<!-- TO slider -->
			<input ref="toSlider" type="range" :min="MIN" :max="MAX" :step="STEPS"
				:style="{ background: sliderBackground }" v-model.number="toValue" />

			<!-- SCALE -->
			<div class="scale">
				<div v-for="value in scaleMarkers" :key="value" :style="{ left: ((value - MIN) / (MAX - MIN)) * 100 + '%' }">
					{{ formatScale(value) }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

/* ================= PROPS ================= */
const props = defineProps({
	modelValue: {
		type: Object,
		required: true,
	},
	min: {
		type: Number,
		required: true,
	},
	max: {
		type: Number,
		required: true,
	},
	steps: {
		type: Number,
		required: true,
	},
	scaleStep: {
		type: Number,
		required: true,
	},
	initialTo: {
		type: Number,
		required: true,
	},
	currency: {
		type: String,
		default: 'USD',
	}
})

const emit = defineEmits(['update:modelValue'])

/* ================= CONSTANTS ================= */
const COLOR_TRACK = '#CBD5E1'
const COLOR_RANGE = 'var(--primary-color)'

/* ================= COMPUTED ================= */
const MIN = computed(() => props.min)
const MAX = computed(() => props.max)
const STEPS = computed(() => props.steps)

const sliderBackground = computed(() => {
	const range = MAX.value - MIN.value
	const percent = ((toValue.value - MIN.value) / range) * 100

	return `linear-gradient(
    to right,
    ${COLOR_RANGE} ${percent}%,
    ${COLOR_TRACK} ${percent}%
  )`
})

/* ================= STATE ================= */
const toValue = ref(0)

/* ================= REFS ================= */
const fromSlider = ref(null)
const toSlider = ref(null)
const fromTooltip = ref(null)
const toTooltip = ref(null)

/* ================= HELPERS ================= */
const setTooltip = (tooltip, value) => {
	if (!tooltip) return

	const percent =
		((value - MIN.value) / (MAX.value - MIN.value)) * 100

	tooltip.style.left = `${percent}%`
}

/* ================= RESET ON CARD CHANGE ================= */
watch(
	() => [props.min, props.max, props.initialTo],
	() => {
		const hasUserValue =
			props.modelValue &&
			props.modelValue.to >= props.min &&
			props.modelValue.to <= props.max

		const nextTo = hasUserValue
			? props.modelValue.to
			: props.initialTo ?? props.max

		toValue.value = nextTo

		emit('update:modelValue', {
			from: props.min,
			to: nextTo,
		})

		nextTick(() => {
			setTooltip(fromTooltip.value, props.min)
			setTooltip(toTooltip.value, toValue.value)
		})
	},
	{ immediate: true }
)

/* ================= SYNC FROM PARENT ================= */
watch(
	() => props.modelValue.to,
	(val) => {
		if (val !== toValue.value) {
			toValue.value = Number(val)

			nextTick(() => {
				setTooltip(toTooltip.value, val)
			})
		}
	}
)

/* ================= SYNC TO PARENT ================= */
watch(toValue, (value) => {
	emit('update:modelValue', {
		from: MIN.value,
		to: value,
	})

	nextTick(() => {
		setTooltip(toTooltip.value, value)
	})
})

/* ================= SCALE ================= */
const scaleMarkers = computed(() => {
	const markers = []
	for (let v = MIN.value; v <= MAX.value; v += props.scaleStep) {
		markers.push(v)
	}

	if (markers.at(-1) !== MAX.value) {
		markers.push(MAX.value)
	}

	return markers
})

/* ================= MOUNT ================= */
onMounted(() => {
	if (fromSlider.value) {
		fromSlider.value.value = MIN.value
		fromSlider.value.addEventListener('input', () => {
			fromSlider.value.value = MIN.value
		})
	}

	setTooltip(fromTooltip.value, MIN.value)
	setTooltip(toTooltip.value, toValue.value)
})

/* ================= FORMATTER ================= */
const formatScale = (value) => {
	return `${props.currency} ${value.toLocaleString()}`
}

const formattedToValue = computed(() =>
	toValue.value.toLocaleString()
)
</script>

<style lang="sass" scoped>
	.range_container
		--_marker-border-clr: var(--primary-color)
		--_marker-size: 20px
		--_track-heigt: 8px
		--_tooltip-bg-clr: rgba(255, 255, 255)
		--_tooltip-txt-clr: var(--primary-color)
		width: 100%
		display: flex
		flex-direction: column

	.sliders_control
		position: relative

	.slider-tooltip
		position: absolute
		top: -3rem
		left: 0
		width: fit-content
		padding: 0.1rem 1rem
		font-size: 0.8rem
		background-color: var(--_tooltip-bg-clr)
		color: #000
		border: 1px solid rgba(0, 0, 0, 0.08)
		border-radius: 8px
		text-align: center

	.from-tooltip,
	.to-tooltip
		transform: translateX(-50%)

	input[type=range]::-webkit-slider-thumb
		-webkit-appearance: none
		pointer-events: all
		width: var(--_marker-size)
		height: var(--_marker-size)
		background-color: var(--primary-color)
		border-radius: 50%
		box-shadow: 0 0 0 1px var(--primary-color)
		cursor: pointer

	input[type=range]::-moz-range-thumb
		-webkit-appearance: none
		pointer-events: all
		width: var(--_marker-size)
		height: var(--_marker-size)
		background-color: var(--primary-color)
		border-radius: 50%
		box-shadow: 0 0 0 1px var(--primary-color)
		cursor: pointer

	input[type=range]::-webkit-slider-thumb:hover
		background: #FFFFFF

	input[type=range]::-webkit-slider-thumb:active
		box-shadow: inset 0 0 3px var(--primary-color), 0 0 9px var(--primary-color)
		-webkit-box-shadow: inset 0 0 3px var(--primary-color), 0 0 9px var(--primary-color)

	input[type="range"]
		-webkit-appearance: none
		appearance: none
		height: var(--_track-heigt)
		width: 100%
		position: absolute
		background-color: var(--primary-color)
		pointer-events: none
		border-radius: 10px

	.scale
		display: flex
		justify-content: space-between
		margin-top: 2rem
		position: relative
		width: calc(100% - var(--_marker-size))
		margin-inline: auto
		font-size: 0.8rem

		div
			position: absolute
			translate: -50% 0
			white-space: nowrap

			&::before
				content: ''
				position: absolute
				top: 0
				left: 50%
				translate: -50% -125%
				width: 1px
				height: 10px
				background-color: #666

		@media (max-width: 768px)
			.scale
				justify-content: space-between

				div
					position: static
					translate: none
					left: auto !important

					&::before
						display: none

			/* Hide even markers except first & last */
			> div:nth-child(even):not(:first-child):not(:last-child)
				display: none

</style>