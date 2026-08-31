<script setup lang="ts">
useSeoMeta({
  title: "Réparation confiée | L'Établi",
  description:
    "Déposez votre vélo, l'atelier s'occupe de tout. Diagnostic gratuit, devis clair avant intervention, réparation dans la semaine. Réservez un créneau en ligne.",
})

const bikeTypes = [
  'Vélos de ville',
  'VTC & VTT',
  'Vélos de route',
  'Vélos d’enfant',
  'Plupart des vélos électriques',
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Réparation confiée"
      title="Je confie mon vélo"
      intro="Vous déposez votre vélo, l'atelier s'occupe de la réparation. Simple, transparent, sans mauvaise surprise."
      icon="wrench"
      :crumbs="[{ label: 'Réparer' }]"
    >
      <template #actions>
        <UButton to="/reparation/reserver" color="primary" size="xl" class="font-semibold">
          Réserver une réparation
          <template #trailing><TechIcon name="arrowRight" :size="20" /></template>
        </UButton>
        <UButton
          to="/reparation/reserver#rappel"
          color="neutral"
          variant="outline"
          size="xl"
          class="font-semibold"
        >
          Demander un rappel
        </UButton>
      </template>
    </PageHero>

    <!-- COMMENT ÇA MARCHE -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading eyebrow="Comment ça marche" title="Trois étapes, c'est tout" />
      <div class="mt-10">
        <StepList :steps="repairSteps" />
      </div>
    </section>

    <!-- TRANSPARENCE TARIFS / DÉLAIS -->
    <section class="bg-charbon/[0.03] py-16 sm:py-20">
      <div class="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div v-reveal class="rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10 sm:p-8">
          <span class="grid size-12 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="euro" :size="26" />
          </span>
          <h2 class="mt-4 text-xl font-bold text-charbon">Combien ça coûte&nbsp;?</h2>
          <p class="mt-2 leading-relaxed text-charbon/75">
            Le diagnostic est <strong class="font-semibold text-charbon">gratuit</strong>.
            Vous recevez toujours un devis clair avant toute intervention&nbsp;: le prix
            dépend de la main-d'œuvre et des pièces, et rien n'est engagé sans votre accord.
          </p>
          <ul class="mt-4 space-y-2 text-charbon/80">
            <li class="flex items-start gap-2.5">
              <TechIcon name="check" :size="20" class="mt-0.5 shrink-0 text-terracotta" />
              Aucun travail lancé sans validation de votre part
            </li>
            <li class="flex items-start gap-2.5">
              <TechIcon name="check" :size="20" class="mt-0.5 shrink-0 text-terracotta" />
              Un prix annoncé, pas de rallonge à la remise du vélo
            </li>
          </ul>
        </div>

        <div v-reveal="1" class="rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10 sm:p-8">
          <span class="grid size-12 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
            <TechIcon name="clock" :size="26" />
          </span>
          <h2 class="mt-4 text-xl font-bold text-charbon">Combien de temps&nbsp;?</h2>
          <p class="mt-2 leading-relaxed text-charbon/75">
            La plupart des réparations courantes sont réalisées
            <strong class="font-semibold text-charbon">dans la semaine</strong>. Le délai exact
            vous est confirmé au dépôt, une fois le problème diagnostiqué.
          </p>
          <div class="mt-4 rounded-xl bg-charbon/[0.04] p-4">
            <p class="flex items-center gap-2 text-sm font-medium text-charbon">
              <TechIcon name="calendar" :size="18" class="text-terracotta" />
              L'atelier prend un nombre limité de vélos chaque semaine&nbsp;: réserver
              garantit qu'on s'occupe du vôtre.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUELS VÉLOS -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div class="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div v-reveal>
          <SectionHeading
            eyebrow="Quels vélos"
            title="On répare (presque) tout ce qui roule"
            intro="Pas besoin de connaître la mécanique : décrivez ce qui ne va pas, on s'occupe du reste."
          />
          <ul class="mt-6 flex flex-wrap gap-2.5">
            <li
              v-for="type in bikeTypes"
              :key="type"
              class="rounded-full bg-charbon/5 px-4 py-2 text-sm font-medium text-charbon"
            >
              {{ type }}
            </li>
          </ul>
          <p class="mt-5 text-charbon/70">
            Un doute sur votre vélo&nbsp;?
            <NuxtLink to="/reparation/reserver#rappel" class="font-medium text-terracotta-700 hover:underline">
              Demandez un rappel
            </NuxtLink>, on vous répond tout de suite.
          </p>
        </div>
        <div v-reveal="1">
          <PhotoFrame
            subject="wheel"
            tone="charbon"
            caption="L'atelier, rue des Artisans"
            annotation="fig. 04"
            ratio="aspect-[4/3]"
          />
        </div>
      </div>
    </section>

    <!-- FAQ RÉPARATION -->
    <section class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <SectionHeading eyebrow="Réassurance" title="Les questions les plus fréquentes" center />
      <div class="mt-8">
        <Faq :items="repairFaq" open-first />
      </div>
    </section>

    <BookingCTA
      class="pb-8"
      title="On s'occupe de votre vélo ?"
      text="Réservez un créneau de dépôt, ou décrivez votre problème pour être recontacté·e."
      primary-label="Réserver une réparation"
      primary-to="/reparation/reserver"
      secondary-label="Demander un rappel"
      secondary-to="/reparation/reserver#rappel"
    />
  </div>
</template>
