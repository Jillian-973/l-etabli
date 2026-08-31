<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

useSeoMeta({
  title: is404.value ? 'Page introuvable | L\'Établi' : 'Une erreur est survenue | L\'Établi',
})
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center sm:px-6">
      <TechIcon name="gear" :size="64" :stroke-width="1.2" class="text-terracotta" />
      <p class="mt-6 font-mono text-sm uppercase tracking-widest text-charbon/50">
        Erreur {{ error.statusCode }}
      </p>
      <h1 class="mt-2 text-3xl font-bold text-charbon sm:text-4xl">
        {{ is404 ? 'Cette page a déraillé' : 'Un pépin mécanique' }}
      </h1>
      <p class="mt-3 max-w-md text-charbon/70">
        {{ is404
          ? 'La page que vous cherchez n’existe pas ou a été déplacée. Revenons sur la bonne route.'
          : 'Quelque chose s’est cassé de notre côté. Réessayez, ou revenez à l’accueil.' }}
      </p>
      <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <UButton to="/" color="primary" size="xl" class="font-semibold" @click="clearError({ redirect: '/' })">
          Retour à l'accueil
        </UButton>
        <UButton to="/infos-pratiques" color="neutral" variant="outline" size="xl" class="font-semibold">
          Voir les infos pratiques
        </UButton>
      </div>
    </section>
  </NuxtLayout>
</template>
