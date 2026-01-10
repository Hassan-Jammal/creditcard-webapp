<template>
  <!-- DESKTOP GRID -->
  <div
    v-if="!isMobile"
    class="w-full grid grid-cols-1 xl:grid-cols-3 items-start gap-6"
  >
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      v-model:selectedCardId="selectedCardId"
      v-model:selectedVariantName="selectedVariantName"
      :open-collapsibles="openCollapsibles"
      @select="selectCard"
    />
  </div>

  <!-- MOBILE SWIPER -->
  <ClientOnly>
    <Swiper
      v-if="isMobile"
	   auto-height
      :slides-per-view="1.2"
      :space-between="16"
      class="w-full z-10 relative"
    >
      <SwiperSlide v-for="card in cards" :key="card.id">
        <CardItem
          :card="card"
          v-model:selectedCardId="selectedCardId"
          v-model:selectedVariantName="selectedVariantName"
          :open-collapsibles="openCollapsibles"
          @select="selectCard"
        />
      </SwiperSlide>
    </Swiper>
  </ClientOnly>
</template>


<script setup>
	import { useMediaQuery } from '@vueuse/core'
	import { Swiper, SwiperSlide } from 'swiper/vue'
	import 'swiper/css'

	const isMobile = useMediaQuery('(max-width: 1279px)')

/* =======================
PROPS & MODELS
======================= */
const props = defineProps({
	cards: {
		type: Array,
		required: true,
	},
})

const selectedCardId = defineModel('selectedCardId')
const selectedVariantName = defineModel('selectedVariantName')

/* =======================
COLLAPSIBLE STATE
======================= */
const openCollapsibles = ref({})

watch(
	() => props.cards,
	(cards) => {
		cards.forEach(card => {
			if (!openCollapsibles.value[card.id]) {
				openCollapsibles.value[card.id] = {
					description: false,
					eligibility: false,
				}
			}
		})
	},
	{ immediate: true }
)

/* =======================
LOCAL COMPUTED STATE
======================= */
const activeCard = computed(() =>
	props.cards.find(card => card.id === selectedCardId.value)
)

const activeVariant = computed(() => {
	if (!activeCard.value?.hasVariants) return null

	return (
		activeCard.value.variants.find(
			v => v.name === selectedVariantName.value
		) || activeCard.value.variants[0]
	)
})

/* =======================
HELPERS
======================= */
const onCardChange = (card) => {

	if (card.hasVariants && !selectedVariantName.value) {
		selectedVariantName.value = card.variants[0].name
	}
}

const selectCard = (card) => {
	const previousCardId = selectedCardId.value

	// ✅ 1. Select immediately (no delay)
	selectedCardId.value = card.id
	onCardChange(card)

	// ✅ 2. Close previous card collapsibles AFTER selection
	if (previousCardId && previousCardId !== card.id) {
		openCollapsibles.value[previousCardId].description = false
		openCollapsibles.value[previousCardId].eligibility = false
	}
}

const getCardImage = (card) => {
	if (card.id !== selectedCardId.value) {
		return card.hasVariants
			? card.variants[0].image
			: card.image
	}

	return card.hasVariants
		? activeVariant.value?.image
		: card.image
}

const isActiveVariant = (card, variant) => {
	return (
		card.id === selectedCardId.value &&
		selectedVariantName.value === variant.name
	)
}
</script>

<style>
	.swiper,
.swiper-wrapper,
.swiper-slide {
  overflow: visible !important;
}
</style>