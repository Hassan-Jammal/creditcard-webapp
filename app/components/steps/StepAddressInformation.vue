<template>
    <div class="w-full">
        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">
                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="country" class="text-base">Country</label>
                        <select v-model="form.address_information_country" name="country" id="country" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <option value="" disabled>Select</option>
                            <option v-for="country in countriesData" :key="country.code" :value="country.name">{{ country.name }}</option>
                        </select>
                        <div v-if="touched.address_information_country && errors.address_information_country" class="text-xs text-red-500">{{ errors.address_information_country }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="city" class="text-base">City</label>
                        <input v-model="form.address_information_city" type="text" placeholder="City" id="city" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.address_information_city && errors.address_information_city" class="text-xs text-red-500">{{ errors.address_information_city }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="street" class="text-base">Street</label>
                        <input v-model="form.address_information_street" type="text" placeholder="Street" id="street" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.address_information_street && errors.address_information_street" class="text-xs text-red-500">{{ errors.address_information_street }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="building" class="text-base">Building</label>
                        <input v-model="form.address_information_building" type="text" placeholder="Building" id="building" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.address_information_building && errors.address_information_building" class="text-xs text-red-500">{{ errors.address_information_building }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="floor" class="text-base">Floor</label>
                        <input v-model="form.address_information_floor" type="text" placeholder="Floor" id="floor" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.address_information_floor && errors.address_information_floor" class="text-xs text-red-500">{{ errors.address_information_floor }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useCountry } from '~/composables/useCountry'

    /* =======================
    PROPS
    ======================= */
    const { form, errors, touched } = defineProps({
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
    })
    
    /* =======================
    COUNTRY LOGIC
    ======================= */
    const { selectedCountry, detectCountry, countriesData } = useCountry()

    onMounted(async () => {
        await detectCountry()
        form.address_information_country = selectedCountry.value.name
    })
</script>

<style scoped>
    .input {
        @apply w-full min-h-14 px-3 border border-[#D4D4D4] rounded-lg bg-white outline-none;
    }
    .error {
        @apply text-xs text-red-500;
    }
</style>
