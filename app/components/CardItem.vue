<template>
	<div class="w-full relative p-4 xl:p-8 rounded-3xl border transition-all duration-300 ease-in-out cursor-pointer"
		:class="isSelected
			? 'bg-[#CDDAEF4D] shadow-xl -translate-y-1'
			: 'border-gray-300 shadow-lg'" @click="emit('select', card)">
		<!-- RADIO -->
		<div class="radio-group text-right" @click.stop>
			<label class="custom-radio flex justify-end cursor-pointer">
				<input type="radio" name="credit-card" :value="card.id" v-model="selectedCardId"
					@change="emit('variant', card)" />
				<span></span>
			</label>
		</div>

		<!-- CARD + VARIANTS -->
		<div class="flex items-center gap-4 mt-4">
			<div class="card w-4/5 shrink-0">
				<NuxtImg :src="`/images/${cardImage}.png`" class="w-full" :alt="card.name" width="309" height="195" />
			</div>

			<!-- VARIANTS -->
			<div v-if="card.hasVariants" class="w-1/5 flex flex-col gap-3" @click.stop>
				<label v-for="variant in card.variants" :key="variant.name"
					class="relative flex items-center justify-center w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px] rounded-full cursor-pointer"
					:class="[
						variant.bg,
						isActiveVariant(variant)
							? 'ring-2 ring-primary ring-offset-2'
							: ''
					]">
					<input type="radio" class="hidden" name="variant" :value="variant.name"
						v-model="selectedVariantName" />
				</label>
			</div>
		</div>

		<!-- CONTENT -->
		<div class="space-y-4 mt-10">
			<h2 class="font-AeonikMedium text-[22px]">
				{{ card.name }}
			</h2>

			<CollapsibleItem title="Description" :bg="true" v-model:open="openCollapsibles[card.id].description">
				{{ card.description }}
			</CollapsibleItem>

			<CollapsibleItem title="Eligibility Criteria" :bg="true"
				v-model:open="openCollapsibles[card.id].eligibility">
				<ul class="list-disc pl-4">
					<li v-for="item in card.eligibility" :key="item">
						{{ item }}
					</li>
				</ul>
			</CollapsibleItem>

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
</template>

<script setup>
import { computed } from 'vue'

/* ================= PROPS ================= */
const props = defineProps({
	card: Object,
	selectedCardId: String,
	selectedVariantName: String,
	openCollapsibles: Object,
})

/* ================= MODELS ================= */
const selectedCardId = defineModel('selectedCardId')
const selectedVariantName = defineModel('selectedVariantName')

/* ================= EMITS ================= */
const emit = defineEmits(['select', 'variant'])

/* ================= COMPUTED ================= */
const isSelected = computed(() => selectedCardId.value === props.card.id)

const activeVariant = computed(() => {
	if (!props.card.hasVariants) return null

	return (
		props.card.variants.find(
			v => v.name === selectedVariantName.value
		) || props.card.variants[0]
	)
})

const cardImage = computed(() => {
	if (!isSelected.value) {
		return props.card.hasVariants
			? props.card.variants[0].image
			: props.card.image
	}

	return props.card.hasVariants
		? activeVariant.value?.image
		: props.card.image
})

const isActiveVariant = (variant) =>
	isSelected.value && selectedVariantName.value === variant.name
</script>
