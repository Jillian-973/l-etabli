<script setup lang="ts">
// Jeu d'icônes maison, style dessin technique (trait, currentColor).
// Décoratif par défaut (aria-hidden) ; passez `label` pour une icône porteuse de sens.
const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    label?: string
    strokeWidth?: number
  }>(),
  { size: 24, strokeWidth: 1.75 },
)

const paths: Record<string, string> = {
  wrench:
    '<path d="M14.5 5.5a3.5 3.5 0 0 0-4.9 4.2L4 15.3a2 2 0 1 0 2.8 2.8l5.6-5.6a3.5 3.5 0 0 0 4.2-4.9l-2.3 2.3-2-2 2.2-2.4Z"/>',
  gear:
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.2M12 18.8V21M4.2 7.5l1.9 1.1M17.9 15.4l1.9 1.1M4.2 16.5l1.9-1.1M17.9 8.6l1.9-1.1"/>',
  chain:
    '<rect x="3" y="9.5" width="6.5" height="5" rx="2.5"/><rect x="14.5" y="9.5" width="6.5" height="5" rx="2.5"/><path d="M9.5 12h5"/>',
  wheel:
    '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.6"/><path d="M12 3.5v6.9M12 13.6v6.9M3.5 12h6.9M13.6 12h6.9M6 6l4.9 4.9M13.1 13.1 18 18M18 6l-4.9 4.9M10.9 13.1 6 18"/>',
  bolt:
    '<path d="M13 3 5 13h5l-1 8 8-10h-5l1-8Z"/>',
  hand:
    '<path d="M6 11V6.5a1.5 1.5 0 0 1 3 0V10m0 0V5a1.5 1.5 0 0 1 3 0v5m0 0V6.5a1.5 1.5 0 0 1 3 0V12m0-2a1.5 1.5 0 0 1 3 0v4.5A6.5 6.5 0 0 1 11.5 21H10a4 4 0 0 1-3-1.8L4.2 15a1.6 1.6 0 0 1 2.4-2.1L8 14"/>',
  arrowRight: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  check: '<path d="M4 12.5 9 17.5 20 6.5"/>',
  phone:
    '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3A2 2 0 0 1 17.4 21 15 15 0 0 1 3 6.6 2 2 0 0 1 5 4.5"/>',
  mail:
    '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin:
    '<path d="M12 21s6.5-5.6 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.4 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>',
  users:
    '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16.5 5.6a3.2 3.2 0 0 1 0 5.8M17 20a5.5 5.5 0 0 0-2.2-4.4"/>',
  sparkle:
    '<path d="M12 3.5c.6 3.9 1.6 4.9 5.5 5.5-3.9.6-4.9 1.6-5.5 5.5-.6-3.9-1.6-4.9-5.5-5.5 3.9-.6 4.9-1.6 5.5-5.5ZM18 15c.3 1.8.7 2.2 2.5 2.5-1.8.3-2.2.7-2.5 2.5-.3-1.8-.7-2.2-2.5-2.5 1.8-.3 2.2-.7 2.5-2.5Z"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  compass:
    '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  ruler:
    '<rect x="2.5" y="8" width="19" height="8" rx="1.5" transform="rotate(-0 0 0)"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/>',
  shield: '<path d="M12 3.5 19 6v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6l7-2.5Z"/><path d="m9 12 2 2 4-4"/>',
  euro:
    '<circle cx="12" cy="12" r="8.5"/><path d="M15 8.5a4 4 0 1 0 0 7M7.5 10.5h5M7.5 13.5h5"/>',
  leaf:
    '<path d="M4.5 19.5C3 12 8 5.5 19.5 4.5 20.5 16 14 21 6.5 19.5M8 16 18 6"/>',
}

// computed : l'icône doit se mettre à jour quand `name` change (ex. menu ↔ close)
const svg = computed(() => paths[props.name] ?? paths.gear)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
    v-html="svg"
  />
</template>
