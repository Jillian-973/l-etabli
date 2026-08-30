<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
  }>(),
  { eyebrow: 'Atelier vélo indépendant' },
)
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Fond dessin technique très discret -->
    <div class="blueprint-grid absolute inset-0 opacity-40" aria-hidden="true" />
    <div
      class="pointer-events-none absolute -right-24 -top-24 hidden text-terracotta/10 lg:block"
      aria-hidden="true"
    >
      <TechIcon name="wheel" :size="480" :stroke-width="0.6" />
    </div>

    <div class="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
      <!-- Texte -->
      <div>
        <p
          v-reveal
          class="inline-flex items-center gap-2 rounded-full bg-charbon/5 px-3 py-1.5 text-sm font-medium text-charbon/80"
        >
          <span class="size-2 rounded-full bg-terracotta" aria-hidden="true" />
          {{ eyebrow }}
        </p>

        <h1
          v-reveal="1"
          class="mt-5 text-[2.6rem] font-bold leading-[1.02] tracking-tight text-charbon sm:text-6xl"
        >
          {{ title }}
        </h1>

        <p
          v-if="subtitle"
          v-reveal="2"
          class="mt-5 max-w-md text-lg leading-relaxed text-charbon/75 sm:text-xl"
        >
          {{ subtitle }}
        </p>

        <div v-reveal="3" class="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <slot name="actions" />
        </div>
      </div>

      <!-- Visuel : composition éditoriale de "planches" atelier -->
      <div v-reveal="2" class="relative">
        <div class="grid grid-cols-5 grid-rows-6 gap-3">
          <div class="col-span-5 row-span-4">
            <PhotoFrame
              subject="hand"
              tone="charbon"
              caption="Réparation à l'atelier"
              annotation="fig. 01"
              ratio="aspect-[16/11]"
            />
          </div>
          <div class="col-span-3 row-span-2">
            <PhotoFrame
              subject="gear"
              tone="terracotta"
              annotation="fig. 02"
              ratio="aspect-[3/2]"
            />
          </div>
          <div class="col-span-2 row-span-2">
            <PhotoFrame
              subject="chain"
              tone="creme"
              annotation="fig. 03"
              ratio="aspect-[3/2]"
            />
          </div>
        </div>

        <!-- Étiquette flottante façon note manuscrite -->
        <div
          class="absolute -left-3 bottom-6 hidden rotate-[-4deg] rounded-xl bg-creme px-4 py-3 shadow-lg ring-1 ring-charbon/10 sm:block"
        >
          <p class="flex items-center gap-2 text-sm font-semibold text-charbon">
            <TechIcon name="hand" :size="20" class="text-terracotta" />
            Fait avec vous, pas à votre place.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
