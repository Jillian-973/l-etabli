<script setup lang="ts">
import type { FaqEntry } from '~/utils/content'
withDefaults(defineProps<{ item: FaqEntry; open?: boolean }>(), { open: false })
</script>

<template>
  <details
    :open="open"
    class="group border-b border-charbon/10 [&_summary::-webkit-details-marker]:hidden"
  >
    <summary
      class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-charbon"
      style="touch-action: manipulation"
    >
      <span class="text-base sm:text-lg">{{ item.question }}</span>
      <span
        class="grid size-8 shrink-0 place-items-center rounded-full bg-charbon/5 text-charbon transition-transform duration-300 group-[[open]]:rotate-180"
        aria-hidden="true"
      >
        <TechIcon name="chevronDown" :size="18" />
      </span>
    </summary>
    <div class="pb-5 pr-12">
      <p class="leading-relaxed text-charbon/75">{{ item.answer }}</p>
    </div>
  </details>
</template>
