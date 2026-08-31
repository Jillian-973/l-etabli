<script setup lang="ts">
useSeoMeta({
  title: 'Réserver un atelier participatif | L\'Établi',
  description:
    "Réservez votre place à un atelier participatif : 8 places par session, tous niveaux, outils fournis.",
})

const sessions = useUpcomingSessions(4)
const capacityNote = computed(
  () => `${capacity.workshopsPerWeek} ateliers par semaine · ${capacity.seatsPerWorkshop} places chacun`,
)
</script>

<template>
  <div>
    <PageHero
      eyebrow="Atelier participatif"
      title="Réserver ma place"
      intro="Choisissez une session : on vous confirme votre place et le nécessaire à apporter."
      icon="calendar"
      :crumbs="[{ label: 'Apprendre', to: '/atelier-participatif' }, { label: 'Réserver' }]"
    />

    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <!-- Widget de réservation -->
        <div>
          <BookingWidget
            title="Réserver une session"
            :capacity-note="capacityNote"
            note="La réservation de session (via Calendly) sera intégrée ici. En attendant, réservez en un message ou par téléphone."
          >
            <template #fallback>
              <UButton :to="contact.phoneHref" color="primary" size="lg" class="font-semibold">
                <template #leading><TechIcon name="phone" :size="18" /></template>
                Appeler l'atelier
              </UButton>
              <UButton
                :to="contact.instagramHref"
                target="_blank"
                color="neutral"
                variant="outline"
                size="lg"
                class="font-semibold"
              >
                <template #leading><TechIcon name="instagram" :size="18" /></template>
                Écrire sur Instagram
              </UButton>
            </template>
          </BookingWidget>

          <div class="mt-6 rounded-2xl bg-charbon p-6 text-creme">
            <h2 class="flex items-center gap-2 text-lg font-bold">
              <TechIcon name="check" :size="20" class="text-terracotta-300" />
              Ce qu'il faut apporter
            </h2>
            <ul class="mt-3 space-y-2 text-creme/85">
              <li>Votre vélo (celui à réparer)</li>
              <li>De quoi être à l'aise pour bricoler</li>
              <li>Rien d'autre : l'outillage est fourni sur place</li>
            </ul>
          </div>
        </div>

        <!-- Sessions à venir (référence) -->
        <aside>
          <h2 class="text-lg font-bold text-charbon">Sessions à venir</h2>
          <ul class="mt-4 space-y-3">
            <li
              v-for="session in sessions"
              :key="session.id"
              class="flex items-center justify-between gap-4 rounded-xl bg-creme-50 p-4 ring-1 ring-charbon/10"
            >
              <div>
                <p class="font-semibold text-charbon">
                  <time :datetime="session.isoDate">{{ session.dateLabel }}</time>
                </p>
                <p class="text-sm text-charbon/60 tabular-nums">
                  {{ session.timeRange }} · {{ session.level }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full bg-terracotta/10 px-2.5 py-1 text-xs font-medium text-terracotta-700"
              >
                {{ session.spotsLeft > 0 ? `${session.spotsLeft} places` : 'Complet' }}
              </span>
            </li>
          </ul>
          <p class="mt-4 text-sm text-charbon/60">
            Places indicatives, confirmées à la réservation.
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>
