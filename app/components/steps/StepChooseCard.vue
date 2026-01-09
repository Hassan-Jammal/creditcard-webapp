<template>
	<div class="w-full grid grid-cols-1 xl:grid-cols-3 items-start gap-6">
		<div v-for="card in cards" :key="card.id" @click="selectCard(card)"
			class="w-full relative p-4 xl:p-8 rounded-3xl border transition-all duration-300 ease-in-out cursor-pointer"
			:class="selectedCardId === card.id
				? 'bg-[#CDDAEF4D] shadow-xl -translate-y-1'
				: 'border-gray-300 shadow-lg'">
			<!-- RADIO -->
			<div class="radio-group text-right" @click.stop>
				<label class="custom-radio flex justify-end cursor-pointer">
					<input type="radio" name="credit-card cursor-pointer" :value="card.id" v-model="selectedCardId"
						@change="onCardChange(card)" />
					<span></span>
				</label>
			</div>

			<!-- CARD + VARIANTS -->
			<div class="flex items-center gap-4 mt-4">
				<div class="card w-4/5 shrink-0">
					<NuxtImg :src="`/images/${getCardImage(card)}.png`" class="w-full" :alt="card.name" width="309"
						height="195" />
				</div>

				<!-- VARIANTS -->
				<div v-if="card.hasVariants" class="card_variants w-1/5 flex flex-col gap-3">
					<label v-for="variant in card.variants" :key="variant.name" @click.stop :class="[
						'custom-variants relative flex items-center justify-center w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px] rounded-full cursor-pointer',
						variant.bg,
						isActiveVariant(card, variant)
							? 'ring-2 ring-primary ring-offset-2'
							: ''
					]">
						<input type="radio" name="variant" class="hidden" :value="variant.name"
							v-model="selectedVariantName" />
						<span class="absolute inset-0 rounded-full"></span>
					</label>
				</div>
			</div>

			<!-- CONTENT -->
			<div class="space-y-4 mt-10">
				<h2 class="font-AeonikMedium text-[22px]">
					{{ card.name }}
				</h2>

				<!-- DESCRIPTION -->
				<CollapsibleItem title="Description" :bg="true" v-model:open="openCollapsibles[card.id].description">
					{{ card.description }}
				</CollapsibleItem>

				<!-- ELIGIBILITY -->
				<CollapsibleItem title="Eligibility Criteria" :bg="true"
					v-model:open="openCollapsibles[card.id].eligibility">
					<ul class="list-disc pl-4">
						<li v-for="item in card.eligibility" :key="item">
							{{ item }}
						</li>
					</ul>
				</CollapsibleItem>

				<!-- KFS -->
				<ul class="flex flex-col text-gray-500">
					<li v-for="item in card.kfs" :key="item.label"
						class="flex justify-between py-1 border-b border-gray-300 last:border-0">
						<span>{{ item.label }}:</span>
						<span>{{ item.value }}</span>
					</li>
				</ul>

				<button
					class="w-full py-2 px-4 text-gray-500 hover:text-white bg-transparent hover:bg-primary border border-gray-500 rounded-full transition-all">
					Learn More
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
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
