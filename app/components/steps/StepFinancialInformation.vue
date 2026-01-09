<template>
    <div class="w-full space-y-8">
        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">
                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="monthly_income" class="text-base">Primary employment monthly income</label>
                        <input v-model="form.financial_information_monthly_income" type="text"
                            placeholder="Monthly Income" id="monthly_income"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.financial_information_monthly_income && errors.financial_information_monthly_income"
                            class="text-xs text-red-500">{{ errors.financial_information_monthly_income }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="other_income" class="text-base">Other Income <span
                                class="text-[#9CA3AF]">(Optional)</span></label>
                        <input v-model="form.financial_information_other_income" type="text" placeholder="Other Income"
                            id="other_income"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.financial_information_other_income && errors.financial_information_other_income"
                            class="text-xs text-red-500">{{ errors.financial_information_other_income }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="monthly_expenses" class="text-base">Monthly expenses</label>
                        <input v-model="form.financial_information_monthly_expenses" type="text"
                            placeholder="Monthly expenses" id="monthly_expenses"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.financial_information_monthly_expenses && errors.financial_information_monthly_expenses"
                            class="text-xs text-red-500">{{ errors.financial_information_monthly_expenses }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative p-4 xl:p-8 bg-[#F7F7F7CC] rounded-3xl">
            <h3 class="font-AeonikMedium border-b pb-4">
                Existing Loans or Debt
            </h3>
            <div class="flex flex-col gap-1 w-full">
                <div class="flex items-center gap-6 text-gray-500">
                    <label class="custom-radio flex gap-4 mt-4">
                        <input type="radio" name="has_existing_loans_or_debt" value="Yes"
                            v-model="form.financial_information_has_existing_loans_or_debt" />
                        <span></span>
                        <p>Yes</p>
                    </label>

                    <label class="custom-radio flex gap-4 mt-4">
                        <input type="radio" name="has_existing_loans_or_debt" value="No"
                            v-model="form.financial_information_has_existing_loans_or_debt" />
                        <span></span>
                        <p>No</p>
                    </label>
                </div>
                <div v-if="touched.financial_information_has_existing_loans_or_debt && errors.financial_information_has_existing_loans_or_debt"
                    class="text-xs text-red-500">{{ errors.financial_information_has_existing_loans_or_debt }}</div>
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
</script>