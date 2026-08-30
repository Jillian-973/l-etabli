<script setup lang="ts">
// Bloc infos de contact réutilisable. `variant` : 'full' (page infos) ou 'compact'.
withDefaults(defineProps<{ variant?: 'full' | 'compact' }>(), { variant: 'full' })

const todayIndex = new Date().getDay() // 0 = dimanche
// contact.hours commence au lundi ; on mappe l'index JS vers cet ordre.
const todayHoursIndex = (todayIndex + 6) % 7
</script>

<template>
  <div class="grid gap-4" :class="variant === 'full' ? 'md:grid-cols-2' : ''">
    <!-- Coordonnées -->
    <div class="rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10">
      <h3 class="text-lg font-bold text-charbon">Coordonnées</h3>
      <ul class="mt-4 space-y-4">
        <li class="flex items-start gap-3">
          <TechIcon name="pin" :size="22" class="mt-0.5 shrink-0 text-terracotta" />
          <div>
            <p class="font-medium text-charbon">Adresse</p>
            <a
              :href="contact.mapsHref"
              target="_blank"
              rel="noopener"
              class="text-charbon/70 underline-offset-2 hover:text-terracotta hover:underline"
            >
              {{ contact.address.street }}, {{ contact.address.zip }} {{ contact.address.city }}
            </a>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <TechIcon name="phone" :size="22" class="mt-0.5 shrink-0 text-terracotta" />
          <div>
            <p class="font-medium text-charbon">Téléphone</p>
            <a
              :href="contact.phoneHref"
              class="text-charbon/70 tabular-nums hover:text-terracotta"
            >{{ contact.phone }}</a>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <TechIcon name="mail" :size="22" class="mt-0.5 shrink-0 text-terracotta" />
          <div>
            <p class="font-medium text-charbon">E-mail</p>
            <a
              :href="`mailto:${contact.email}`"
              class="text-charbon/70 hover:text-terracotta"
            >{{ contact.email }}</a>
          </div>
        </li>
        <li class="flex items-start gap-3">
          <TechIcon name="instagram" :size="22" class="mt-0.5 shrink-0 text-terracotta" />
          <div>
            <p class="font-medium text-charbon">Instagram</p>
            <a
              :href="contact.instagramHref"
              target="_blank"
              rel="noopener"
              class="text-charbon/70 hover:text-terracotta"
              translate="no"
            >{{ contact.instagram }}</a>
          </div>
        </li>
      </ul>
    </div>

    <!-- Horaires -->
    <div class="rounded-2xl bg-creme-50 p-6 ring-1 ring-charbon/10">
      <h3 class="flex items-center gap-2 text-lg font-bold text-charbon">
        <TechIcon name="clock" :size="20" class="text-terracotta" />
        Horaires
      </h3>
      <table class="mt-4 w-full text-sm">
        <caption class="sr-only">Horaires d'ouverture de l'atelier</caption>
        <tbody>
          <tr
            v-for="(row, i) in contact.hours"
            :key="row.day"
            class="border-b border-charbon/5 last:border-0"
            :class="i === todayHoursIndex && 'font-semibold text-charbon'"
          >
            <th scope="row" class="py-2 text-left font-medium text-charbon/80">
              {{ row.day }}
              <span
                v-if="i === todayHoursIndex"
                class="ml-1.5 rounded-full bg-terracotta/15 px-2 py-0.5 text-xs font-medium text-terracotta-700"
              >Aujourd'hui</span>
            </th>
            <td class="py-2 text-right tabular-nums text-charbon/70">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
