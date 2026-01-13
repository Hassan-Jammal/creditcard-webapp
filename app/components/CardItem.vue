<template>
  <div @click="onSelect"
    class="w-full relative p-4 xl:p-8 rounded-3xl border transition-all duration-300 ease-in-out cursor-pointer z-10 relative"
    :class="selected ? 'bg-[#F0F4FA] shadow-xl -translate-y-1' : ' bg-white shadow-lg border-gray-300'">
    <!-- RADIO -->
    <div class="radio-group text-right" @click.stop>
      <label class="custom-radio flex justify-end cursor-pointer">
        <input type="radio" :value="card.id" v-model="selectedCardId" @change="onCardChange" />
        <span></span>
      </label>
    </div>

    <!-- CARD + VARIANTS -->
    <div class="flex items-center gap-4 mt-4">
      <div class="card w-4/5 shrink-0">
        <NuxtImg :src="`/images/${getCardImage(card)}.png`" class="w-full" :alt="card.name" width="309" height="195" />
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
          <input type="radio" name="variant" class="hidden" :value="variant.name" v-model="selectedVariantName" />
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
      <CollapsibleItem title="Eligibility Criteria" :bg="true" v-model:open="openCollapsibles[card.id].eligibility">
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

      <a :href="card.link" target="_blank" class="block">
        <button class="w-full py-2 px-4 text-gray-500 hover:text-white bg-transparent hover:bg-primary border border-gray-500 rounded-full transition-all">Learn More</button>
      </a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  card: Object,
  openCollapsibles: Object,
})

const emit = defineEmits(['select'])

const selectedCardId = defineModel('selectedCardId')
const selectedVariantName = defineModel('selectedVariantName')

const selected = computed(() => selectedCardId.value === props.card.id)

const onSelect = () => {
  emit('select', props.card)
}

const onCardChange = () => {
  if (props.card.hasVariants && !selectedVariantName.value) {
    selectedVariantName.value = props.card.variants[0].name
  }
}

import { computed } from 'vue'

const activeVariant = computed(() => {
  if (!props.card.hasVariants) return null

  return (
    props.card.variants.find(
      v => v.name === selectedVariantName.value
    ) || props.card.variants[0]
  )
})

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
