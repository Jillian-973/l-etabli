<script setup lang="ts">
useSeoMeta({
  title: "L'Établi — Réparez votre vélo, ou apprenez à le faire",
  description:
    "Atelier vélo indépendant : confiez votre vélo à réparer, ou apprenez à le réparer vous-même. Tarifs transparents, délais clairs, réservation simple.",
})

const confierFacts = [
  { icon: 'check', label: 'Vous décrivez le problème, sans jargon' },
  { icon: 'euro', label: 'Diagnostic gratuit, devis clair avant toute intervention' },
  { icon: 'clock', label: 'La plupart des réparations dans la semaine' },
  { icon: 'calendar', label: 'Réservation en ligne d’un créneau' },
]
const apprendreFacts = [
  { icon: 'users', label: '8 places maximum, accompagnement individuel' },
  { icon: 'compass', label: 'Ouvert à tous les niveaux, débutant·es compris' },
  { icon: 'clock', label: 'Sessions de 2 h, outils fournis' },
  { icon: 'hand', label: 'Vous repartez capable de le refaire seul·e' },
]

const promises = [
  { icon: 'shield', title: 'Pas de devis surprise', text: 'Le prix est annoncé et validé avec vous avant qu’on touche au vélo.' },
  { icon: 'hand', title: 'Un vrai accompagnement', text: 'Des personnes qui prennent le temps d’expliquer, jamais de jugement.' },
  { icon: 'leaf', title: 'Réparer plutôt que jeter', text: 'On prolonge la vie de votre vélo, pièce après pièce.' },
]

// Aperçu FAQ : on mélange les questions les plus fréquentes.
const homeFaq = [repairFaq[0]!, repairFaq[1]!, workshopFaq[0]!, repairFaq[2]!]
</script>

<template>
  <div>
    <!-- HERO -->
    <Hero
      title="Votre vélo. Votre choix."
      subtitle="Confiez votre vélo à l'atelier, ou apprenez à le réparer vous-même."
    >
      <template #actions>
        <UButton to="/reparation" color="primary" size="xl" class="font-semibold">
          Confier mon vélo
          <template #trailing><TechIcon name="arrowRight" :size="20" /></template>
        </UButton>
        <UButton
          to="/atelier-participatif"
          color="neutral"
          variant="outline"
          size="xl"
          class="font-semibold"
        >
          Apprendre à le réparer
        </UButton>
        <UButton
          to="/velos-occasion"
          color="neutral"
          variant="ghost"
          size="xl"
          class="font-semibold text-charbon/70"
        >
          Voir les vélos d'occasion
        </UButton>
      </template>
    </Hero>

    <!-- DEUX FAÇONS DE VENIR -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="Deux façons de venir"
        title="Que voulez-vous faire aujourd'hui ?"
        intro="À L'Établi, deux chemins possibles. On s'occupe de tout, ou on vous apprend à le faire. À vous de choisir."
      />

      <div class="mt-10 grid gap-6 lg:grid-cols-2">
        <div v-reveal>
          <OfferCard
            eyebrow="Réparation confiée"
            title="Je confie mon vélo"
            description="Vous déposez votre vélo, l'atelier s'occupe de la réparation."
            icon="wrench"
            photo-subject="hand"
            photo-caption="On répare pour vous"
            :facts="confierFacts"
            cta-label="Réserver une réparation"
            cta-to="/reparation/reserver"
            featured
          />
        </div>
        <div v-reveal="1">
          <OfferCard
            eyebrow="Atelier participatif"
            title="Je répare moi-même"
            description="Vous venez avec votre vélo et apprenez à le réparer avec les outils et l'accompagnement de l'atelier."
            icon="hand"
            photo-subject="gear"
            photo-caption="On vous accompagne"
            :facts="apprendreFacts"
            cta-label="Voir les ateliers"
            cta-to="/atelier-participatif"
          />
        </div>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
        <NuxtLink
          to="/reparation"
          class="inline-flex items-center gap-1.5 font-medium text-charbon/70 hover:text-terracotta"
        >
          Comment fonctionne la réparation
          <TechIcon name="arrowRight" :size="16" />
        </NuxtLink>
        <NuxtLink
          to="/atelier-participatif"
          class="inline-flex items-center gap-1.5 font-medium text-charbon/70 hover:text-terracotta"
        >
          Comment fonctionne l'atelier
          <TechIcon name="arrowRight" :size="16" />
        </NuxtLink>
      </div>
    </section>

    <!-- PROMESSES / RÉASSURANCE -->
    <section class="bg-charbon/[0.03] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pourquoi L'Établi"
          title="Un atelier où l'on vient en confiance"
          center
        />
        <div class="mt-10 grid gap-5 sm:grid-cols-3">
          <div v-for="(p, i) in promises" :key="p.title" v-reveal="i">
            <WorkshopCard :icon="p.icon" :title="p.title" :text="p.text" />
          </div>
        </div>
      </div>
    </section>

    <!-- VÉLOS D'OCCASION (secondaire) -->
    <section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div
        v-reveal
        class="grid items-center gap-8 rounded-3xl bg-creme-50 p-6 ring-1 ring-charbon/10 sm:p-10 lg:grid-cols-[1.2fr_1fr]"
      >
        <div>
          <p class="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-terracotta-700">
            <TechIcon name="wheel" :size="18" />
            Vélos d'occasion
          </p>
          <h2 class="mt-2 text-2xl font-bold text-charbon sm:text-3xl">
            Une sélection de vélos vérifiés, bientôt disponible
          </h2>
          <p class="mt-3 max-w-lg text-charbon/70">
            L'Établi prépare une sélection de vélos d'occasion révisés à l'atelier.
            Envie d'être prévenu·e dès l'ouverture&nbsp;?
          </p>
          <div class="mt-6">
            <UButton to="/velos-occasion" color="neutral" variant="outline" size="lg" class="font-semibold">
              En savoir plus
              <template #trailing><TechIcon name="arrowRight" :size="18" /></template>
            </UButton>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <BikeCard />
          <BikeCard class="mt-6" />
        </div>
      </div>
    </section>

    <!-- FAQ APERÇU -->
    <section class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <SectionHeading
        eyebrow="Vos questions"
        title="Les réponses avant même de nous appeler"
        center
      />
      <div class="mt-8">
        <Faq :items="homeFaq" open-first />
      </div>
      <p class="mt-6 text-center text-charbon/70">
        D'autres questions&nbsp;?
        <NuxtLink to="/infos-pratiques" class="font-medium text-terracotta-700 hover:underline">
          Voir toutes les infos pratiques
        </NuxtLink>
      </p>
    </section>

    <!-- CTA FINAL -->
    <BookingCTA
      class="pb-8"
      title="Prêt·e à repartir sur de bonnes roues ?"
      text="Réservez une réparation en quelques clics, ou venez apprendre à la faire vous-même."
      primary-label="Confier mon vélo"
      primary-to="/reparation/reserver"
      secondary-label="Découvrir l'atelier participatif"
      secondary-to="/atelier-participatif"
    />
  </div>
</template>
