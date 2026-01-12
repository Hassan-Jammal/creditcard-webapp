<template>
	<div class="w-full space-y-8">
		<FileUpload label="Valid ID or Passport" name="id_or_passport"
			description="Documents format should be in JPEG or PDF" :maxFiles="3" :maxSizeMb="4"
			accept="pdf,doc,docx,jpg,jpeg,png" v-model="form.supporting_information_id_or_passport" />

		<FileUpload label="Proof of Residence" name="proof_of_residence"
			description="Documents format should be in JPEG or PDF" :maxFiles="2" :maxSizeMb="4"
			accept="pdf,jpg,jpeg,png" v-model="form.supporting_information_proof_of_residence" />

		<FileUpload label="Bank Statement" name="bank_statement" description="Documents format should be in JPEG or PDF"
			:maxFiles="2" :maxSizeMb="4" accept="pdf,jpg,jpeg,png"
			v-model="form.supporting_information_bank_statement" />

		<FileUpload label="Employment Letter" name="employment_letter"
			description="Documents format should be in JPEG or PDF" :maxFiles="2" :maxSizeMb="2"
			accept="pdf,jpg,jpeg,png" v-model="form.supporting_information_employment_letter" />

		<FileUpload label="Commercial Circular" name="commercial_circular"
			description="Documents format should be in JPEG or PDF" :maxFiles="2" :maxSizeMb="2"
			accept="pdf,jpg,jpeg,png" v-model="form.supporting_information_commercial_circular" />

		<FileUpload label="Employer Commercial Circular" name="employer_commercial_circular"
			description="Documents format should be in JPEG or PDF" :maxFiles="2" :maxSizeMb="2"
			accept="pdf,jpg,jpeg,png" v-model="form.supporting_information_employer_commercial_circular" />
	</div>
</template>

<script setup>
defineProps({
	form: {
		type: Object,
		required: true,
	},
})
</script>
