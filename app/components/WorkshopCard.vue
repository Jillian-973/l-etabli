<script setup lang="ts">
// Carte générique atelier / caractéristique (icône + titre + texte).
withDefaults(
  defineProps<{
    icon?: string
    title: string
    text?: string
    accent?: boolean
  }>(),
  { icon: 'gear', accent: false },
)
</script>

<template>
  <div
    class="flex h-full flex-col rounded-2xl p-5 ring-1 transition-colors"
    :class="accent
      ? 'bg-terracotta text-creme ring-terracotta'
      : 'bg-creme-50 text-charbon ring-charbon/10'"
  >
    <span
      class="grid size-11 place-items-center rounded-xl"
      :class="accent ? 'bg-creme/15 text-creme' : 'bg-terracotta/10 text-terracotta'"
      aria-hidden="true"
    >
      <TechIcon :name="icon" :size="24" />
    </span>
    <h3 class="mt-4 text-base font-bold">{{ title }}</h3>
    <p
      v-if="text"
      class="mt-1.5 text-sm leading-relaxed"
      :class="accent ? 'text-creme/85' : 'text-charbon/70'"
    >
      {{ text }}
    </p>
    <slot />
  </div>
</template>
