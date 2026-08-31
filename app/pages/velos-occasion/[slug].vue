<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

useSeoMeta({
  title: 'Vélo d\'occasion, bientôt disponible | L\'Établi',
  description: "Les fiches vélos d'occasion ne sont pas encore disponibles.",
  robots: 'noindex',
})
</script>

<template>
  <div>
    <PageHero
      eyebrow="Vélos d'occasion"
      title="Cette fiche n'est pas encore disponible"
      icon="wheel"
      :crumbs="[{ label: 'Vélos d\'occasion', to: '/velos-occasion' }, { label: 'Fiche' }]"
    />

    <section class="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <span class="inline-grid size-16 place-items-center rounded-full bg-charbon/5 text-charbon">
        <TechIcon name="wheel" :size="34" :stroke-width="1.2" />
      </span>
      <h2 class="mt-5 text-2xl font-bold text-charbon">Les vélos d'occasion arrivent bientôt</h2>
      <p class="mx-auto mt-3 max-w-md text-charbon/70">
        La sélection de vélos vérifiés à l'atelier n'est pas encore en ligne. Revenez
        vite, ou laissez-nous votre e-mail pour être prévenu·e.
      </p>
      <p v-if="slug" class="mt-2 text-sm text-charbon/45">
        Référence demandée : <span class="font-mono">{{ slug }}</span>
      </p>
      <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <UButton to="/velos-occasion" color="primary" size="lg" class="font-semibold">
          Être informé·e du lancement
        </UButton>
        <UButton to="/" color="neutral" variant="outline" size="lg" class="font-semibold">
          Retour à l'accueil
        </UButton>
      </div>
    </section>
  </div>
</template>
