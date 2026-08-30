<script setup lang="ts">
// Abstraction de réservation : prête à recevoir Calendly (ou autre) sans que
// le reste de l'interface ne dépende du fournisseur.
// Tant qu'aucune URL n'est fournie, on affiche un aperçu clair du créneau.
const props = withDefaults(
  defineProps<{
    title?: string
    /** URL d'embed du fournisseur (ex. Calendly). Vide = mode aperçu. */
    url?: string
    provider?: string
    note?: string
    /** Rappel des capacités affiché sous le widget */
    capacityNote?: string
  }>(),
  { provider: 'calendly', title: 'Choisir un créneau' },
)

const hasEmbed = computed(() => Boolean(props.url))
</script>

<template>
  <div class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-7">
    <div class="flex items-center gap-3">
      <span class="grid size-11 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
        <TechIcon name="calendar" :size="24" />
      </span>
      <div>
        <h2 class="text-lg font-bold text-charbon">{{ title }}</h2>
        <p v-if="capacityNote" class="text-sm text-charbon/60">{{ capacityNote }}</p>
      </div>
    </div>

    <!-- Embed réel (quand l'URL sera configurée) -->
    <div v-if="hasEmbed" class="mt-5 overflow-hidden rounded-xl ring-1 ring-charbon/10">
      <iframe
        :src="url"
        :title="`Réservation — ${provider}`"
        class="h-[640px] w-full"
        loading="lazy"
      />
    </div>

    <!-- Mode aperçu (avant branchement Calendly) -->
    <div v-else class="mt-5">
      <div
        class="relative overflow-hidden rounded-xl border border-dashed border-charbon/25 bg-creme p-6 text-center"
      >
        <div class="blueprint-grid absolute inset-0 opacity-[0.12]" aria-hidden="true" />
        <div class="relative">
          <span class="inline-grid size-12 place-items-center rounded-full bg-charbon/5 text-charbon">
            <TechIcon name="calendar" :size="26" />
          </span>
          <p class="mt-3 font-semibold text-charbon">
            La réservation en ligne arrive très bientôt.
          </p>
          <p class="mx-auto mt-1.5 max-w-sm text-sm text-charbon/65">
            {{ note ?? 'Le calendrier de prise de rendez-vous sera intégré ici. En attendant, réservez en un message ou par téléphone.' }}
          </p>
          <div class="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
            <slot name="fallback" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
