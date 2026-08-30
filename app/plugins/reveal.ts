// Directive v-reveal : ajoute .is-visible quand l'élément entre dans le viewport.
// Enregistrée universellement (le hook `mounted` ne s'exécute qu'au client, donc
// aucune API navigateur n'est touchée côté serveur), afin que la directive soit
// résolue en SSR et n'échoue pas au rendu.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const supportsObserver = typeof IntersectionObserver !== 'undefined'

      el.classList.add('reveal')

      // Délai en cascade optionnel : v-reveal="2"
      const delay = Number(binding.value) || 0
      if (delay) el.style.transitionDelay = `${delay * 90}ms`

      if (reducedMotion || !supportsObserver) {
        el.classList.add('is-visible')
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.classList.add('is-visible')
              observer.unobserve(el)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      observer.observe(el)
      ;(el as any).__revealObserver = observer
    },
    unmounted(el: HTMLElement) {
      ;(el as any).__revealObserver?.disconnect()
    },
  })
})
