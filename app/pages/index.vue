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
		:can-continue="activeStep === steps.length - 1 ? canSubmitFinishing : canContinue" 
		:is-last-step="activeStep === steps.length - 1"
		:is-submitting="submitStatus === 'loading'"
		@next="activeStep === steps.length - 1 ? handleSubmit() : nextStep()" 
		@prev="prevStep" 
	/>

	<!-- ================= SUBMIT MODAL ================= -->
	<Teleport to="body">
		<div v-if="showSubmitModal" class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70">
			<div class="relative w-full max-w-md rounded-3xl bg-white p-8 text-center">

				<button v-if="submitStatus !== 'loading'" class="absolute right-4 top-4 text-gray-400 hover:text-black" @click="goHomeAndReset">✕</button>

				<!-- LOADING -->
				<div v-if="submitStatus === 'loading'">
					<div class="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
					<h2 class="text-2xl font-AeonikBlack">Please wait</h2>
					<p class="mt-2 text-gray-500">Your application is being submitted. <br /> Please do not refresh the page.</p>
				</div>

				<!-- SUCCESS -->
				<div v-if="submitStatus === 'success'">
					<h2 class="text-3xl font-AeonikBlack text-green-600">Application Submitted 🎉</h2>
					<p class="mt-4 text-gray-600">Thank you for your application. Our team will review it shortly.</p>
					<button class="mt-8 w-full rounded-full bg-black py-3 text-white" @click="goHomeAndReset">Go to homepage</button>
				</div>

				<!-- ERROR -->
				<div v-if="submitStatus === 'error'">
					<h2 class="text-2xl font-AeonikBlack text-red-600">Something went wrong</h2>
					<p class="mt-4 text-gray-600">Please try again later.</p>
					<button class="mt-8 w-full rounded-full bg-black py-3 text-white" @click="goHomeAndReset">Close</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
/* ==========================================================================
   IMPORTS
============================================================================ */
import { PDFDocument } from 'pdf-lib'
import { useMediaQuery } from '@vueuse/core'
import confetti from 'canvas-confetti'
import { useScrollWithOffset } from '~/composables/useScrollWithOffset'

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
	/* ===============================
	   GET STARTED
	=============================== */
	get_started_is_onboarded: {
		required: 'Please select Yes or No',
		safe: 'Invalid value selected',
	},
	get_started_is_acknowledged: {
		required: 'You must acknowledge this before continuing',
		safe: 'Invalid value selected',
	},
	get_started_credit_card_limit: {
		required: 'Please select a credit limit range',
		range: 'Please select a valid credit limit range',
		safe: 'Invalid value selected',
	},

	/* ===============================
	   PERSONAL INFORMATION
	=============================== */
	personal_information_email_address: {
		required: 'Please enter your email address',
		email: 'Please enter a valid email address',
		safe: 'Invalid email address',
	},
	personal_information_code: {
		required: 'Please select your country code',
		code: 'Please select a valid country code',
		safe: 'Invalid country code',
	},
	personal_information_phone_number: {
		required: 'Please enter your phone number',
		numeric: 'Phone number must contain numbers only',
		length: 'Please enter a valid phone number',
		safe: 'Invalid phone number',
	},

	personal_information_first_name: {
		required: 'Please enter your first name',
		safe: 'Invalid first name',
	},
	personal_information_last_name: {
		required: 'Please enter your last name',
		safe: 'Invalid last name',
	},
	personal_information_mother_name: {
		required: "Please enter your mother's name",
		safe: 'Invalid name',
	},
	personal_information_father_name: {
		required: "Please enter your father's name",
		safe: 'Invalid name',
	},
	personal_information_gender: {
		required: 'Please select your gender',
		safe: 'Invalid gender selection',
	},
	personal_information_nationality_id: {
		required: 'Please select your nationality',
		safe: 'Invalid nationality selection',
	},
	personal_information_dob: {
		required: 'Please enter your date of birth',
		safe: 'Invalid date of birth',
	},
	personal_information_marital_status: {
		required: 'Please select your marital status',
		safe: 'Invalid marital status selection',
	},
	personal_information_number_of_dependents: {
		required: 'Please enter the number of dependents',
		safe: 'Invalid number of dependents',
	},
	personal_information_register_number: {
		required: 'Please enter your register number',
		numeric: 'Register number must contain numbers only',
		safe: 'Invalid register number',
	},
	personal_information_register_place: {
		required: 'Please enter your register place',
		safe: 'Invalid register place',
	},

	/* ===============================
	   ADDRESS INFORMATION
	=============================== */
	address_information_country_id: {
		required: 'Please select your country',
		safe: 'Invalid country selection',
	},
	address_information_city: {
		required: 'Please enter your city',
		safe: 'Invalid city',
	},
	address_information_street: {
		required: 'Please enter your street name',
		safe: 'Invalid street name',
	},
	address_information_building: {
		required: 'Please enter your building name or number',
		safe: 'Invalid building information',
	},
	address_information_floor: {
		required: 'Please enter your floor number',
		safe: 'Invalid floor number',
	},

	/* ===============================
	   EMPLOYMENT INFORMATION
	=============================== */
	employment_information_employment_status: {
		required: 'Please select your employment status',
		safe: 'Invalid employment status',
	},
	employment_information_occupation: {
		required: 'Please enter your occupation',
		safe: 'Invalid occupation',
	},
	employment_information_job_title: {
		required: 'Please enter your job title',
		safe: 'Invalid job title',
	},
	employment_information_years_of_service: {
		required: 'Please enter your years of service',
		safe: 'Invalid years of service',
	},
	employment_information_employer_name: {
		required: 'Please enter your employer name',
		safe: 'Invalid employer name',
	},
	employment_information_country_id: {
		required: 'Please select your employer country',
		safe: 'Invalid country selection',
	},
	employment_information_city: {
		required: 'Please enter your employer city',
		safe: 'Invalid city',
	},
	employment_information_street: {
		required: 'Please enter your employer street',
		safe: 'Invalid street',
	},
	employment_information_building: {
		required: 'Please enter your employer building',
		safe: 'Invalid building',
	},
	employment_information_floor: {
		required: 'Please enter your employer floor',
		safe: 'Invalid floor number',
	},

	/* ===============================
	   FINANCIAL INFORMATION
	=============================== */
	financial_information_monthly_income: {
		required: 'Please enter your monthly income',
		numeric: 'Monthly income must contain numbers only',
		safe: 'Invalid monthly income',
	},
	financial_information_other_income: {
		numeric: 'Other income must contain numbers only',
		safe: 'Invalid other income value',
	},
	financial_information_monthly_expenses: {
		required: 'Please enter your monthly expenses',
		numeric: 'Monthly expenses must contain numbers only',
		safe: 'Invalid monthly expenses',
	},
	financial_information_has_existing_loans_or_debt: {
		required: 'Please select whether you have existing loans or debt',
		safe: 'Invalid selection',
	},

	/* ===============================
	   FINISHING TOUCHES
	=============================== */
	finishing_touches_is_agreed: {
		required: 'You must agree to the terms before signing',
		safe: 'Invalid agreement value',
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

	signed_cdr: '',
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
	// 6: [
	// 	'supporting_information_id_or_passport',
	// 	'supporting_information_proof_of_residence',
	// 	'supporting_information_bank_statement',
	// 	'supporting_information_employment_letter',
	// 	'supporting_information_commercial_circular',
	// 	'supporting_information_employer_commercial_circular',
	// ],
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

const { scrollToWithOffset } = useScrollWithOffset()

const setStep = async (index) => {
	if (index > activeStep.value) {
		shouldValidate.value = true
		if (!validateStep(activeStep.value)) return
		shouldValidate.value = false
	}
	activeStep.value = index

	// 2️⃣ wait for v-if DOM to render
	await nextTick()

	scrollToWithOffset(steps[index].id)
}

const nextStep = async () => {
	shouldValidate.value = true
	if (!validateStep(activeStep.value)) return
	shouldValidate.value = false

	await setStep(activeStep.value + 1)
}

const prevStep = async () => {
	if (activeStep.value === 0) return

	await setStep(activeStep.value - 1)
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
		description: "Your everyday credit card for spending in USD, locally or abroad. <br /> Simple, flexible, and built for daily purchases with cashback on every swipe.",
		link: "https://mymonty.com.lb/platinum-credit-card",
		slider: {
			min: 500,
			max: 5000,
			steps: 100,
			initialTo: 2000,
			scaleStep: 800,
		},
		hasVariants: true,
		variants: [
			{
				name: 'Red',
				image: 'usd-platinum-credit-card-red',
				bg: 'bg-[linear-gradient(134.22deg,#E71C24_11.74%,#A71D21_89.16%)]',
			},
			{
				name: 'Blue',
				image: 'usd-platinum-credit-card-green',
				bg: 'bg-[radial-gradient(55.9%_44.72%_at_50%_50%,#00A5AB_36.62%,#009FA6_66%,#007585_100%)]',
			},
			{
				name: 'White',
				image: 'usd-platinum-credit-card-white',
				bg: 'bg-[linear-gradient(180deg,#FFFFFF_25%,#AFB8C8_100%)]',
			},
		],
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
		description: "Spend in Europe like a local. <br /> Pay directly in EUR, avoid extra FX fees, and enjoy smooth, worry-free travel spending.",
		link: "https://mymonty.com.lb/platinum-credit-card",
		image: 'eur-platinum-credit-card-green',
		slider: {
			min: 500,
			max: 5000,
			steps: 100,
			initialTo: 2000,
			scaleStep: 800,
		},
		hasVariants: false,
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
		description: "Premium spending with premium access. <br /> Enjoy exclusive benefits, global privileges, and access to over 1,300 airport lounges worldwide.",
		link: "https://mymonty.com.lb/world-elite-credit-card",
		image: 'usd-world-elite-credit-card-black',
		slider: {
			min: 5000,
			max: 30000,
			steps: 100,
			initialTo: 8000,
			scaleStep: 5000,
		},
		hasVariants: false,
		eligibility: [
			"Lebanese Citizen",
			"Age between 30 and 64",
			"Employed: 1 year of employment with current employer",
			"Self-employed: 3 years of experience in the same field",
			"Minimum monthly income of Fresh USD 9,000"
		],
		kfs: [
			{ label: 'Annual Fee', value: 'USD 250' },
			{ label: 'APR', value: '26.68%' },
			{ label: 'Cashback', value: '1%' },
			{ label: 'Minimum Limit', value: 'USD 5000' },
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
	{ 
		title: 'Eligibility Criteria for Mastercard Platinum® USD & EUR Credit Card',
		content: '<ul class="list-disc pl-4"><li>You must be a Lebanese citizen to qualify for this credit card.</li><li>You must be between 21 and 64 years of age at the time of application.</li><li>If you are employed, you must have at least one year of continuous employment with your current employer.</li><li>If you are self-employed, you must have a minimum of three years of experience in the same business field.</li><li>You must earn a minimum monthly income of Fresh USD 1,000.</li></ul>', 
		bg: false 
	},
	{ 
		title: 'Eligibility Criteria for Mastercard World Elite® USD Credit Card',
		content: '<ul class="list-disc pl-4"><li>You must be a Lebanese citizen to qualify for this credit card.</li><li>You must be between 30 and 64 years of age at the time of application.</li><li>If you are employed, you must have at least one year of continuous employment with your current employer.</li><li>If you are self-employed, you must have a minimum of three years of experience in the same business field.</li><li>You must earn a minimum monthly income of Fresh USD 9,000.</li></ul>', 
		bg: false 
	},
]

/* ==========================================================================
   Submission State
============================================================================ */
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

const addSignatureToCdr = async (signatureDataUrl) => {
	const existingPdfBytes = await fetch('/BDLCDR-D3-PP.pdf').then(res => res.arrayBuffer())
	const pdfDoc = await PDFDocument.load(existingPdfBytes)

	const page = pdfDoc.getPages().at(-1)
	const signatureImage = await pdfDoc.embedPng(signatureDataUrl)

	const signatureWidth = 130
	const signatureHeight = (signatureImage.height / signatureImage.width) * signatureWidth

	// Draw signature
	page.drawImage(signatureImage, {
		x: 50,
		y: 55,
		width: signatureWidth,
		height: signatureHeight,
	})

	// // Draw signer name
	page.drawText(`${form.value.personal_information_first_name}`, {
		x: 120,
		y: 389,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_last_name}`, {
		x: 180,
		y: 372,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_father_name}`, {
		x: 180,
		y: 356,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_mother_name}`, {
		x: 190,
		y: 340,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_dob}`, {
		x: 180,
		y: 325,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_register_number}`, {
		x: 150,
		y: 295,
		size: 10,
	})

	page.drawText(`${form.value.personal_information_register_place}`, {
		x: 250,
		y: 295,
		size: 10,
	})

	if(form.value.personal_information_gender === 'Male'){
		page.drawText(`X`, {
			x: 191,
			y: 389,
			size: 9,
		})
	}
	else {
		page.drawText(`X`, {
			x: 251,
			y: 389,
			size: 9,
		})
	}

	const pdfBytes = await pdfDoc.save()

	// ❌ NO DOWNLOAD HERE
	return new File([pdfBytes], 'signed-cdr.pdf', {
		type: 'application/pdf',
	})
}

const openFileInNewTab = (file) => {
	const url = URL.createObjectURL(file)

	// ✅ User-initiated new tab
	window.open(url, '_blank', 'noopener,noreferrer')

	// cleanup (delay so browser can load it)
	setTimeout(() => {
		URL.revokeObjectURL(url)
	}, 1000)
}

const downloadSignedCdr = () => {
	if (!pendingDownloadFile.value) return

	openFileInNewTab(pendingDownloadFile.value)
	pendingDownloadFile.value = null
}

/* ==========================================================================
   Submit Handler
============================================================================ */

const fireConfetti = () => {
	const duration = 1200
	const end = Date.now() + duration

	const frame = () => {
		confetti({
			particleCount: 14,
			angle: 70,
			spread: 700,   // 👈 WIDER
			startVelocity: 45,
			origin: { x: 0 },
		})
		confetti({
			particleCount: 14,
			angle: 110,
			spread: 700,   // 👈 WIDER
			startVelocity: 45,
			origin: { x: 1 },
		})

		if (Date.now() < end) {
			requestAnimationFrame(frame)
		}
	}

	frame()
}

const pendingDownloadFile = ref(null)
const showSubmitModal = ref(false)
const submitStatus = ref('idle') // idle | loading | success | error

const router = useRouter()

watch(showSubmitModal, (v) => {
	document.body.style.overflow = v ? 'hidden' : ''
})

const goHomeAndReset = () => {
	showSubmitModal.value = false

	submitStatus.value = 'idle'

	stepCookie.value = null
	formCookie.value = null
	selectedCardId.value = null
	selectedVariantName.value = null

	resetForm()

	activeStep.value = 0

	nextTick(() => {
		isResetting.value = false
	})

	router.push('/')
}


const handleSubmit = async () => {
	// prevent double submit
	if (submitStatus.value === 'loading') return

	showSubmitModal.value = true
	submitStatus.value = 'loading'

	// 1️⃣ Agreement check (only on submit)
	if (form.value.finishing_touches_is_agreed !== 'Yes') {
		submitStatus.value = 'error'
		errors.value.finishing_touches_is_agreed = 'You must agree before signing'
		return
	}

	// 2️⃣ Signature check
	if (signaturePadRef.value.isEmpty()) {
		submitStatus.value = 'error'
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
		submitStatus.value = 'error'
		return
	}

	/* ===============================
	   STEP 3 — GENERATE SIGNED FILE & SIGNATURE IMAGE
	=============================== */
	try {
		const signatureBase64 = signaturePadRef.value.getSignature()
		const signedCdrFile = await addSignatureToCdr(signatureBase64)
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

		formData.append('signed_cdr', signedCdrFile)
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
			submitStatus.value = 'error'
			// errors.value = data.errors ?? {}
			return
		}

		submitStatus.value = 'success'
		
		// 🎉 CONFETTI — STARTS HERE
		fireConfetti()

		// ⏸ SAVE FILE FOR LATER DOWNLOAD
		pendingDownloadFile.value = signedCdrFile
	}
	catch (error) {
		submitStatus.value = 'error'
		// console.error("Form submission error:", error);
	} finally {
		// Re-enable the submit button
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

		signed_cdr: '',
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
		// const filesMissing = !hasRequiredFiles()
		const signatureMissing = !hasSignature()

		// if (filesMissing || signatureMissing) {
		if (signatureMissing) {
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