<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'

const isShowing = ref(true)
const numbers = ref([])
const numberArray = ref(Array.from({ length: 10 }, (e, i) => i + 1))
const trans = ref(null)
function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function resetIsShowing() {
  for (let i = 0; i < numberArray.value.length; i++) {
    const index = Math.floor(Math.random() * numberArray.value.length)
    await sleep(800)

    isShowing.value = false

    setTimeout(() => {
      isShowing.value = true
    }, 500)

    numbers.value = numberArray.value.filter(r => r === (index + 1))
  }
}
</script>

<template>
  <div class="flex flex-col items-center py-16">
    <div class="h-72 w-72">
      <div class="flex justify-center items-center w-full h-full p-4 text-9xl rounded-md shadow-lg border-solid border-2 border-sky-500">
        <TransitionRoot
          appear
          :show="isShowing"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-y-full opacity-0"
          enter-to="translate-y-0 opacity-100"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-y-0 opacity-100"
          leave-to="translate-y-full opacity-0"
          ref="trans"
        >
          <div v-for="number in numbers" :key="number.id" class="h-full w-full rounded-md bg-green-500 shadow-lg">
            {{ number }}
          </div>
        </TransitionRoot>
      </div>
    </div>
    <button
      class="mt-8 flex transform items-center rounded-full bg-black bg-opacity-20 px-3 py-2 text-sm font-medium text-white transition hover:scale-105 hover:bg-opacity-30 focus:outline-none active:bg-opacity-40"
      @click="resetIsShowing"
    >
      <svg viewBox="0 0 20 20" fill="none" class="h-5 w-5 opacity-70">
        <path
          d="M14.9497 14.9498C12.2161 17.6835 7.78392 17.6835 5.05025 14.9498C2.31658 12.2162 2.31658 7.784 5.05025 5.05033C7.78392 2.31666 12.2161 2.31666 14.9497 5.05033C15.5333 5.63385 15.9922 6.29475 16.3266 7M16.9497 2L17 7H16.3266M12 7L16.3266 7"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>

      <span class="ml-3">Click to transition</span>
    </button>
  </div>
</template>

<style scoped lang="scss">

</style>
