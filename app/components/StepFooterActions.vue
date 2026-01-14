<template>
    <section class="fixed bottom-0 left-0 w-full bg-white mt-48 py-4 shadow-[0px_-3px_14px_0px_rgba(29,37,44,0.1)] z-50">
        <div class="container flex justify-end gap-4">
            <button v-if="activeStep !== 0" @click="$emit('prev')" class="font-AeonikMedium py-2 px-10 text-gray-500 bg-gray-100 rounded-full">Back</button>

            <button @click="$emit('next')" :disabled="!canContinue || isSubmitting" class="flex items-center gap-2 font-AeonikMedium py-2 px-14 text-white bg-primary rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed">
                <span>{{ isLastStep ? 'Apply' : 'Continue' }}</span>
                <Icon name="material-symbols:arrow-right-alt-rounded" class="text-3xl mt-[2px]" />
            </button>
        </div>
    </section>
</template>

<script setup>
defineProps({
    activeStep: {
        type: Number,
        required: true,
    },
    canContinue: {
        type: Boolean,
        required: true,
    },
    isLastStep: {
        type: Boolean,
        required: true,
    },
    isSubmitting: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['next', 'prev'])
</script>
