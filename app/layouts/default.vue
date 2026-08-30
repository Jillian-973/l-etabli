<script setup lang="ts">
// Layout principal : en-tête, contenu, pied de page + barre de réservation mobile.
</script>

<template>
  <div class="min-h-screen flex flex-col bg-creme text-charbon">
    <a href="#contenu" class="skip-link">Aller au contenu</a>

    <AppHeader />

    <main id="contenu" class="flex-1">
      <slot />
    </main>

    <AppFooter />

    <!-- CTA sticky réservation (mobile uniquement) -->
    <MobileBookingBar />
  </div>
</template>
