<script setup lang="ts">
// Emplacement photo stylisé, en attendant les vraies photos de l'atelier.
// Rendu façon planche de dessin technique (repères d'angle + motif + légende).
// NB : à remplacer par de vraies photographies de L'Établi.
const props = withDefaults(
  defineProps<{
    subject?: string
    caption?: string
    annotation?: string
    tone?: 'charbon' | 'terracotta' | 'creme'
    ratio?: string
  }>(),
  { subject: 'wheel', tone: 'charbon', ratio: 'aspect-[4/3]' },
)

const toneClasses = computed(() => {
  switch (props.tone) {
    case 'terracotta':
      return 'bg-terracotta text-creme'
    case 'creme':
      return 'bg-creme-200 text-charbon'
    default:
      return 'bg-charbon text-creme'
  }
})
</script>

<template>
  <figure
    class="group relative overflow-hidden rounded-2xl ring-1 ring-charbon/10"
    :class="[toneClasses, ratio]"
  >
    <!-- Trame technique -->
    <div class="blueprint-grid absolute inset-0 opacity-[0.14]" aria-hidden="true" />

    <!-- Repères d'angle (dessin technique) -->
    <span class="absolute left-3 top-3 h-4 w-4 border-l border-t border-current opacity-40" aria-hidden="true" />
    <span class="absolute right-3 top-3 h-4 w-4 border-r border-t border-current opacity-40" aria-hidden="true" />
    <span class="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-current opacity-40" aria-hidden="true" />
    <span class="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-current opacity-40" aria-hidden="true" />

    <!-- Motif central -->
    <div class="absolute inset-0 grid place-items-center">
      <TechIcon
        :name="subject"
        :size="96"
        :stroke-width="1"
        class="opacity-70 transition-transform duration-500 group-hover:scale-105"
      />
    </div>

    <figcaption
      v-if="caption || annotation"
      class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4"
    >
      <span
        v-if="caption"
        class="rounded-full bg-current/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
      >
        <span class="opacity-90">{{ caption }}</span>
      </span>
      <span v-if="annotation" class="font-mono text-[0.65rem] uppercase tracking-widest opacity-50">
        {{ annotation }}
      </span>
    </figcaption>
  </figure>
</template>
