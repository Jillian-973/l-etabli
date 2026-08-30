<script setup lang="ts">
// Formulaire de coordonnées. Réutilise les composants de formulaire du projet
// (UForm/UFormField/UInput/UTextarea). Validation client ; le serveur revalide.
import type { BookingContact, BookingType } from '#shared/types/booking'

const props = defineProps<{
  type: BookingType
  contact: BookingContact
}>()

const emit = defineEmits<{ (e: 'submit'): void; (e: 'back'): void }>()

const emailPattern = /.+@.+\..+/

function validate(state: BookingContact) {
  const errors: { name: string; message: string }[] = []
  if (!state.firstName?.trim()) errors.push({ name: 'firstName', message: 'Indiquez votre prénom.' })
  if (!state.email?.trim()) {
    errors.push({ name: 'email', message: 'Un e-mail est nécessaire pour la confirmation.' })
  } else if (!emailPattern.test(state.email.trim())) {
    errors.push({ name: 'email', message: 'Cet e-mail semble incomplet.' })
  }
  return errors
}

const problemLabel = computed(() =>
  props.type === 'repair' ? 'Décrivez le problème' : 'Un mot sur votre projet (facultatif)',
)
</script>

<template>
  <UForm
    :state="contact"
    :validate="validate"
    class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-7"
    @submit="emit('submit')"
  >
    <h3 class="text-base font-bold text-charbon">Vos coordonnées</h3>
    <p class="mt-1 text-sm text-charbon/60">
      Pour vous envoyer la confirmation et vous joindre si besoin.
    </p>

    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      <UFormField label="Prénom" name="firstName" required>
        <UInput
          v-model="contact.firstName"
          autocomplete="given-name"
          placeholder="Camille"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Nom" name="lastName">
        <UInput
          v-model="contact.lastName"
          autocomplete="family-name"
          placeholder="Dupont"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="E-mail" name="email" required>
        <UInput
          v-model="contact.email"
          type="email"
          inputmode="email"
          autocomplete="email"
          spellcheck="false"
          placeholder="camille@exemple.fr"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Téléphone (facultatif)" name="phone">
        <UInput
          v-model="contact.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          placeholder="06 12 34 56 78"
          size="lg"
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField
      :label="problemLabel"
      name="problem"
      class="mt-4"
      help="Avec vos mots, sans jargon technique."
    >
      <UTextarea
        v-model="contact.problem"
        :rows="4"
        placeholder="Ex. : mon frein arrière fait du bruit et freine moins bien…"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <UButton color="neutral" variant="ghost" size="lg" @click="emit('back')">
        <template #leading><TechIcon name="arrowRight" :size="18" class="rotate-180" /></template>
        Retour aux créneaux
      </UButton>
      <UButton type="submit" color="primary" size="xl" class="font-semibold">
        Vérifier ma réservation
        <template #trailing><TechIcon name="arrowRight" :size="18" /></template>
      </UButton>
    </div>
  </UForm>
</template>
