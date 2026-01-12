<template>
	<section>
		<div class="container">
			<p class="text-grey text-2xl">Step {{ activeStep + 1 }} of {{ steps.length }}</p>
			<p class="font-AeonikBlack text-5xl uppercase mt-4">{{ currentStep.title }}</p>
			<p class="mt-4">{{ currentStep.description }}</p>
		</div>
	</section>

	<section class="mt-20">
		<div class="container">
			<div class="flex max-xl:flex-col items-start gap-12">
				<ClientOnly>
					<Sidebar 
						v-if="!isMobile" 
						:can-go-to-step="canGoToStep" 
						:steps="steps" 
						:active-step="activeStep" 
						@update:step="setStep"
						:chosenCard="chosenCard" 
					/>

					<Sidebar
						v-else
						:can-go-to-step="canGoToStep"
						:steps="steps"
						:active-step="activeStep"
						:chosenCard="chosenCard"
						:is-mobile="isMobile"
						@update:step="setStep"
					>
						<!-- STEP 0 — Choose Card -->
						<template #step-0>
							<StepsStepChooseCard
								:cards="cards"
								v-model:selectedCardId="selectedCardId"
								v-model:selectedVariantName="selectedVariantName"
							/>
						</template>

						<!-- STEP 1 — Get Started -->
						<template #step-1>
							<StepsStepGetStarted
								:form="form"
								:chosenCard="chosenCard"
								:errors="errors"
								:touched="touched"
								:collapsible-items="collapsibleItems"
								v-model:selectedRange="selectedRange"
							/>
						</template>

						<!-- STEP 2 — Personal Information -->
						<template #step-2>
							<StepsStepPersonalInformation
								:form="form"
								:errors="errors"
								:touched="touched"
							/>
						</template>

						<!-- STEP 3 — Address Information -->
						<template #step-3>
							<StepsStepAddressInformation
								:form="form"
								:errors="errors"
								:touched="touched"
							/>
						</template>

						<!-- STEP 4 — Employment Information -->
						<template #step-4>
							<StepsStepEmploymentInformation
								:form="form"
								:errors="errors"
								:touched="touched"
							/>
						</template>

						<!-- STEP 5 — Financial Information -->
						<template #step-5>
							<StepsStepFinancialInformation
								:form="form"
								:errors="errors"
								:touched="touched"
							/>
						</template>

						<!-- STEP 6 — Supporting Information -->
						<template #step-6>
							<StepsStepSupportingInformation
								:form="form"
							/>
						</template>

						<!-- STEP 7 — Finishing Touches -->
						<template #step-7>
							<StepsStepFinishingTouches
								ref="signaturePadRef"
								:canSign="canSign"
								:form="form"
								:errors="errors"
								:touched="touched"
							/>
						</template>
					</Sidebar>


					<div v-if="!isMobile" class="flex-1">
						<!-- STEP 0 -->
						<StepsStepChooseCard 
							v-if="activeStep === 0" 
							:cards="cards" 
							v-model:selectedCardId="selectedCardId"
							v-model:selectedVariantName="selectedVariantName" 
						/>

						<!-- STEP 1 -->
						<StepsStepGetStarted 
							v-if="activeStep === 1" 
							:form="form" 
							:chosenCard="chosenCard" 
							:errors="errors"
							:touched="touched" 
							:collapsible-items="collapsibleItems" 
							v-model:selectedRange="selectedRange" 
						/>

						<!-- STEP 2 -->
						<StepsStepPersonalInformation 
							v-if="activeStep === 2" 
							:form="form" 
							:errors="errors"
							:touched="touched" 
						/>

						<!-- STEP 3 -->
						<StepsStepAddressInformation 
							v-if="activeStep === 3" 
							:form="form" 
							:errors="errors" 
							:touched="touched" 
						/>

						<!-- STEP 4 -->
						<StepsStepEmploymentInformation 
							v-if="activeStep === 4" 
							:form="form" 
							:errors="errors"
							:touched="touched" 
						/>

						<StepsStepFinancialInformation 
							v-if="activeStep === 5" 
							:form="form" 
							:errors="errors"
							:touched="touched" 
						/>

						<StepsStepSupportingInformation 
							v-if="activeStep === 6" 
							:form="form" 
						/>

						<StepsStepFinishingTouches 
							v-if="activeStep === 7" 
							:canSign="canSign" 
							:form="form" 
							:errors="errors"
							:touched="touched" 
							ref="signaturePadRef" 
						/>
					</div>
				</ClientOnly>
			</div>
		</div>
	</section>

	<StepFooterActions 
		:active-step="activeStep" 
		:can-continue="activeStep === steps.length - 1
			? canSubmitFinishing
			: canContinue" 
		:is-last-step="activeStep === steps.length - 1"
		@next="activeStep === steps.length - 1 
			? handleSubmit() 
			: nextStep()" 
		@prev="prevStep" 
	/>

	<div v-if="submissionMessage" class="w-max mx-auto px-2 bg-red-100 text-center" :class="{'text-red-500': isError, 'text-gray-500': !isError}">{{ submissionMessage }}ddddd</div>

</template>

<script setup>
/* ==========================================================================
   IMPORTS
============================================================================ */
import { PDFDocument } from 'pdf-lib'
import { useMediaQuery } from '@vueuse/core'

/* ==========================================================================
   MEDIA QUERIES
============================================================================ */
const isMobile = useMediaQuery('(max-width: 1279px)') // xl breakpoint

/* ==========================================================================
   Step Definitions
============================================================================ */
const steps = [
	{ title: 'Choose Your Card', description: 'Which card would you like to apply for?', id: 'choose-your-card' },
	{ title: 'Get Started', description: 'Let\'s begin your application.', id: 'get-started' },
	{ title: 'Personal Information', description: 'Tell us a bit about yourself.', id: 'personal-information' },
	{ title: 'Address Information', description: 'Where can we reach you?', id: 'address-information' },
	{ title: 'Employment Information', description: 'Tell us about your employment.', id: 'employment-information' },
	{ title: 'Financial Information', description: 'Share your financial details.', id: 'financial-information' },
	{ title: 'Supporting Information', description: 'Upload the required documents.', id: 'supporting-information' },
	{ title: 'Finishing Touches', description: 'Review and sign your application.', id: 'finishing-touches' },
]

const activeStep = ref(0)

/* ==========================================================================
   Global Form State
============================================================================ */
const selectedRange = ref({ from: 0, to: 0 })

const form = ref({
	selected_card_name: null,
	selected_card_variant: null,

	get_started_is_onboarded: '',
	get_started_is_acknowledged: '',
	get_started_credit_card_limit: { ...selectedRange.value },

	personal_information_email_address: '',
	personal_information_code: '',
	personal_information_phone_number: '',
	personal_information_first_name: '',
	personal_information_last_name: '',
	personal_information_mother_name: '',
	personal_information_father_name: '',
	personal_information_gender: '',
	personal_information_nationality_id: '',
	personal_information_dob: new Date().toISOString().split('T')[0],
	personal_information_marital_status: '',
	personal_information_number_of_dependents: '',
	personal_information_register_number: '',
	personal_information_register_place: '',

	address_information_country_id: '',
	address_information_city: '',
	address_information_street: '',
	address_information_building: '',
	address_information_floor: '',

	employment_information_employment_status: '',
	employment_information_occupation: '',
	employment_information_job_title: '',
	employment_information_years_of_service: '',
	employment_information_employer_name: '',
	employment_information_country_id: '',
	employment_information_city: '',
	employment_information_street: '',
	employment_information_building: '',
	employment_information_floor: '',

	financial_information_monthly_income: '',
	financial_information_other_income: '',
	financial_information_monthly_expenses: '',
	financial_information_has_existing_loans_or_debt: '',

	supporting_information_id_or_passport: [],
	supporting_information_proof_of_residence: [],
	supporting_information_bank_statement: [],
	supporting_information_employment_letter: [],
	supporting_information_commercial_circular: [],
	supporting_information_employer_commercial_circular: [],

	finishing_touches_is_agreed: '',
})

/* ==========================================================================
   Persistence (Cookies)
============================================================================ */
const isResetting = ref(false)

const formCookie = useCookie('credit-card-form', {
	sameSite: 'lax',
	maxAge: 60 * 60 * 24 * 7,
})

const stepCookie = useCookie('credit-card-step', {
	sameSite: 'lax',
	maxAge: 60 * 60 * 24 * 7,
})

const getCookieSafeForm = (form) => {
	const {
		supporting_information_id_or_passport,
		supporting_information_proof_of_residence,
		supporting_information_bank_statement,
		supporting_information_employment_letter,
		supporting_information_commercial_circular,
		supporting_information_employer_commercial_circular,
		...rest
	} = form

	return rest
}

/* ==========================================================================
   Watches — Persistence & Sync
============================================================================ */
watch(
	form,
	(val) => {
		formCookie.value = getCookieSafeForm(val)
	},
	{ deep: true }
)

watch(
	selectedRange,
	(val) => {
		form.value.get_started_credit_card_limit = val
	},
	{ deep: true }
)

/* ==========================================================================
   Validation Rules
============================================================================ */
const validationRules = {
	get_started_is_onboarded: {
		required: 'Please select Yes or No',
		safe: 'Your input has invalid value',
	},
	get_started_is_acknowledged: {
		required: 'You must acknowledge this to continue',
		safe: 'Your input has invalid value',
	},
	get_started_credit_card_limit: {
		required: 'Please select your limit range',
		safe: 'Your input has invalid value',
		range: 'Your input has invalid range',
	},

	personal_information_email_address: {
		required: 'Please enter your email address',
		email: 'Please enter a valid email address',
		safe: 'Your input has invalid value',
	},
	personal_information_code: {
		required: 'Please choose your country code',
		code: 'Please enter a valid country code',
		safe: 'Your input has invalid value',
	},
	personal_information_phone_number: {
		required: 'Please enter your phone number',
		numeric: 'Please enter a valid numeric phone number',
		length: 'Please enter a valid phone number',
		safe: 'Your input has invalid value',
	},

	personal_information_first_name: {
		required: 'Please enter your first name',
		safe: 'Your input has invalid value',
	},
	personal_information_last_name: {
		required: 'Please enter your last name',
		safe: 'Your input has invalid value',
	},
	personal_information_mother_name: {
		required: "Please enter your mother's name",
		safe: 'Your input has invalid value',
	},
	personal_information_father_name: {
		required: "Please enter your father's name",
		safe: 'Your input has invalid value',
	},
	personal_information_gender: {
		required: 'Please select your gender',
		safe: 'Your input has invalid value',
	},
	personal_information_nationality_id: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	personal_information_dob: {
		required: 'Please enter your date of birth',
		safe: 'Your input has invalid value',
	},
	personal_information_marital_status: {
		required: 'Please select your marital status',
		safe: 'Your input has invalid value',
	},
	personal_information_number_of_dependents: {
		required: 'Please enter your number of dependents',
		numeric: 'Please enter a valid numeric number of dependents',
		safe: 'Your input has invalid value',
	},
	personal_information_register_number: {
		required: 'Please enter your register number',
		numeric: 'Please enter a valid numeric register number',
		safe: 'Your input has invalid value',
	},
	personal_information_register_place: {
		required: 'Please enter your register place',
		safe: 'Your input has invalid value',
	},

	address_information_country_id: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	address_information_city: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	address_information_street: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	address_information_building: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	address_information_floor: {
		required: 'Please select your nationality',
		numeric: 'Please enter a valid numeric floor',
		safe: 'Your input has invalid value',
	},

	employment_information_employment_status: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_occupation: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_job_title: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_years_of_service: {
		required: 'Please select your nationality',
		numeric: 'Please enter a valid numeric year',
		safe: 'Your input has invalid value',
	},
	employment_information_employer_name: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_country_id: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_city: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_street: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_building: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	employment_information_floor: {
		required: 'Please select your nationality',
		numeric: 'Please enter a valid numeric floor',
		safe: 'Your input has invalid value',
	},

	financial_information_monthly_income: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	financial_information_other_income: {
		safe: 'Your input has invalid value',
	},
	financial_information_monthly_expenses: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},
	financial_information_has_existing_loans_or_debt: {
		required: 'Please select your nationality',
		safe: 'Your input has invalid value',
	},

	finishing_touches_is_agreed: {
		required: 'You must agree before signing',
		safe: 'Your input has invalid value',
	},
}

/* ==========================================================================
   Validation State
============================================================================ */
const shouldValidate = ref(false)
const touched = ref({})
const errors = ref({
	get_started_is_onboarded: '',
	get_started_is_acknowledged: '',
	get_started_credit_card_limit: '',

	personal_information_email_address: '',
	personal_information_code: '',
	personal_information_phone_number: '',
	personal_information_first_name: '',
	personal_information_last_name: '',
	personal_information_mother_name: '',
	personal_information_father_name: '',
	personal_information_gender: '',
	personal_information_nationality_id: '',
	personal_information_dob: '',
	personal_information_marital_status: '',
	personal_information_number_of_dependents: '',
	personal_information_register_number: '',
	personal_information_register_place: '',

	address_information_country_id: '',
	address_information_city: '',
	address_information_street: '',
	address_information_building: '',
	address_information_floor: '',

	employment_information_employment_status: '',
	employment_information_occupation: '',
	employment_information_job_title: '',
	employment_information_years_of_service: '',
	employment_information_employer_name: '',
	employment_information_country_id: '',
	employment_information_city: '',
	employment_information_street: '',
	employment_information_building: '',
	employment_information_floor: '',

	financial_information_monthly_income: '',
	financial_information_other_income: '',
	financial_information_monthly_expenses: '',
	financial_information_has_existing_loans_or_debt: '',

	supporting_information_id_or_passport: '',
	supporting_information_proof_of_residence: '',
	supporting_information_bank_statement: '',
	supporting_information_employment_letter: '',
	supporting_information_commercial_circular: '',
	supporting_information_employer_commercial_circular: '',

	finishing_touches_is_agreed: '',

	signed_contract: '',
	signature_image: ''
})

/* ==========================================================================
   Step → Fields Mapping
============================================================================ */
const stepFields = {
	0: ['selected_card_name'],
	1: [
		'get_started_is_onboarded',
		'get_started_is_acknowledged',
		'get_started_credit_card_limit',
	],
	2: [
		'personal_information_email_address',
		'personal_information_code',
		'personal_information_phone_number',
		'personal_information_first_name',
		'personal_information_last_name',
		'personal_information_mother_name',
		'personal_information_father_name',
		'personal_information_gender',
		'personal_information_nationality_id',
		'personal_information_dob',
		'personal_information_marital_status',
		'personal_information_number_of_dependents',
		'personal_information_register_number',
		'personal_information_register_place',
	],
	3: [
		'address_information_country_id',
		'address_information_city',
		'address_information_street',
		'address_information_building',
		'address_information_floor',
	],
	4: [
		'employment_information_employment_status',
		'employment_information_occupation',
		'employment_information_job_title',
		'employment_information_years_of_service',
		'employment_information_employer_name',
		'employment_information_country_id',
		'employment_information_city',
		'employment_information_street',
		'employment_information_building',
		'employment_information_floor',
	],
	5: [
		'financial_information_monthly_income',
		'financial_information_other_income',
		'financial_information_monthly_expenses',
		'financial_information_has_existing_loans_or_debt',
	],
	6: [
		'supporting_information_id_or_passport',
		'supporting_information_proof_of_residence',
		'supporting_information_bank_statement',
		'supporting_information_employment_letter',
		'supporting_information_commercial_circular',
		'supporting_information_employer_commercial_circular',
	],
	7: [
		'finishing_touches_is_agreed',
		'finishing_touches_signature_pad',
	],
}

/* ==========================================================================
   Validation Logic
============================================================================ */
const validateStep = (step) => {
	if (!shouldValidate.value) return true

	const fields = stepFields[step] || []

	fields.forEach((field) => {
		touched.value[field] = true
		errors.value[field] = ''
	})

	const stepRules = {}
	fields.forEach((field) => {
		if (validationRules[field]) {
			stepRules[field] = validationRules[field]
		}
	})

	const stepErrors = ref({})
	const isValid = validateForm(form.value, stepErrors.value, stepRules)

	fields.forEach((field) => {
		errors.value[field] = stepErrors.value[field] || ''
	})

	return isValid
}

const hasRequiredFiles = () => {
	return (
		form.value.supporting_information_id_or_passport?.length > 0 ||
		form.value.supporting_information_proof_of_residence?.length > 0 ||
		form.value.supporting_information_bank_statement?.length > 0 ||
		form.value.supporting_information_employment_letter?.length > 0 ||
		form.value.supporting_information_commercial_circular?.length > 0 ||
		form.value.supporting_information_employer_commercial_circular?.length > 0
	)
}

const hasSignature = () => {
	return signaturePadRef.value && !signaturePadRef.value.isEmpty()
}

/* ==========================================================================
   Step Navigation
============================================================================ */
const setStep = (index) => {
	if (index > activeStep.value) {
		shouldValidate.value = true
		if (!validateStep(activeStep.value)) return
		shouldValidate.value = false
	}
	activeStep.value = index
}

const nextStep = () => {
	shouldValidate.value = true
	if (!validateStep(activeStep.value)) return
	shouldValidate.value = false
	activeStep.value++
}

const prevStep = () => {
	if (activeStep.value > 0) activeStep.value--
}

const canSubmitFinishing = computed(() => {
	if (activeStep.value !== 7) return false
	if (form.value.finishing_touches_is_agreed !== 'Yes') return false
	if (!signaturePadRef.value) return false
	if (signaturePadRef.value.isEmpty()) return false // 🔥 FIX
	return true
})

const currentStep = computed(() => steps[activeStep.value])

/* ==========================================================================
   Step Completion Helpers
============================================================================ */
const isFieldFilled = (value) => {
	if (value === null || value === undefined || value === '') {
		return false
	}

	if (Array.isArray(value)) {
		return value.some((f) => !f.error)
	}

	return true
}

const canContinue = computed(() => {
	const fields = stepFields[activeStep.value] || []
	return fields.every((field) => isFieldFilled(form.value[field]))
})

const isStepComplete = (step) => {
	const fields = stepFields[step] || []
	return fields.every((field) => isFieldFilled(form.value[field]))
}

const canGoToStep = (targetStep) => {
	if (targetStep <= activeStep.value) return true
	for (let step = 0; step < targetStep; step++) {
		if (!isStepComplete(step)) return false
	}
	return true
}

/* ==========================================================================
   Cards — Step 1
============================================================================ */
const cards = [
	{
		id: 'usd-platinum',
		name: 'Mastercard Platinum® USD Credit Card',
		currency: 'USD',
		slider: {
			min: 5000,
			max: 30000,
			steps: 200,
			initialTo: 8000,
			scaleStep: 5000,
		},
		hasVariants: true,
		variants: [
			{
				name: 'red',
				image: 'usd-platinum-credit-card-red',
				bg: 'bg-[linear-gradient(134.22deg,#E71C24_11.74%,#A71D21_89.16%)]',
			},
			{
				name: 'blue',
				image: 'usd-platinum-credit-card-green',
				bg: 'bg-[radial-gradient(55.9%_44.72%_at_50%_50%,#00A5AB_36.62%,#009FA6_66%,#007585_100%)]',
			},
			{
				name: 'white',
				image: 'usd-platinum-credit-card-white',
				bg: 'bg-[linear-gradient(180deg,#FFFFFF_25%,#AFB8C8_100%)]',
			},
		],
		description: "This is the description content that appears smoothly when opened.",
		eligibility: [
			"Lebanese Citizen",
			"Age between 21 and 64",
			"Employed: 1 year of employment with current employer",
			"Self-employed: 3 years of experience in the same field",
			"Minimum monthly income of Fresh USD 1,000"
		],
		kfs: [
			{ label: 'Annual Fee', value: 'USD 75' },
			{ label: 'APR', value: '26.68%' },
			{ label: 'Cashback', value: '1%' },
			{ label: 'Minimum Limit', value: 'USD 500' },
		]
	},
	{
		id: 'eur-platinum',
		name: 'Mastercard Platinum® EUR Credit Card',
		currency: 'EUR',
		slider: {
			min: 4000,
			max: 20000,
			steps: 100,
			initialTo: 12000,
			scaleStep: 4000,

		},
		hasVariants: false,
		image: 'eur-platinum-credit-card-green',
		description: "This is the description content that appears smoothly when opened.",
		eligibility: [
			"Lebanese Citizen",
			"Age between 21 and 64",
			"Employed: 1 year of employment with current employer",
			"Self-employed: 3 years of experience in the same field",
			"Minimum monthly income of Fresh USD 1,000"
		],
		kfs: [
			{ label: 'Annual Fee', value: 'USD 75' },
			{ label: 'APR', value: '26.68%' },
			{ label: 'Cashback', value: '1%' },
			{ label: 'Minimum Limit', value: 'USD 500' },
		]
	},
	{
		id: 'usd-world-elite',
		name: 'Mastercard World Elite® USD Credit Card',
		currency: 'USD',
		slider: {
			min: 20000,
			max: 100000,
			steps: 1000,
			initialTo: 50000,
			scaleStep: 20000,

		},
		hasVariants: false,
		image: 'usd-world-elite-credit-card-black',
		description: "This is the description content that appears smoothly when opened.",
		eligibility: [
			"Lebanese Citizen",
			"Age between 21 and 64",
			"Employed: 1 year of employment with current employer",
			"Self-employed: 3 years of experience in the same field",
			"Minimum monthly income of Fresh USD 1,000"
		],
		kfs: [
			{ label: 'Annual Fee', value: 'USD 75' },
			{ label: 'APR', value: '26.68%' },
			{ label: 'Cashback', value: '1%' },
			{ label: 'Minimum Limit', value: 'USD 500' },
		]
	},
	// 🔥 add more cards here freely
]

const selectedCardId = ref(null)
const selectedVariantName = ref(null)

const chosenCard = computed(() => {
	const card = cards.find((c) => c.id === selectedCardId.value)
	if (!card) return null

	return {
		...card,
		image: card.hasVariants
			? card.variants.find((v) => v.name === selectedVariantName.value)?.image ??
			card.variants[0].image
			: card.image,
	}
})

const selectedCardData = computed(() => {
	const card = cards.find((c) => c.id === selectedCardId.value)
	if (!card) return null

	return {
		card_name: card.name,
		card_id: card.id,
		card_variant: card.hasVariants ? selectedVariantName.value : null,
	}
})

watch(
	selectedCardData,
	(val) => {
		if (!val) return
		form.value.selected_card_name = val.card_name
		form.value.selected_card_variant = val.card_variant
	},
	{ immediate: true }
)

/* ==========================================================================
   Step 2 – Get Started
============================================================================ */
const collapsibleItems = [
	{ title: 'Eligibility Criteria for Mastercard Platinum® USD & EUR Credit Card', content: 'dasd', bg: false },
	{ title: 'Eligibility Criteria for Mastercard World Elite® USD Credit Card', content: 'dad', bg: false },
]

/* ==========================================================================
   Submission State
============================================================================ */
const submissionMessage = ref('')
const isSubmitting = ref(false)
const isError = ref(false)
const signaturePadRef = ref(null)

/* ==========================================================================
   Submission Guards
============================================================================ */
const canSign = computed(() => form.value.finishing_touches_is_agreed === 'Yes')

const canSubmit = computed(() => {
	return canSign.value && signaturePadRef.value && !signaturePadRef.value.isEmpty()
})

watch(
	() => form.value.finishing_touches_is_agreed,
	(val) => {
		if (val === 'Yes') {
			errors.value.finishing_touches_is_agreed = ''
			signaturePadRef.value?.clearSignatureError()
		}
	}
)

/* ==========================================================================
   Submission Helpers
============================================================================ */
const buildPayload = () => {
	return {
		...form.value,
		get_started_credit_card_limit:
			form.value.get_started_credit_card_limit?.from &&
				form.value.get_started_credit_card_limit?.to
				? `${form.value.get_started_credit_card_limit.from} - ${form.value.get_started_credit_card_limit.to}`
				: '',
	}
}

const logFullForm = () => {
	const safeForm = {}

	Object.entries(form.value).forEach(([key, value]) => {
		if (Array.isArray(value)) {
			safeForm[key] = value.map((item) => ({
				name: item?.file?.name || null,
				size: item?.file?.size || null,
				type: item?.file?.type || null,
				error: item?.error || null,
			}))
			return
		}

		if (typeof value === 'object' && value !== null) {
			safeForm[key] = { ...value }
			return
		}

		safeForm[key] = value
	})

	console.group('📋 FULL FORM STATE')
	console.table(safeForm)
	console.groupEnd()
}

const base64ToPngFile = (base64, filename) => {
	const [meta, data] = base64.split(',')
	const mime = meta.match(/:(.*?);/)[1]
	const binary = atob(data)
	const buffer = new Uint8Array(binary.length)

	for (let i = 0; i < binary.length; i++) {
		buffer[i] = binary.charCodeAt(i)
	}

	return new File([buffer], filename, { type: mime })
}

const generateSignatureFileName = () => {
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
	const random = Math.random().toString(36).slice(2, 8)
	return `signature_${timestamp}_${random}.png`
}

const addSignatureToPdf = async (signatureDataUrl) => {
	const existingPdfBytes = await fetch('/pdf-test.pdf').then(res => res.arrayBuffer())
	const pdfDoc = await PDFDocument.load(existingPdfBytes)

	const page = pdfDoc.getPages().at(-1)
	const signatureImage = await pdfDoc.embedPng(signatureDataUrl)

	const signatureWidth = 150
	const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth

	// Draw signature
	page.drawImage(signatureImage, {
		x: 50,
		y: 100,
		width: signatureWidth,
		height: signatureHeight,
	})

	// Draw signer name
	page.drawText(`Signed by: ${form.value.personal_information_first_name}`, {
		x: 50,
		y: 100,
		size: 10,
	})

	// Draw signed date (optional but recommended)
	page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
		x: 50,
		y: 85,
		size: 10,
	})

	const pdfBytes = await pdfDoc.save()

	// ❌ NO DOWNLOAD HERE
	return new File([pdfBytes], 'signed-contract.pdf', {
		type: 'application/pdf',
	})
}


const downloadFile = (file) => {
	const url = URL.createObjectURL(file)
	const a = document.createElement('a')
	a.href = url
	a.download = file.name
	a.click()
	URL.revokeObjectURL(url)
}

/* ==========================================================================
   Submit Handler
============================================================================ */
const handleSubmit = async () => {
	// Disable the submit button
	isSubmitting.value = true;

	// 1️⃣ Agreement check (only on submit)
	if (form.value.finishing_touches_is_agreed !== 'Yes') {
		isSubmitting.value = false; // Re-enable the button
		errors.value.finishing_touches_is_agreed = 'You must agree before signing'
		return
	}

	// 2️⃣ Signature check
	if (signaturePadRef.value.isEmpty()) {
		isSubmitting.value = false; // Re-enable the button
		signaturePadRef.value.setSignatureError('You must sign before submitting')
		return
	}

	// 3️⃣ NOW validate the rest of the form
	shouldValidate.value = true

	/* ===============================
	   STEP 2 — GLOBAL FORM VALIDATION
	=============================== */

	const isFormValid = validateForm(form.value, errors.value, validationRules)
	if (!isFormValid) {
		isSubmitting.value = false; // Re-enable the button
		submissionMessage.value = 'Please ensure all required fields are correctly filled.'
		isError.value = true
		return
	}

	/* ===============================
	   STEP 3 — GENERATE SIGNED FILE & SIGNATURE IMAGE
	=============================== */
	try {
		const signatureBase64 = signaturePadRef.value.getSignature()
		const signedPdfFile = await addSignatureToPdf(signatureBase64)
		const signatureImage = base64ToPngFile(
			signatureBase64,
			generateSignatureFileName()
		)

		// const url = URL.createObjectURL(signatureImage)
		// window.open(url, '_blank')
		// console.log('SIGNATURE FILE:', signatureImage)

		/* ===============================
		STEP 4 — BUILD PAYLOAD
		=============================== */

		const payload = buildPayload()
		const formData = new FormData()

		Object.entries(payload).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item?.file instanceof File && !item.error) {
						formData.append(`${key}[]`, item.file)
					}
				})
				return
			}

			if (value !== null && value !== undefined) {
				formData.append(key, value)
			}
		})

		formData.append('signed_contract', signedPdfFile)
		formData.append('signature_image', signatureImage)

		// logFullForm()

		/* ===============================
		STEP 5 — SUBMIT API
		=============================== */
		const API_ENDPOINT = 'https://leb-backend.mymonty.com/api/applications';

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			body: formData,
			headers: {
				'Accept': 'application/json',
				// 'Content-Type': 'multipart/form-data' // No need to set this header for FormData
			},
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		
		const data = await response.json();
		// console.log("Form submitted successfully:", data);

		if (data.status === 'validation_failed') {
			submissionMessage.value = "Error in submitting your message. Please try again later"
			isError.value = true

			setTimeout(() => {
				submissionMessage.value = ''
			}, 2000)

			return
		}

		downloadFile(signedPdfFile)
		
		submissionMessage.value = "Thank you for your message."
		isError.value = false;
		// Clear success message after 2 seconds
		setTimeout(() => {
			submissionMessage.value = '';
		}, 2000);

		// isResetting.value = true

		// stepCookie.value = null
		// formCookie.value = null

		// // 🔥 RESET CARD SELECTION (THIS IS WHAT YOU MISSED)
		// selectedCardId.value = null
		// selectedVariantName.value = null

		// // 🔥 RESET FORM
		// // resetForm()

		// // 🔥 RESET STEP
		// activeStep.value = 0

		// nextTick(() => {
		// 	isResetting.value = false
		// })

	}
	catch (error) {
		console.error("Form submission error:", error);
		// Set error message
		submissionMessage.value = "Error in submitting your message. Please try again later";
		isError.value = true;

		// Clear error message after 2 seconds
		setTimeout(() => {
			submissionMessage.value = '';
		}, 2000);
	} finally {
		// Re-enable the submit button
		isSubmitting.value = false;
	}
	// logFullForm()
}

const resetForm = () => {
	form.value = {
		selected_card_name: null,
		selected_card_variant: null,

		get_started_is_onboarded: '',
		get_started_is_acknowledged: '',
		get_started_credit_card_limit: { from: null, to: null },

		personal_information_email_address: '',
		personal_information_code: '',
		personal_information_phone_number: '',
		personal_information_first_name: '',
		personal_information_last_name: '',
		personal_information_mother_name: '',
		personal_information_father_name: '',
		personal_information_gender: '',
		personal_information_nationality_id: '',
		personal_information_dob: '',
		personal_information_marital_status: '',
		personal_information_number_of_dependents: '',
		personal_information_register_number: '',
		personal_information_register_place: '',

		address_information_country_id: '',
		address_information_city: '',
		address_information_street: '',
		address_information_building: '',
		address_information_floor: '',

		employment_information_employment_status: '',
		employment_information_occupation: '',
		employment_information_job_title: '',
		employment_information_years_of_service: '',
		employment_information_employer_name: '',
		employment_information_country_id: '',
		employment_information_city: '',
		employment_information_street: '',
		employment_information_building: '',
		employment_information_floor: '',

		financial_information_monthly_income: '',
		financial_information_other_income: '',
		financial_information_monthly_expenses: '',
		financial_information_has_existing_loans_or_debt: '',

		supporting_information_id_or_passport: [],
		supporting_information_proof_of_residence: [],
		supporting_information_bank_statement: [],
		supporting_information_employment_letter: [],
		supporting_information_commercial_circular: [],
		supporting_information_employer_commercial_circular: [],

		finishing_touches_is_agreed: '',
		finishing_touches_signature_pad: '',

		signed_contract: '',
		signature_image: ''
	}
}

/* ==========================================================================
   Restore State on Mount
============================================================================ */
onMounted(() => {
	if (formCookie.value) {
		Object.keys(form.value).forEach((key) => {
			if (formCookie.value?.[key] !== undefined) {
				form.value[key] = formCookie.value[key]
			}
		})

		if (form.value.get_started_credit_card_limit?.from !== undefined) {
			selectedRange.value = { ...form.value.get_started_credit_card_limit }
		}
	}

	if (typeof stepCookie.value === 'number' && stepCookie.value >= 0) {
		activeStep.value = stepCookie.value
	} else {
		activeStep.value = 0
	}

	if (form.value.selected_card_name) {
		const card = cards.find((c) => c.name === form.value.selected_card_name)
		if (card) selectedCardId.value = card.id
	}

	if (form.value.selected_card_variant && selectedCardId.value) {
		selectedVariantName.value = form.value.selected_card_variant
	}

	// 🔥 STEP GUARD AFTER REFRESH
	if (activeStep.value === 7) {
		const filesMissing = !hasRequiredFiles()
		const signatureMissing = !hasSignature()

		if (filesMissing || signatureMissing) {
			activeStep.value = 6
			stepCookie.value = 6
		}
	}
})

watch(activeStep, (step) => {
	if (isResetting.value) return
	stepCookie.value = step
})
</script>

<style lang="sass">
	.input-file input
		@apply opacity-0 absolute w-full h-full

	.input-file label
		@apply bg-white cursor-pointer border border-dashed border-[#e0e0e0] rounded-xl min-h-[200px] flex items-center justify-center p-14 text-center
</style>