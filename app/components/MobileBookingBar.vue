<script setup lang="ts">
const route = useRoute()
// Inutile sur les pages de réservation elles-mêmes.
const hidden = computed(() => route.path.includes('/reserver'))
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
  >
    <div
      v-if="!hidden"
      class="fixed inset-x-0 bottom-0 z-30 border-t border-charbon/10 bg-creme/95 backdrop-blur lg:hidden"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="mx-auto flex max-w-6xl gap-2 px-3 py-2.5">
        <UButton
          to="/reparation/reserver"
          color="primary"
          size="lg"
          block
          class="font-semibold"
        >
          Confier mon vélo
        </UButton>
        <UButton
          to="/atelier-participatif"
          color="neutral"
          variant="outline"
          size="lg"
          block
          class="font-semibold"
        >
          Apprendre
        </UButton>
      </div>
    </div>
  </Transition>
</template>
