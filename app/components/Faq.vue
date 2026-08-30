<script setup lang="ts">
import type { FaqEntry } from '~/utils/content'
withDefaults(
  defineProps<{ items: FaqEntry[]; openFirst?: boolean }>(),
  { openFirst: false },
)
</script>

<template>
  <div class="rounded-2xl bg-creme-50 px-5 ring-1 ring-charbon/10 sm:px-7">
    <FaqItem
      v-for="(item, i) in items"
      :key="item.question"
      :item="item"
      :open="openFirst && i === 0"
    />
  </div>
</template>
