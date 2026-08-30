<script setup lang="ts">
useSeoMeta({
  title: 'Vélos d\'occasion — Bientôt disponible — L\'Établi',
  description:
    "L'Établi prépare une sélection de vélos d'occasion vérifiés à l'atelier. Laissez votre e-mail pour être informé·e du lancement.",
})

const email = ref('')
const loading = ref(false)
const done = ref(false)
const error = ref('')

async function notify() {
  error.value = ''
  if (!/.+@.+\..+/.test(email.value.trim())) {
    error.value = 'Merci d’indiquer un e-mail valide.'
    return
  }
  loading.value = true
  try {
    await $fetch('/api/notify', { method: 'POST', body: { email: email.value.trim() } })
    done.value = true
  } catch {
    error.value = 'Envoi impossible pour le moment. Réessayez plus tard.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <PageHero
      eyebrow="Vélos d'occasion"
      title="Bientôt disponible"
      intro="L'Établi prépare une sélection de vélos d'occasion vérifiés à l'atelier. Cette section n'est pas encore ouverte."
      icon="wheel"
      :crumbs="[{ label: 'Vélos d\'occasion' }]"
    />

    <section class="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div class="rounded-3xl bg-charbon p-8 text-creme sm:p-12">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-creme/10 px-3 py-1.5 text-sm font-medium"
        >
          <span class="size-2 rounded-full bg-terracotta" aria-hidden="true" />
          En préparation
        </span>
        <h2 class="mt-5 text-2xl font-bold sm:text-3xl">
          Des vélos d'occasion, révisés et prêts à rouler
        </h2>
        <p class="mt-3 max-w-xl text-creme/80">
          Chaque vélo sera contrôlé et remis en état à l'atelier avant d'être proposé.
          Pas de mauvaise surprise, comme pour nos réparations.
        </p>

        <!-- Être informé -->
        <div v-if="!done" class="mt-7 max-w-md">
          <form class="flex flex-col gap-2 sm:flex-row" novalidate @submit.prevent="notify">
            <div class="flex-1">
              <label for="notify-email" class="sr-only">Votre e-mail</label>
              <input
                id="notify-email"
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                spellcheck="false"
                placeholder="votre@email.fr"
                class="w-full rounded-lg border-0 bg-creme px-4 py-3 text-charbon ring-1 ring-inset ring-charbon/10 placeholder:text-charbon/40 focus:ring-2 focus:ring-terracotta"
                :aria-invalid="Boolean(error)"
                aria-describedby="notify-help"
              >
            </div>
            <UButton
              type="submit"
              color="primary"
              size="xl"
              :loading="loading"
              class="font-semibold"
            >
              Être informé·e
            </UButton>
          </form>
          <p
            id="notify-help"
            class="mt-2 text-sm"
            :class="error ? 'text-terracotta-300' : 'text-creme/55'"
            role="status"
            aria-live="polite"
          >
            {{ error || 'On vous préviendra dès l’ouverture. Pas de spam.' }}
          </p>
        </div>

        <div
          v-else
          class="mt-7 flex items-center gap-3 rounded-xl bg-creme/10 p-4"
          role="status"
          aria-live="polite"
        >
          <TechIcon name="check" :size="24" class="shrink-0 text-terracotta-300" label="Inscription confirmée" />
          <p>Merci&nbsp;! On vous préviendra dès que les vélos seront en ligne.</p>
        </div>

        <div class="mt-6">
          <UButton
            to="/infos-pratiques"
            color="neutral"
            variant="ghost"
            class="font-semibold text-creme hover:bg-creme/10"
          >
            Nous contacter
            <template #trailing><TechIcon name="arrowRight" :size="18" /></template>
          </UButton>
        </div>
      </div>

      <!-- Aperçu du futur format (placeholders, aucun faux produit) -->
      <div class="mt-12">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-charbon/50">
          Aperçu du futur format
        </p>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <BikeCard v-for="i in 3" :key="i" />
        </div>
        <p class="mt-4 text-sm text-charbon/60">
          Les fiches vélos apparaîtront ici une fois la sélection prête.
        </p>
      </div>
    </section>
  </div>
</template>
