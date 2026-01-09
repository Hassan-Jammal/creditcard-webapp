<template>
    <div class="max-xl:w-full relative w-[28%] xl:sticky xl:top-20 p-4 xl:p-8 rounded-3xl border border-gray-300 shadow-lg">
        <div class="w-full flex flex-col gap-8 relative">
            <!-- connector line -->
            <div class="absolute top-1/2 -translate-y-1/2 left-[19px] w-[2px] h-[95%] rounded bg-gray-300"></div>
            
            <div 
                v-for="(step, index) in steps" 
                :key="step" 
                @click="onStepClick(index)" :class="[
                    'relative flex flex-col',
                    !canGoToStep(index) ? 'cursor-not-allowed' : 'cursor-pointer'
                ]"
            >
                <div class="flex items-center gap-4 cursor-pointer">
                <!-- circle -->
                    <div class="bg-white py-2">
                        <div :class="['w-[40px] h-[40px] flex items-center justify-center rounded-full shrink-0 text-2xl bg-white py-1 border-[2px] ', index === activeStep ? 'ring-4 ring-primary/20 border-primary' : 'border-gray-300']">
                            <!-- inner circle -->
                            <div :class="['dot rounded-full shrink-0 bg-gray-300 w-[10px] h-[10px]', index === activeStep ? 'bg-primary' : 'bg-gray-300']"></div>

                            <div v-if="canGoToStep(index) && index < activeStep" class="check hidden shrink-0 flex items-center justify-center">
                                <Icon name="material-symbols:check-rounded" class="text-3xl" />
                            </div>
                        </div>
                    </div>

                    <!-- text -->
                    <p :class="['flex font-AeonikBold text-xl', index === activeStep ? 'text-primary' : '']">
                        <span :class="['step inline-block min-w-[var(--step-width)] transition-transform duration-300 ease-in-out', index === activeStep ? 'translate-x-0 opacity-100 visible' : '-translate-x-full opacity-0 invisible']">{{ index + 1 }}.&nbsp;</span>
                        <span :class="['inline-block transition-transform duration-300 ease-in-out', index === activeStep ? 'translate-x-0 opacity-100 visible' : '-translate-x-[var(--step-width)]']">{{ step.label }}</span>
                    </p>
                </div>

                <div v-if="index === 0 && chosenCard" class="w-full flex items-center gap-2 bg-white py-2">
                    <NuxtImg :src="`/images/${chosenCard.image}.png`" class="w-8" alt="" width="309" height="195" />
                    <h2 class="font-AeonikMedium text-gray-500 text-[14px] underline underline-offset-2">{{ chosenCard.name }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        steps: {
            type: Array,
            required: true
        },
        activeStep: {
            type: Number,
            required: true
        },
        chosenCard: {
            type: [Object, null],
            required: true
        },
        canGoToStep: {
            type: Function,
            required: true
        }
    })

    const emit = defineEmits(['update:step'])

    const onStepClick = (index) => {
        if (!props.canGoToStep(index)) return
        emit('update:step', index)
    }
</script>