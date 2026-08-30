<script setup lang="ts">
interface Step {
  n: number
  title: string
  text: string
}
defineProps<{ steps: Step[] }>()
</script>

<template>
  <ol class="grid gap-6 sm:grid-cols-3">
    <li
      v-for="(step, i) in steps"
      :key="step.n"
      v-reveal="i"
      class="relative"
    >
      <div class="flex items-center gap-3">
        <span
          class="grid size-11 shrink-0 place-items-center rounded-full bg-terracotta font-bold text-creme"
          aria-hidden="true"
        >
          {{ step.n }}
        </span>
        <!-- Trait de liaison (dessin technique) sauf sur le dernier -->
        <span
          v-if="i < steps.length - 1"
          class="hidden h-px flex-1 bg-charbon/15 sm:block"
          aria-hidden="true"
        />
      </div>
      <h3 class="mt-4 text-lg font-bold text-charbon">{{ step.title }}</h3>
      <p class="mt-1.5 leading-relaxed text-charbon/70">{{ step.text }}</p>
    </li>
  </ol>
</template>
