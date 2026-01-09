<template>
    <div :class="['py-4', bg === true ? 'px-4 bg-[#F7F7F7] rounded-3xl' : 'bg-transparent border-b last:border-0']">
        <div class="cursor-pointer flex items-center gap-4 justify-between font-bold text-xl" @click="toggle()">
            <span class="text-gray-500 text-lg whitespace-nowrap">{{ title }}</span>

            <Icon :name="isOpen ? 'fa7-solid:chevron-up' : 'fa7-solid:chevron-down'"
                class="icon text-gray-500 text-sm transition-transform duration-300 ease-in-out" />
        </div>

        <transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
            <div v-if="isOpen" class="overflow-hidden text-gray-500 text-lg">
                <div class="h-2 w-full"></div>
                <slot />
            </div>
        </transition>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    bg: {
        type: Boolean,
        required: true
    }
})

const isOpen = ref(false)

const toggle = () => {
    isOpen.value = !isOpen.value
}

const beforeEnter = (el) => {
    el.style.height = '0';
}

const enter = (el, done) => {
    el.style.transition = 'height 0.3s ease';
    el.style.height = `${el.scrollHeight}px`;
    el.addEventListener('transitionend', done, { once: true });
}

const beforeLeave = (el) => {
    el.style.height = `${el.scrollHeight}px`;
}

const leave = (el, done) => {
    el.style.transition = 'height 0.3s ease';
    setTimeout(() => {
        el.style.height = '0';
    });
    el.addEventListener('transitionend', done, { once: true });
}
</script>

<style lang="sass" scoped>
    .content 
        overflow: hidden
</style>
