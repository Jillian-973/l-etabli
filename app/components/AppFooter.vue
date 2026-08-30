<script setup lang="ts">
const year = new Date().getFullYear()
const links = siteNav.filter((l) => !l.cta)
</script>

<template>
  <footer class="mt-24 bg-charbon text-creme">
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <!-- Marque -->
        <div>
          <div class="flex items-center gap-2.5">
            <span class="grid size-10 place-items-center rounded-full bg-creme text-charbon">
              <TechIcon name="gear" :size="22" :stroke-width="1.9" />
            </span>
            <span class="text-xl font-bold tracking-tight" translate="no">L'Établi</span>
          </div>
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-creme/70">
            Atelier de réparation et d'autoréparation de vélos. On répare pour vous,
            ou on vous apprend à réparer vous-même.
          </p>
          <div class="tech-rule mt-6 max-w-xs" style="opacity: 0.3" />
        </div>

        <!-- Navigation -->
        <nav aria-label="Pied de page">
          <h2 class="text-sm font-semibold uppercase tracking-wider text-creme/50">
            Le site
          </h2>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="text-creme/85 transition-colors hover:text-terracotta-400"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Contact -->
        <div>
          <h2 class="text-sm font-semibold uppercase tracking-wider text-creme/50">
            Nous trouver
          </h2>
          <ul class="mt-4 space-y-3 text-creme/85">
            <li class="flex items-start gap-3">
              <TechIcon name="pin" :size="20" class="mt-0.5 shrink-0 text-terracotta-400" />
              <span>
                {{ contact.address.street }}<br >
                {{ contact.address.zip }} {{ contact.address.city }}
              </span>
            </li>
            <li>
              <a
                :href="contact.phoneHref"
                class="flex items-center gap-3 transition-colors hover:text-terracotta-400"
              >
                <TechIcon name="phone" :size="20" class="shrink-0 text-terracotta-400" />
                {{ contact.phone }}
              </a>
            </li>
            <li>
              <a
                :href="contact.instagramHref"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-3 transition-colors hover:text-terracotta-400"
              >
                <TechIcon name="instagram" :size="20" class="shrink-0 text-terracotta-400" />
                <span translate="no">{{ contact.instagram }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-3 border-t border-creme/10 pt-6 text-sm text-creme/50 sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© {{ year }} L'Établi — Atelier vélo indépendant</p>
        <p>Fait à la main, comme les réparations.</p>
      </div>
    </div>
  </footer>
</template>
