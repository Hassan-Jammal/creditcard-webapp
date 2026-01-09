<template>
    <div class="w-full space-y-8">
        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <h3 class="font-AeonikMedium border-b pb-4">
                Are you an existing customer?
            </h3>
            <div class="flex flex-col gap-1 w-full">
                <div class="flex items-center gap-6 text-gray-500">
                    <label class="custom-radio flex gap-4 mt-4">
                        <input type="radio" name="employment_status" value="Employed"
                            v-model="form.employment_information_employment_status" />
                        <span></span>
                        <p>Employed</p>
                    </label>

                    <label class="custom-radio flex gap-4 mt-4">
                        <input type="radio" name="employment_status" value="Self-employed"
                            v-model="form.employment_information_employment_status" />
                        <span></span>
                        <p>Self-employed</p>
                    </label>
                </div>
                <div v-if="touched.employment_information_employment_status && errors.employment_information_employment_status"
                    class="text-xs text-red-500">{{ errors.employment_information_employment_status }}</div>
            </div>
        </div>

        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">
                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="occupation" class="text-base">Occupation</label>
                        <input v-model="form.employment_information_occupation" type="text" placeholder="Occupation"
                            id="occupation"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_occupation && errors.employment_information_occupation"
                            class="text-xs text-red-500">{{ errors.employment_information_occupation }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="title" class="text-base">Title</label>
                        <input v-model="form.employment_information_job_title" type="text" placeholder="Job Title"
                            id="job_title"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_job_title && errors.employment_information_job_title"
                            class="text-xs text-red-500">{{ errors.employment_information_job_title }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="years_of_service" class="text-base">Years of Service</label>
                        <input v-model="form.employment_information_years_of_service" type="text"
                            placeholder="Years of Service" id="years_of_service"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_years_of_service && errors.employment_information_years_of_service"
                            class="text-xs text-red-500">{{ errors.employment_information_years_of_service }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="employer_name" class="text-base">Employer Name</label>
                        <input v-model="form.employment_information_employer_name" type="text"
                            placeholder="Employer Name" id="employer_name"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_employer_name && errors.employment_information_employer_name"
                            class="text-xs text-red-500">{{ errors.employment_information_employer_name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">
                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="country" class="text-base">Country</label>
                        <select v-model="form.employment_information_country" name="country" id="country"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <option value="" disabled>Select</option>
                            <option v-for="country in countriesData" :key="country.code" :value="country.name">{{
                                country.name }}</option>
                        </select>
                        <div v-if="touched.employment_information_country && errors.employment_information_country"
                            class="text-xs text-red-500">{{ errors.employment_information_country }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="city" class="text-base">City</label>
                        <input v-model="form.employment_information_city" type="text" placeholder="City" id="city"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_city && errors.employment_information_city"
                            class="text-xs text-red-500">{{ errors.employment_information_city }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="street" class="text-base">Street</label>
                        <input v-model="form.employment_information_street" type="text" placeholder="Street" id="street"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_street && errors.employment_information_street"
                            class="text-xs text-red-500">{{ errors.employment_information_street }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="building" class="text-base">Building</label>
                        <input v-model="form.employment_information_building" type="text" placeholder="Building"
                            id="building"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_building && errors.employment_information_building"
                            class="text-xs text-red-500">{{ errors.employment_information_building }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="floor" class="text-base">Floor</label>
                        <input v-model="form.employment_information_floor" type="text" placeholder="Floor" id="floor"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.employment_information_floor && errors.employment_information_floor"
                            class="text-xs text-red-500">{{ errors.employment_information_floor }}</div>
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
    form.employment_information_country = selectedCountry.value.name
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
