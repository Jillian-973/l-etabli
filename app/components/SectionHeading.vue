<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    intro?: string
    center?: boolean
    as?: string
  }>(),
  { center: false, as: 'h2' },
)
</script>

<template>
  <div :class="['max-w-2xl', center && 'mx-auto text-center']">
    <p
      v-if="eyebrow"
      class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-700"
      :class="center && 'justify-center'"
    >
      <span class="inline-block h-px w-6 bg-terracotta" aria-hidden="true" />
      {{ eyebrow }}
    </p>
    <component
      :is="as"
      class="mt-3 text-3xl font-bold leading-[1.1] text-charbon sm:text-4xl"
    >
      {{ title }}
    </component>
    <p v-if="intro" class="mt-4 text-lg leading-relaxed text-charbon/70">
      {{ intro }}
    </p>
  </div>
</template>
