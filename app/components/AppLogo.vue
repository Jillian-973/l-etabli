<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <NuxtLink
    to="/"
    class="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none"
    aria-label="L'Établi, retour à l'accueil"
  >
    <!-- Marque : engrenage stylisé façon estampille d'atelier -->
    <span
      class="grid place-items-center rounded-full bg-charbon text-creme transition-transform duration-300 group-hover:-rotate-45"
      :class="compact ? 'size-8' : 'size-10'"
    >
      <TechIcon name="gear" :size="compact ? 18 : 22" :stroke-width="1.9" />
    </span>
    <span
      class="font-bold leading-none tracking-tight text-charbon"
      :class="compact ? 'text-lg' : 'text-xl'"
      translate="no"
    >L'Établi</span>
  </NuxtLink>
</template>
