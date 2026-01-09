<!-- components/ScrollButton.vue -->
<template>
    <button @click="handleClick">
        <slot />
    </button>
</template>

<script setup>
    import { useScrollToSection } from '~/composables/useScrollToSection';

    const props = defineProps({
        target: {
            type: String,
            required: true
        }
    });

    const { scrollToSection } = useScrollToSection();

    const handleClick = () => {
        scrollToSection(props.target);
    };
</script>

<style lang="sass" scoped>

</style>