// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  // Configuration Calendly — PRIVÉE (jamais exposée au client).
  // Les valeurs proviennent des variables d'environnement (.env en local,
  // variables de l'hébergeur en production). Ne rien mettre dans runtimeConfig.public.
  runtimeConfig: {
    calendlyAccessToken: process.env.CALENDLY_ACCESS_TOKEN || '',
    calendlyRepairEventTypeUri: process.env.CALENDLY_REPAIR_EVENT_TYPE_URI || '',
    calendlyWorkshopEventTypeUri: process.env.CALENDLY_WORKSHOP_EVENT_TYPE_URI || '',
  },

  // Palette imposée : thème clair unique (crème). Pas de dark mode.
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: "L'Établi — Atelier de réparation et d'autoréparation de vélos",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "L'Établi, atelier vélo indépendant : confiez votre vélo à réparer ou apprenez à le réparer vous-même. Tarifs, délais et réservation en ligne.",
        },
        { name: 'theme-color', content: '#F3EBDD' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap',
        },
      ],
    },
  },
})
