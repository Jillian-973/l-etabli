<script setup lang="ts">
interface Crumb {
  label: string
  to?: string
}
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    intro?: string
    crumbs?: Crumb[]
    icon?: string
  }>(),
  { crumbs: () => [] },
)
</script>

<template>
  <section class="relative overflow-hidden border-b border-charbon/10">
    <div class="blueprint-grid absolute inset-0 opacity-30" aria-hidden="true" />
    <TechIcon
      v-if="icon"
      :name="icon"
      :size="320"
      :stroke-width="0.7"
      class="pointer-events-none absolute -right-16 -top-10 hidden text-terracotta/10 sm:block"
    />
    <div class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <!-- Fil d'Ariane -->
      <nav v-if="crumbs.length" aria-label="Fil d'Ariane">
        <ol class="flex flex-wrap items-center gap-1.5 text-sm text-charbon/60">
          <li>
            <NuxtLink to="/" class="hover:text-terracotta">Accueil</NuxtLink>
          </li>
          <li v-for="crumb in crumbs" :key="crumb.label" class="flex items-center gap-1.5">
            <TechIcon name="chevronDown" :size="14" class="-rotate-90 opacity-50" />
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
              class="hover:text-terracotta"
            >{{ crumb.label }}</NuxtLink>
            <span v-else class="font-medium text-charbon" aria-current="page">{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>

      <p
        v-if="eyebrow"
        class="mt-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-terracotta-700"
      >
        <span class="inline-block h-px w-6 bg-terracotta" aria-hidden="true" />
        {{ eyebrow }}
      </p>
      <h1 class="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] text-charbon sm:text-5xl">
        {{ title }}
      </h1>
      <p v-if="intro" class="mt-5 max-w-2xl text-lg leading-relaxed text-charbon/75">
        {{ intro }}
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
