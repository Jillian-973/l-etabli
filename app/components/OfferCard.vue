<script setup lang="ts">
interface Fact {
  icon: string
  label: string
}
const props = withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    description: string
    icon?: string
    facts?: Fact[]
    ctaLabel: string
    ctaTo: string
    photoSubject?: string
    photoCaption?: string
    featured?: boolean
  }>(),
  { icon: 'wrench', facts: () => [], featured: false },
)
</script>

<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-3xl bg-creme-50 ring-1 transition-shadow duration-300 hover:shadow-[0_20px_50px_-24px_rgba(32,35,31,0.45)]"
    :class="featured ? 'ring-terracotta/40' : 'ring-charbon/10'"
  >
    <!-- Visuel -->
    <div class="p-3">
      <PhotoFrame
        :subject="photoSubject ?? icon"
        :tone="featured ? 'terracotta' : 'charbon'"
        :caption="photoCaption"
        ratio="aspect-[16/10]"
      />
    </div>

    <div class="flex flex-1 flex-col p-6 pt-3 sm:p-7 sm:pt-3">
      <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-terracotta-700">
        <TechIcon :name="icon" :size="18" />
        {{ eyebrow }}
      </p>
      <h3 class="mt-2 text-2xl font-bold text-charbon">{{ title }}</h3>
      <p class="mt-3 leading-relaxed text-charbon/70">{{ description }}</p>

      <ul v-if="facts.length" class="mt-5 space-y-2.5">
        <li
          v-for="fact in facts"
          :key="fact.label"
          class="flex items-start gap-2.5 text-charbon/85"
        >
          <TechIcon :name="fact.icon" :size="20" class="mt-0.5 shrink-0 text-terracotta" />
          <span>{{ fact.label }}</span>
        </li>
      </ul>

      <div class="mt-7 pt-1">
        <UButton
          :to="ctaTo"
          :color="featured ? 'primary' : 'neutral'"
          :variant="featured ? 'solid' : 'outline'"
          size="xl"
          block
          class="font-semibold"
        >
          {{ ctaLabel }}
          <template #trailing>
            <TechIcon name="arrowRight" :size="20" />
          </template>
        </UButton>
      </div>
    </div>
  </article>
</template>
