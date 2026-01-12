<template>
	<div class="w-full space-y-8">
		<!-- Eligibility info -->
		<div class="relative p-4 xl:p-8 rounded-3xl bg-[#F0F4FA]">
			<h3 class="font-AeonikMedium border-b pb-4">
				Before you apply, make sure you are eligible for this card.
			</h3>

			<CollapsibleItem v-for="item in collapsibleItems" :key="item.title" :title="item.title" :bg="item.bg">
				{{ item.content }}
			</CollapsibleItem>
		</div>

		<!-- Onboarded -->
		<div class="p-4 xl:p-8 rounded-3xl bg-[#F7F7F7]">
			<h3 class="font-AeonikMedium border-b pb-4">
				Are you an onboarded customer of MyMonty?
			</h3>

			<div class="flex flex-col gap-1 w-full">
				<div class="flex items-center gap-6 text-gray-500">
					<label class="custom-radio flex gap-4 mt-4">
						<input type="radio" name="is_onboarded" value="Yes"
							v-model="form.get_started_is_onboarded" />
						<span></span>
						<p>Yes</p>
					</label>

					<label class="custom-radio flex gap-4 mt-4">
						<input type="radio" name="is_onboarded" value="No"
							v-model="form.get_started_is_onboarded" />
						<span></span>
						<p>No</p>
					</label>
				</div>
				<div v-if="touched.get_started_is_onboarded && errors.get_started_is_onboarded"
					class="text-xs text-red-500">{{
						errors.get_started_is_onboarded }}</div>
			</div>
		</div>

		<!-- Acknowledgement -->
		<div class="p-4 xl:p-8 rounded-3xl bg-[#F7F7F7]">
			<h3 class="font-AeonikMedium border-b pb-4">
				Get to know your credit cards rates and fees.
			</h3>
			<div class="flex flex-col gap-1 w-full">
				<label class="custom-radio flex gap-4 mt-4 text-gray-500">
					<input type="radio" name="is_acknowledged" value="Yes" v-model="form.get_started_is_acknowledged" />
					<span></span>
					<p>
						By checking this box, I agree to the attached
						<a href="#" class="text-primary">Terms & Conditions</a>,
						<a href="#" class="text-primary">Key Fact Statement</a>,
						and
						<a href="#" class="text-primary">Privacy Policy</a>.
					</p>
				</label>
				<div v-if="touched.get_started_is_acknowledged && errors.get_started_is_acknowledged"
					class="text-xs text-red-500">{{ errors.get_started_is_acknowledged }}</div>
			</div>

		</div>

		<!-- Credit limit -->
		<div class="p-4 xl:p-8 pb-8 xl:pb-16 rounded-3xl bg-[#F7F7F7]">
			<h3 class="font-AeonikMedium">
				How much would you like to apply for?
			</h3>
			<p class="text-gray-500 border-b pb-4">
				Please choose your desired credit limit for {{ chosenCard.name }}.
			</p>

			<div class="mt-16">
				<RangeSlider v-if="chosenCard?.slider" :key="chosenCard.id" :card-id="chosenCard.id"
					:min="chosenCard.slider.min" :max="chosenCard.slider.max" :steps="chosenCard.slider.steps"
					:initialTo="chosenCard.slider.initialTo" :scaleStep="chosenCard.slider.scaleStep"
					:currency="chosenCard.currency" v-model="selectedRange" />

				<div v-if="errors.get_started_credit_card_limit" class="text-xs text-red-500">{{
					errors.get_started_credit_card_limit }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
/* =======================
PROPS
======================= */
defineProps({
	form: {
		type: Object,
		required: true,
	},
	chosenCard: {
		type: Object,
		required: false,
	},
	errors: {
		type: Object,
		required: true,
	},
	touched: {
		type: Object,
		required: true,
	},
	collapsibleItems: {
		type: Array,
		required: true,
	},
})

/* =======================
MODEL
======================= */
const selectedRange = defineModel('selectedRange')
</script>
