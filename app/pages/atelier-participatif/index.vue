<script setup lang="ts">
useSeoMeta({
  title: 'Atelier participatif, apprendre à réparer son vélo | L\'Établi',
  description:
    "Venez avec votre vélo et apprenez à le réparer, accompagné·e par un pro. Ouvert à tous les niveaux, 8 places par session, outils fournis.",
})

const sessions = useUpcomingSessions(4)

const facts = [
  { icon: 'compass', title: 'Niveau', text: 'Tous niveaux, débutant·es bienvenu·es.' },
  { icon: 'clock', title: 'Durée', text: 'Environ 2 h par session.' },
  { icon: 'users', title: 'Places', text: '8 personnes maximum.' },
  { icon: 'wrench', title: 'Outils', text: "Tout l'outillage fourni sur place." },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="Atelier participatif"
      title="Je répare moi-même"
      intro="Vous venez avec votre vélo et apprenez à le réparer avec les outils et l'accompagnement de l'atelier. Aucun niveau requis."
      icon="hand"
      :crumbs="[{ label: 'Apprendre' }]"
    >
      <template #actions>
        <UButton to="/atelier-participatif/reserver" color="primary" size="xl" class="font-semibold">
          Réserver ma place
          <template #trailing><TechIcon name="arrowRight" :size="20" /></template>
        </UButton>
        <UButton to="#sessions" color="neutral" variant="outline" size="xl" class="font-semibold">
          Voir les prochaines sessions
        </UButton>
      </template>
    </PageHero>

    <!-- CARACTÉRISTIQUES -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(f, i) in facts" :key="f.title" v-reveal="i">
          <WorkshopCard :icon="f.icon" :title="f.title" :text="f.text" />
        </div>
      </div>
    </section>

    <!-- COMMENT ÇA MARCHE -->
    <section class="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <SectionHeading eyebrow="Comment ça se passe" title="On vous accompagne, à votre rythme" />
      <div class="mt-10">
        <StepList :steps="workshopSteps" />
      </div>
    </section>

    <!-- CE QUE L'ON APPREND -->
    <section class="bg-charbon/[0.03] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div class="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div v-reveal>
            <PhotoFrame
              subject="hand"
              tone="terracotta"
              caption="Apprendre les bons gestes"
              annotation="fig. 05"
              ratio="aspect-[4/3]"
            />
          </div>
          <div v-reveal="1">
            <SectionHeading
              eyebrow="Ce que vous apprenez"
              title="Des gestes simples qui changent tout"
              intro="Repartez capable de refaire seul·e ce que vous avez appris."
            />
            <ul class="mt-6 grid gap-3 sm:grid-cols-2">
              <li
                v-for="item in workshopLearnings"
                :key="item"
                class="flex items-start gap-2.5 rounded-xl bg-creme-50 p-3.5 ring-1 ring-charbon/10"
              >
                <TechIcon name="check" :size="20" class="mt-0.5 shrink-0 text-terracotta" />
                <span class="text-charbon/85">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- PROCHAINES SESSIONS -->
    <section id="sessions" class="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow="Prochaines sessions"
        title="Choisissez votre créneau"
        intro="Deux ateliers par semaine, 8 places chacun. Réservez la session qui vous convient."
      />
      <div class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(session, i) in sessions" :key="session.id" v-reveal="i">
          <AvailabilityCard :session="session" />
        </div>
      </div>
      <p class="mt-6 text-sm text-charbon/60">
        Les places affichées sont indicatives et confirmées au moment de la réservation.
      </p>
    </section>

    <!-- FAQ ATELIER -->
    <section class="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <SectionHeading eyebrow="Réassurance" title="Avant de vous lancer" center />
      <div class="mt-8">
        <Faq :items="workshopFaq" open-first />
      </div>
    </section>

    <BookingCTA
      class="pb-8"
      icon="hand"
      title="Envie d'apprendre à réparer votre vélo ?"
      text="Réservez votre place à un atelier participatif. Aucun niveau requis, on s'occupe du reste."
      primary-label="Réserver ma place"
      primary-to="/atelier-participatif/reserver"
      secondary-label="Confier plutôt mon vélo"
      secondary-to="/reparation"
    />
  </div>
</template>
