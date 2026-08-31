<script setup lang="ts">
useSeoMeta({
  title: "L'Établi, l'atelier",
  description:
    "Bois, métal, graisse et vélos : L'Établi est un atelier indépendant où l'on répare, où l'on apprend et où l'on transmet. Découvrez l'esprit du lieu.",
})

const values = [
  {
    icon: 'hand',
    title: 'Transmettre',
    text: "Réparer, c'est bien. Apprendre à réparer, c'est mieux. On partage le savoir-faire sans jargon ni jugement.",
  },
  {
    icon: 'shield',
    title: 'Être honnête',
    text: 'Un diagnostic clair, un devis avant d’intervenir, un prix annoncé. La confiance avant tout.',
  },
  {
    icon: 'leaf',
    title: 'Faire durer',
    text: 'On prolonge la vie des vélos plutôt que de les remplacer. Réparer, c’est aussi un geste utile.',
  },
]
</script>

<template>
  <div>
    <PageHero
      eyebrow="L'atelier"
      title="Un vrai atelier, tenu par de vraies personnes"
      intro="Depuis trois ans, L'Établi répare, accompagne et transmet. Bois, métal, graisse et vélos : ici, on prend le temps."
      icon="gear"
      :crumbs="[{ label: 'L\'Établi' }]"
    />

    <!-- NARRATION : matières -->
    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-4 sm:grid-cols-6">
        <div v-reveal class="sm:col-span-4">
          <PhotoFrame subject="hand" tone="charbon" caption="Les mains, d'abord" annotation="fig. 06" ratio="aspect-[16/9]" />
        </div>
        <div v-reveal="1" class="sm:col-span-2">
          <PhotoFrame subject="wrench" tone="terracotta" annotation="fig. 07" ratio="aspect-[4/5] sm:aspect-auto sm:h-full" />
        </div>
        <div v-reveal="1" class="sm:col-span-2">
          <PhotoFrame subject="chain" tone="creme" annotation="fig. 08" ratio="aspect-[4/3]" />
        </div>
        <div v-reveal="2" class="sm:col-span-2">
          <PhotoFrame subject="gear" tone="charbon" annotation="fig. 09" ratio="aspect-[4/3]" />
        </div>
        <div v-reveal="3" class="sm:col-span-2">
          <PhotoFrame subject="wheel" tone="terracotta" annotation="fig. 10" ratio="aspect-[4/3]" />
        </div>
      </div>
      <p class="mt-4 text-sm text-charbon/50">
        Emplacements réservés aux photographies de l'atelier.
      </p>
    </section>

    <!-- HISTOIRE -->
    <section class="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
      <SectionHeading eyebrow="Notre histoire" title="Né d'une envie simple" />
      <div class="mt-5 space-y-4 text-lg leading-relaxed text-charbon/80">
        <p>
          L'Établi est parti d'un constat : trop de vélos dorment dans les caves faute
          d'une petite réparation, et trop de gens aimeraient savoir les entretenir
          eux-mêmes.
        </p>
        <p>
          Alors on a ouvert un lieu à double entrée : on répare pour vous quand vous
          n'avez pas le temps, et on vous apprend à faire quand vous voulez gagner en
          autonomie. Deux façons de venir, un même esprit&nbsp;: l'entraide.
        </p>
      </div>
    </section>

    <!-- VALEURS -->
    <section class="bg-charbon/[0.03] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Ce qui nous tient" title="Trois principes, tenus au quotidien" center />
        <div class="mt-10 grid gap-5 sm:grid-cols-3">
          <div v-for="(v, i) in values" :key="v.title" v-reveal="i">
            <WorkshopCard :icon="v.icon" :title="v.title" :text="v.text" />
          </div>
        </div>
      </div>
    </section>

    <!-- CITATION AMBIANCE -->
    <section class="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
      <TechIcon name="sparkle" :size="36" class="mx-auto text-terracotta" />
      <blockquote class="mt-5 text-2xl font-bold leading-snug text-charbon sm:text-3xl">
        « Ici, ça sent le café et la graisse à chaîne. On répare des vélos, mais surtout
        on discute, on apprend, et on repart plus autonome. »
      </blockquote>
      <p class="mt-4 text-charbon/60">L'esprit de L'Établi</p>
    </section>

    <BookingCTA
      class="pb-8"
      title="Venez pousser la porte"
      text="Que vous vouliez confier votre vélo ou apprendre à le réparer, il y a une place pour vous."
      primary-label="Confier mon vélo"
      primary-to="/reparation"
      secondary-label="Apprendre à réparer"
      secondary-to="/atelier-participatif"
    />
  </div>
</template>
