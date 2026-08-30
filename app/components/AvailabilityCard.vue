<script setup lang="ts">
import type { WorkshopSession } from '~/utils/content'

const props = defineProps<{ session: WorkshopSession }>()

const isFull = computed(() => props.session.spotsLeft <= 0)
const spotsLabel = computed(() =>
  isFull.value
    ? 'Complet'
    : `${props.session.spotsLeft} / ${props.session.spotsTotal} places disponibles`,
)
</script>

<template>
  <article
    class="flex h-full flex-col rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 transition-shadow duration-300 hover:shadow-[0_16px_40px_-24px_rgba(32,35,31,0.5)]"
  >
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-widest text-terracotta-700">
          {{ session.theme }}
        </p>
        <h3 class="mt-1 text-lg font-bold leading-tight text-charbon">
          <time :datetime="session.isoDate">{{ session.dateLabel }}</time>
        </h3>
        <p class="mt-0.5 flex items-center gap-1.5 text-charbon/70">
          <TechIcon name="clock" :size="16" />
          <span class="tabular-nums">{{ session.timeRange }}</span>
        </p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-charbon/5 px-2.5 py-1 text-xs font-medium text-charbon"
      >
        <TechIcon name="compass" :size="14" />
        {{ session.level }}
      </span>
    </div>

    <!-- Disponibilité (repère visuel + texte, jamais couleur seule) -->
    <div class="mt-4">
      <div
        class="flex items-center gap-1"
        :aria-label="spotsLabel"
        role="img"
      >
        <span
          v-for="i in session.spotsTotal"
          :key="i"
          class="h-1.5 flex-1 rounded-full"
          :class="i <= (session.spotsTotal - session.spotsLeft) ? 'bg-charbon/20' : 'bg-terracotta'"
          aria-hidden="true"
        />
      </div>
      <p class="mt-2 flex items-center gap-1.5 text-sm text-charbon/70">
        <TechIcon name="users" :size="16" />
        <span :class="isFull && 'font-semibold text-charbon'">{{ spotsLabel }}</span>
      </p>
    </div>

    <div class="mt-5 flex-1" />

    <UButton
      to="/atelier-participatif/reserver"
      :color="isFull ? 'neutral' : 'primary'"
      :variant="isFull ? 'subtle' : 'solid'"
      :disabled="isFull"
      size="lg"
      block
      class="font-semibold"
    >
      {{ isFull ? 'Session complète' : 'Réserver ma place' }}
    </UButton>
  </article>
</template>
