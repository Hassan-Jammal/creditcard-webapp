import countriesData from '~/data/countries.json';

export const useCountry = () => { // (manualSelection)
    const selectedCountry = ref({});
    const countryIsEU = ref(false);
    const initialCode = ref(''); // Store the initial value
    const errors = ref({ country: null });
    const router = useRouter();

    const detectCountry = async () => {
        try {
            const response = await fetch('/api/geoip');
            const data = await response.json();
            
            if (data && data.country) {
                const detectedCountry = countriesData.find(country => country.iso2 === data.country);
                
                if (detectedCountry) {
                    if (!selectedCountry.value || !selectedCountry.value.iso2) {
                        countryIsEU.value = detectedCountry.is_eu;
                        selectedCountry.value = detectedCountry;
                        initialCode.value = detectedCountry.code;
                        // console.log(selectedCountry.value)
                    }
                } else {
                    // console.warn('Detected country not found in countries data');
                }
            } else {
                errors.value.country = 'No country data found';
            }
        } catch (error) {
            errors.value.country = 'Unable to detect country';
            // console.error('Error detecting country:', error);
        }
    };

    return {
        countriesData,
        selectedCountry,
        countryIsEU,
        initialCode,
        errors,
        detectCountry,
    };
};
