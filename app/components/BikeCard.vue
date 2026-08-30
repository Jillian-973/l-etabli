<script setup lang="ts">
// La section vélos d'occasion n'est pas encore disponible : pas de faux produit.
// Ce composant sert d'aperçu du futur format (état « à venir »), et pourra
// accueillir de vraies fiches quand le stock existera.
interface Bike {
  slug: string
  name: string
  type: string
  size?: string
  condition?: string
}
withDefaults(
  defineProps<{
    bike?: Bike
    placeholder?: boolean
  }>(),
  { placeholder: true },
)
</script>

<template>
  <!-- Mode aperçu / à venir -->
  <div
    v-if="placeholder || !bike"
    class="flex flex-col overflow-hidden rounded-2xl bg-creme-50 ring-1 ring-charbon/10"
    aria-hidden="true"
  >
    <div class="relative aspect-[4/3] bg-charbon/5">
      <div class="blueprint-grid absolute inset-0 opacity-[0.12]" />
      <div class="absolute inset-0 grid place-items-center">
        <TechIcon name="wheel" :size="64" :stroke-width="1" class="text-charbon/25" />
      </div>
      <span
        class="absolute left-3 top-3 rounded-full bg-charbon/80 px-2.5 py-1 text-xs font-medium text-creme"
      >
        Bientôt
      </span>
    </div>
    <div class="space-y-2.5 p-5">
      <div class="h-4 w-2/3 rounded-full bg-charbon/10" />
      <div class="h-3 w-1/2 rounded-full bg-charbon/10" />
      <div class="h-3 w-1/3 rounded-full bg-charbon/10" />
    </div>
  </div>

  <!-- Mode fiche réelle (usage futur) -->
  <NuxtLink
    v-else
    :to="`/velos-occasion/${bike.slug}`"
    class="group flex flex-col overflow-hidden rounded-2xl bg-creme-50 ring-1 ring-charbon/10 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(32,35,31,0.5)]"
  >
    <PhotoFrame subject="wheel" tone="charbon" ratio="aspect-[4/3]" />
    <div class="p-5">
      <h3 class="text-lg font-bold text-charbon">{{ bike.name }}</h3>
      <p class="mt-1 text-sm text-charbon/70">
        {{ bike.type }}<template v-if="bike.size"> · {{ bike.size }}</template>
      </p>
      <p v-if="bike.condition" class="mt-2 text-sm text-charbon/60">{{ bike.condition }}</p>
    </div>
  </NuxtLink>
</template>
