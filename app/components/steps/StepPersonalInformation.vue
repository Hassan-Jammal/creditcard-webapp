<template>
    <div id="personal-information" class="w-full">
        <div class="relative p-4 xl:p-8 bg-[#F7F7F7] rounded-3xl">
            <div class="flex flex-col gap-4 lg:gap-8">
                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="email_address" class="text-base">Email Address</label>
                        <input v-model="form.personal_information_email_address" type="text"
                            placeholder="Enter Email Address" id="email_address"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none" />
                        <div v-if="touched.personal_information_email_address && errors.personal_information_email_address"
                            class="text-xs text-red-500">{{ errors.personal_information_email_address }}</div>
                    </div>
                    <div class="flex flex-col gap-1 w-full">
                        <label for="phone_number" class="text-base">Phone Number</label>
                        <div class="relative flex flex-row items-start gap-1">
                            <div class="flex flex-col gap-1 w-[160px]">
                                <div @click="toggleDropdown"
                                    class="custom-dropdown w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none cursor-pointer">
                                    <div id="selected-country"
                                        class="flex justify-start items-center gap-2 select-none">
                                        <NuxtImg loading="lazy"
                                            :src="`/images/flags/${selectedCountry.iso2 || 'LB'}.svg`"
                                            :alt="selectedCountry.name || 'Lebanon'" width="20" height="20" />
                                        <span>+{{ selectedCountry.code || '961' }}</span>
                                    </div>
                                </div>
                                <input v-model="form.personal_information_code" type="hidden" id="code">
                                <div v-if="errors.personal_information_code" class="text-xs text-red-500">{{
                                    errors.personal_information_code }}</div>
                            </div>

                            <ul v-if="showDropdown" ref="dropdownContainer" @scroll="handleScroll"
                                class="dropdown-container shadow-black/20 shadow-md absolute top-full left-0 w-full max-h-[200px] text-sm rounded-xl bg-white text-black mt-2 overflow-auto z-50">
                                <input v-model="searchQuery" type="text" id="search" placeholder="Search"
                                    class="sticky top-0 left-0 w-full bg-white px-4 py-2 border-b border-b-[#D4D4D4] outline-0 z-10">
                                <template v-for="country in filteredCountries">
                                    <li v-if="country.status == 1" :key="country.id" @click="selectCountry(country)"
                                        class="flex gap-2 text-black p-2 hover:bg-[#D4D4D4] cursor-pointer">
                                        <NuxtImg loading="lazy" :src="`/images/flags/${country.iso2}.svg`"
                                            :alt="country.name" width="20" height="20" />
                                        <span class="text-xs text-[#73788B]">(+{{ country.code }})</span>
                                        <span class="text-xs">{{ country.name }}</span>
                                    </li>
                                </template>
                            </ul>

                            <div class="flex flex-col gap-1 w-full">
                                <input v-model="form.personal_information_phone_number" type="text" id="phone_number"
                                    placeholder="Phone Number"
                                    class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none"
                                    @keydown="allowOnlyNumbers"@input="form.personal_information_phone_number = numbersOnly($event.target.value)"
                                >
                                <div v-if="touched.personal_information_phone_number && errors.personal_information_phone_number"
                                    class="text-xs text-red-500">{{ errors.personal_information_phone_number }}</div>
                            </div>
                        </div>
                        <!-- <input type="text" placeholder="Mobile Number" id="full-name" class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none"> -->
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="first_name" class="text-base">First Name</label>
                        <input v-model="form.personal_information_first_name" type="text" placeholder="First Name"
                            id="first_name"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.personal_information_first_name && errors.personal_information_first_name"
                            class="text-xs text-red-500">{{ errors.personal_information_first_name }}</div>
                    </div>
                    <div class="flex flex-col gap-1 w-full">
                        <label for="last_name" class="text-base">Last Name</label>
                        <input v-model="form.personal_information_last_name" type="text" placeholder="Last Name"
                            id="last_name"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.personal_information_last_name && errors.personal_information_last_name"
                            class="text-xs text-red-500">{{ errors.personal_information_last_name }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full h-full">
                        <div class="flex flex-col gap-1 w-full">
                            <label for="mother_name" class="text-base">Mother's Full Name</label>
                            <input v-model="form.personal_information_mother_name" type="text"
                                placeholder="Mother's Full Name" id="mother_name"
                                class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <div v-if="touched.personal_information_mother_name && errors.personal_information_mother_name"
                                class="text-xs text-red-500">{{ errors.personal_information_mother_name }}</div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1 w-full h-full">
                        <div class="flex flex-col gap-1 w-full">
                            <label for="father_name" class="text-base">Father's Name</label>
                            <input v-model="form.personal_information_father_name" type="text"
                                placeholder="Father's Name" id="father_name"
                                class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <div v-if="touched.personal_information_father_name && errors.personal_information_father_name"
                                class="text-xs text-red-500">{{ errors.personal_information_father_name }}</div>
                        </div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="gender" class="text-base">Gender</label>
                        <select v-model="form.personal_information_gender" name="gender" id="gender"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <option value="" disabled class="text-[#ECECEE]">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <div v-if="touched.personal_information_gender && errors.personal_information_gender"
                            class="text-xs text-red-500">{{ errors.personal_information_gender }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="nationality" class="text-base">Nationality</label>
                        <select v-model="form.personal_information_nationality_id" name="nationality" id="nationality"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <option value="" disabled>Select</option>
                            <option v-for="country in countriesData" :key="country.id" :value="country.id">{{
                                country.name }}
                            </option>
                        </select>
                        <div v-if="touched.personal_information_nationality_id && errors.personal_information_nationality_id"
                            class="text-xs text-red-500">{{ errors.personal_information_nationality_id }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="dob" class="text-base">Date of Birth</label>
                        <input v-model="form.personal_information_dob" type="date" id="dob"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.personal_information_dob && errors.personal_information_dob"
                            class="text-xs text-red-500">{{
                                errors.personal_information_dob }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="marital_status" class="text-base">Marital Status</label>
                        <select v-model="form.personal_information_marital_status" name="marital_status"
                            id="marital_status"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                            <option value="" disabled class="text-[#ECECEE]">Select</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                        <div v-if="touched.personal_information_marital_status && errors.personal_information_marital_status"
                            class="text-xs text-red-500">{{ errors.personal_information_marital_status }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="number_of_dependents" class="text-base">Number of Dependents</label>
                        <input v-model="form.personal_information_number_of_dependents" type="text"
                            placeholder="Number of Dependents" id="number_of_dependents"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.personal_information_number_of_dependents && errors.personal_information_number_of_dependents"
                            class="text-xs text-red-500">{{ errors.personal_information_number_of_dependents }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">
                        <label for="register_number" class="text-base">Register Number</label>
                        <input v-model="form.personal_information_register_number" type="text"
                            placeholder="Register Number" id="register_number"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none"
                            @input="form.personal_information_register_number = numbersOnly($event.target.value)"
                        >
                        <div v-if="touched.personal_information_register_number && errors.personal_information_register_number"
                            class="text-xs text-red-500">{{ errors.personal_information_register_number }}</div>
                    </div>
                </div>

                <div class="flex max-lg:flex-col gap-4 justify-between items-start">
                    <div class="flex flex-col gap-1 w-full">
                        <label for="register_place" class="text-base">Register Place</label>
                        <input v-model="form.personal_information_register_place" type="text"
                            placeholder="Register Place" id="register_place"
                            class="w-full h-full min-h-14 py-3 px-3 bg-white border border-[#D4D4D4] rounded-lg outline-none">
                        <div v-if="touched.personal_information_register_place && errors.personal_information_register_place"
                            class="text-xs text-red-500">{{ errors.personal_information_register_place }}</div>
                    </div>

                    <div class="flex flex-col gap-1 w-full">

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCountry } from '~/composables/useCountry'
import { numbersOnly } from '~/utils/numbersOnly'

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

const showDropdown = ref(false)
const searchQuery = ref('')
const dropdownContainer = ref(null)
const filteredCountries = ref([])
const lastLoadedIndex = ref(0)

onMounted(async () => {
  await detectCountry()

  // 🔹 Phone default (always)
  if (selectedCountry.value) {
    form.personal_information_code = selectedCountry.value.code

    // 🔹 Nationality default (ONLY if empty)
    if (!form.personal_information_nationality_id) {
      form.personal_information_nationality_id = selectedCountry.value.id
    }
  }

  // 🔹 Dropdown initial load (KEEP THIS)
  if (countriesData.length) {
    loadNext()
  }
})


const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const selectCountry = (country) => {
    selectedCountry.value = country
    form.personal_information_code = country.code
    showDropdown.value = false
}

const loadNext = () => {
    const batch = countriesData.slice(lastLoadedIndex.value, lastLoadedIndex.value + 10)
    filteredCountries.value.push(...batch)
    lastLoadedIndex.value += 10
}

const handleScroll = () => {
    const el = dropdownContainer.value
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        loadNext()
    }
}

watch(searchQuery, (q) => {
    if (!q) {
        filteredCountries.value = []
        lastLoadedIndex.value = 0
        loadNext()
        return
    }

    filteredCountries.value = countriesData.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase())
    )
})
</script>

<style lang="sass" scoped>
    .dropdown 
        @apply absolute z-50 bg-white shadow-md rounded-xl max-h-52 overflow-auto w-full mt-2


    .dropdown-item 
        @apply p-2 flex gap-2 cursor-pointer hover:bg-gray-100


    .dropdown-search 
        @apply sticky top-0 w-full px-3 py-2 border-b outline-none

</style>
