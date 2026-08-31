<script setup lang="ts">
useSeoMeta({
  title: 'Réserver une réparation | L\'Établi',
  description:
    "Réservez un créneau pour déposer votre vélo, ou décrivez votre problème pour être recontacté. Simple, en moins de trois étapes.",
})

const capacityNote = computed(
  () => `${capacity.slotsPerDay} créneaux par jour, du mardi au samedi`,
)

// Parcours de réservation natif (réparation). Calendly reste invisible,
// derrière /api/calendly/* — voir composables/useBooking.ts.
const {
  bookingType,
  days,
  loading,
  error,
  visibleMonth,
  selectedDate,
  selectedDay,
  selectedSlot,
  step,
  contact,
  submitting,
  result,
  setMonth,
  selectDay,
  selectSlot,
  goToForm,
  goToSummary,
  backTo,
  submit,
  reset,
} = useBooking('repair')

const steps = [
  { key: 'select', label: 'Créneau' },
  { key: 'form', label: 'Coordonnées' },
  { key: 'summary', label: 'Confirmation' },
] as const

const currentStepIndex = computed(() => {
  if (step.value === 'done') return steps.length
  return steps.findIndex((s) => s.key === step.value)
})

const dayLabel = computed(() => selectedDay.value?.label ?? '')
const slotTime = computed(() => selectedSlot.value?.time ?? '')
</script>

<template>
  <div>
    <PageHero
      eyebrow="Réparation confiée"
      title="Réserver une réparation"
      intro="Deux façons de faire : choisissez directement un créneau, ou décrivez votre problème et laissez-nous vous rappeler."
      icon="calendar"
      :crumbs="[{ label: 'Réparer', to: '/reparation' }, { label: 'Réserver' }]"
    />

    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <!-- Colonne réservation -->
        <div>
          <div class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-full bg-terracotta font-bold text-creme">1</span>
            <h2 class="text-xl font-bold text-charbon">Choisir un créneau de dépôt</h2>
          </div>
          <p class="mt-2 pl-12 text-charbon/70">
            Vous déposez le vélo au créneau réservé. On diagnostique et on vous donne
            un devis clair avant d'intervenir.
          </p>

          <!-- Fil d'étapes -->
          <ol class="mt-6 flex items-center gap-2 text-sm" aria-label="Étapes de la réservation">
            <li
              v-for="(s, i) in steps"
              :key="s.key"
              class="flex items-center gap-2"
              :aria-current="currentStepIndex === i ? 'step' : undefined"
            >
              <span
                class="grid size-6 place-items-center rounded-full text-xs font-bold transition-colors"
                :class="i <= currentStepIndex ? 'bg-terracotta text-creme' : 'bg-charbon/10 text-charbon/50'"
              >{{ i + 1 }}</span>
              <span :class="i <= currentStepIndex ? 'font-medium text-charbon' : 'text-charbon/45'">
                {{ s.label }}
              </span>
              <span v-if="i < steps.length - 1" class="mx-1 h-px w-4 bg-charbon/15" aria-hidden="true" />
            </li>
          </ol>

          <div class="mt-6">
            <!-- Étape 1 : sélection du créneau -->
            <div v-if="step === 'select'" class="space-y-4">
              <p class="text-sm text-charbon/60">{{ capacityNote }}</p>
              <div class="grid gap-4 sm:grid-cols-2">
                <BookingCalendar
                  :days="days"
                  :visible-month="visibleMonth"
                  :selected-date="selectedDate"
                  :loading="loading"
                  :error="error"
                  @month-change="setMonth($event.year, $event.month)"
                  @select="selectDay"
                />
                <BookingSlots
                  :type="bookingType"
                  :day="selectedDay"
                  :selected-slot="selectedSlot"
                  :loading="loading"
                  @select="selectSlot"
                />
              </div>

              <div
                v-if="selectedSlot"
                class="flex flex-col gap-3 rounded-2xl bg-charbon p-4 text-creme sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <p class="text-sm">
                  Créneau choisi :
                  <span class="font-semibold">{{ dayLabel }} à {{ slotTime }}</span>
                </p>
                <UButton color="primary" size="lg" class="font-semibold" @click="goToForm">
                  Continuer
                  <template #trailing><TechIcon name="arrowRight" :size="18" /></template>
                </UButton>
              </div>
            </div>

            <!-- Étape 2 : coordonnées -->
            <BookingForm
              v-else-if="step === 'form'"
              :type="bookingType"
              :contact="contact"
              @submit="goToSummary"
              @back="backTo('select')"
            />

            <!-- Étape 3 : récapitulatif -->
            <BookingSummary
              v-else-if="step === 'summary'"
              :type="bookingType"
              :day-label="dayLabel"
              :time="slotTime"
              :contact="contact"
              :submitting="submitting"
              @confirm="submit"
              @edit-slot="backTo('select')"
              @edit-info="backTo('form')"
            />

            <!-- Étape 4 : confirmation -->
            <BookingConfirmation
              v-else-if="step === 'done' && result"
              :result="result"
              :type="bookingType"
              :day-label="dayLabel"
              :time="slotTime"
              @restart="reset"
            />
          </div>
        </div>

        <!-- Colonne "qu'est-ce qui vous amène" -->
        <aside>
          <div class="sticky top-24 rounded-2xl bg-charbon p-6 text-creme sm:p-7">
            <h2 class="text-lg font-bold">Qu'est-ce qui vous amène ?</h2>
            <p class="mt-2 text-creme/80">
              Pas besoin de connaître le nom des pièces. Décrivez simplement le problème
              que vous rencontrez, avec vos mots.
            </p>
            <figure class="mt-5 rounded-xl bg-creme/10 p-4">
              <blockquote class="text-creme/95">
                « Mon frein arrière fait du bruit et freine moins bien. »
              </blockquote>
              <figcaption class="mt-2 text-sm text-creme/60">
                Un exemple parfait.
              </figcaption>
            </figure>
            <ul class="mt-5 space-y-2.5 text-sm text-creme/85">
              <li class="flex items-start gap-2.5">
                <TechIcon name="check" :size="18" class="mt-0.5 shrink-0 text-terracotta-300" />
                On identifie l'origine du problème pour vous
              </li>
              <li class="flex items-start gap-2.5">
                <TechIcon name="check" :size="18" class="mt-0.5 shrink-0 text-terracotta-300" />
                Un devis avant toute intervention
              </li>
              <li class="flex items-start gap-2.5">
                <TechIcon name="check" :size="18" class="mt-0.5 shrink-0 text-terracotta-300" />
                Aucun jargon mécanique exigé
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- Alternative : demande de rappel -->
      <section id="rappel" class="mt-16 scroll-mt-24">
        <div class="rounded-2xl border border-dashed border-charbon/25 bg-charbon/[0.03] p-6 sm:p-8">
          <div class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-full bg-terracotta font-bold text-creme">2</span>
            <h2 class="text-xl font-bold text-charbon">Vous ne savez pas quel créneau choisir ?</h2>
          </div>
          <p class="mt-2 max-w-2xl pl-12 text-charbon/70">
            Certains problèmes se règlent mieux après un échange. Décrivez le vôtre :
            l'atelier vous recontacte pour trouver la meilleure solution.
          </p>
          <div class="mt-6">
            <RecallForm />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
