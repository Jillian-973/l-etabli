<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    text?: string
    primaryLabel: string
    primaryTo: string
    secondaryLabel?: string
    secondaryTo?: string
    icon?: string
  }>(),
  { icon: 'wrench' },
)
</script>

<template>
  <section class="mx-auto max-w-6xl px-4 sm:px-6">
    <div
      v-reveal
      class="relative overflow-hidden rounded-3xl bg-charbon px-6 py-12 text-creme sm:px-12 sm:py-14"
    >
      <div class="blueprint-grid absolute inset-0 opacity-[0.10]" aria-hidden="true" />
      <TechIcon
        :name="icon"
        :size="220"
        :stroke-width="0.8"
        class="pointer-events-none absolute -right-10 -top-10 text-creme/10"
      />
      <div class="relative max-w-xl">
        <h2 class="text-2xl font-bold sm:text-3xl">{{ title }}</h2>
        <p v-if="text" class="mt-3 text-creme/75">{{ text }}</p>
        <div class="mt-7 flex flex-col gap-3 sm:flex-row">
          <UButton :to="primaryTo" color="primary" size="xl" class="font-semibold">
            {{ primaryLabel }}
            <template #trailing>
              <TechIcon name="arrowRight" :size="20" />
            </template>
          </UButton>
          <UButton
            v-if="secondaryLabel && secondaryTo"
            :to="secondaryTo"
            color="neutral"
            variant="ghost"
            size="xl"
            class="font-semibold text-creme hover:bg-creme/10"
          >
            {{ secondaryLabel }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>
