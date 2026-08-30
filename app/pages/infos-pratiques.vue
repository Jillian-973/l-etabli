<script setup lang="ts">
useSeoMeta({
  title: 'Infos pratiques — L\'Établi',
  description:
    "Adresse, horaires, téléphone, Instagram et accès de L'Établi. Toutes les infos pour venir à l'atelier et réserver.",
})

const access = [
  { icon: 'compass', title: 'À vélo', text: 'Arceaux de stationnement devant l’atelier.' },
  { icon: 'pin', title: 'En transports', text: 'Arrêt de bus et métro à quelques minutes à pied.' },
  { icon: 'users', title: 'À pied', text: 'En plein cœur du quartier, entrée de plain-pied.' },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Infos pratiques"
      title="Venir à l'atelier"
      intro="Tout ce qu'il faut savoir pour nous trouver, nous joindre et réserver."
      icon="pin"
      :crumbs="[{ label: 'Infos pratiques' }]"
    />

    <!-- Contact + horaires -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <ContactBlock variant="full" />
    </section>

    <!-- Accès + carte -->
    <section class="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeading eyebrow="Accès" title="Comment venir" />
          <div class="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div
              v-for="a in access"
              :key="a.title"
              class="flex items-start gap-3 rounded-2xl bg-creme-50 p-4 ring-1 ring-charbon/10"
            >
              <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
                <TechIcon :name="a.icon" :size="22" />
              </span>
              <div>
                <p class="font-semibold text-charbon">{{ a.title }}</p>
                <p class="text-sm text-charbon/70">{{ a.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Carte (placeholder cohérent) -->
        <div>
          <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-charbon ring-1 ring-charbon/10">
            <div class="blueprint-grid absolute inset-0 opacity-20" aria-hidden="true" />
            <div class="absolute inset-0 grid place-items-center text-creme">
              <div class="text-center">
                <TechIcon name="pin" :size="48" class="mx-auto text-terracotta-300" />
                <p class="mt-3 font-semibold">{{ contact.address.street }}</p>
                <p class="text-creme/70">{{ contact.address.zip }} {{ contact.address.city }}</p>
              </div>
            </div>
          </div>
          <UButton
            :to="contact.mapsHref"
            target="_blank"
            color="neutral"
            variant="outline"
            block
            size="lg"
            class="mt-3 font-semibold"
          >
            <template #leading><TechIcon name="pin" :size="18" /></template>
            Ouvrir dans un plan
          </UButton>
        </div>
      </div>
    </section>

    <!-- Réserver rapidement -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading eyebrow="Réserver" title="Deux façons de prendre rendez-vous" center />
      <div class="mt-8 grid gap-5 sm:grid-cols-2">
        <div class="flex flex-col rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10">
          <span class="grid size-11 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="wrench" :size="24" />
          </span>
          <h3 class="mt-4 text-lg font-bold text-charbon">Faire réparer mon vélo</h3>
          <p class="mt-1.5 flex-1 text-charbon/70">
            Réservez un créneau de dépôt, ou demandez à être rappelé·e.
          </p>
          <UButton to="/reparation/reserver" color="primary" size="lg" block class="mt-5 font-semibold">
            Réserver une réparation
          </UButton>
        </div>
        <div class="flex flex-col rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10">
          <span class="grid size-11 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="hand" :size="24" />
          </span>
          <h3 class="mt-4 text-lg font-bold text-charbon">Participer à un atelier</h3>
          <p class="mt-1.5 flex-1 text-charbon/70">
            8 places par session, tous niveaux, outils fournis.
          </p>
          <UButton to="/atelier-participatif/reserver" color="neutral" variant="outline" size="lg" block class="mt-5 font-semibold">
            Réserver ma place
          </UButton>
        </div>
      </div>
    </section>

    <!-- FAQ générale -->
    <section class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <SectionHeading eyebrow="Questions fréquentes" title="Encore une question ?" center />
      <div class="mt-8">
        <Faq :items="[...repairFaq, ...workshopFaq]" />
      </div>
    </section>
  </div>
</template>
