<script setup lang="ts">
const route = useRoute()
const open = ref(false)

// Liens de navigation (le CTA est traité à part)
const links = computed(() => siteNav.filter((l) => !l.cta))
const cta = computed(() => siteNav.find((l) => l.cta)!)

function isActive(to: string): boolean {
  return route.path === to || (to !== '/' && route.path.startsWith(to))
}

// Fermer le menu au changement de page
watch(() => route.path, () => (open.value = false))

// Verrouiller le scroll + fermeture au clavier quand le menu mobile est ouvert
watch(open, (isOpen) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  }
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-charbon/10 bg-creme/90 backdrop-blur supports-[backdrop-filter]:bg-creme/75"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <AppLogo />

      <!-- Navigation desktop -->
      <nav aria-label="Navigation principale" class="hidden lg:block">
        <ul class="flex items-center gap-1">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="relative rounded-md px-3 py-2 text-[0.95rem] font-medium text-charbon/80 transition-colors hover:text-charbon"
              :class="isActive(link.to) && 'text-charbon'"
              :aria-current="isActive(link.to) ? 'page' : undefined"
            >
              {{ link.label }}
              <span
                class="absolute inset-x-3 -bottom-px h-0.5 origin-left rounded-full bg-terracotta transition-transform duration-300"
                :class="isActive(link.to) ? 'scale-x-100' : 'scale-x-0'"
                aria-hidden="true"
              />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <UButton
          :to="cta.to"
          color="primary"
          size="lg"
          class="hidden font-semibold shadow-sm sm:inline-flex"
        >
          {{ cta.label }}
        </UButton>

        <!-- Bouton menu mobile -->
        <button
          type="button"
          class="grid size-11 place-items-center rounded-lg text-charbon lg:hidden"
          style="touch-action: manipulation"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="open = !open"
        >
          <TechIcon :name="open ? 'close' : 'menu'" :size="26" />
        </button>
      </div>
    </div>

    <!-- Menu mobile — téléporté hors du <header> : son backdrop-filter établit un
         bloc conteneur pour les descendants `fixed`, ce qui réduirait le menu à
         une hauteur nulle. Dans <body>, il se positionne par rapport au viewport. -->
    <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        id="mobile-menu"
        class="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-creme lg:hidden"
      >
        <nav aria-label="Navigation principale" class="mx-auto max-w-6xl px-4 py-6">
          <ul class="flex flex-col gap-1">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium text-charbon transition-colors hover:bg-charbon/5"
                :class="isActive(link.to) && 'bg-charbon/5'"
                :aria-current="isActive(link.to) ? 'page' : undefined"
              >
                {{ link.label }}
                <TechIcon name="arrowRight" :size="20" class="text-terracotta" />
              </NuxtLink>
            </li>
          </ul>
          <UButton
            :to="cta.to"
            color="primary"
            size="xl"
            block
            class="mt-6 font-semibold"
          >
            {{ cta.label }}
          </UButton>
        </nav>
      </div>
    </Transition>
    </Teleport>
  </header>
</template>
