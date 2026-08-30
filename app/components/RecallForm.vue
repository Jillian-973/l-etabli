<script setup lang="ts">
const toast = useToast()

const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  problem: '',
  availability: '',
})

const loading = ref(false)
const submitted = ref(false)

const emailPattern = /.+@.+\..+/

// Validation après soumission (on ne bloque jamais la saisie).
function validate(s: typeof state) {
  const errors: { name: string; message: string }[] = []
  if (!s.firstName.trim()) errors.push({ name: 'firstName', message: 'Indiquez votre prénom.' })
  if (!s.problem.trim())
    errors.push({ name: 'problem', message: 'Décrivez brièvement le problème rencontré.' })

  const hasEmail = s.email.trim().length > 0
  const hasPhone = s.phone.trim().length > 0
  if (!hasEmail && !hasPhone) {
    errors.push({ name: 'email', message: 'Laissez un e-mail ou un téléphone pour être recontacté.' })
    errors.push({ name: 'phone', message: 'Laissez un e-mail ou un téléphone pour être recontacté.' })
  } else if (hasEmail && !emailPattern.test(s.email.trim())) {
    errors.push({ name: 'email', message: 'Cet e-mail semble incomplet.' })
  }
  return errors
}

async function onSubmit() {
  loading.value = true
  try {
    // Point d'intégration : à connecter à l'e-mail / CRM de l'atelier.
    await $fetch('/api/rappel', {
      method: 'POST',
      body: {
        firstName: state.firstName.trim(),
        lastName: state.lastName.trim(),
        email: state.email.trim(),
        phone: state.phone.trim(),
        problem: state.problem.trim(),
        availability: state.availability.trim(),
      },
    })
    submitted.value = true
  } catch {
    toast.add({
      title: 'Envoi impossible pour le moment',
      description: 'Réessayez ou contactez-nous directement par téléphone.',
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Confirmation : pas de cul-de-sac, on propose une suite -->
  <div
    v-if="submitted"
    class="rounded-2xl bg-creme-50 p-8 text-center ring-1 ring-charbon/10"
  >
    <span class="inline-grid size-14 place-items-center rounded-full bg-terracotta text-creme">
      <TechIcon name="check" :size="30" label="Demande envoyée" />
    </span>
    <h3 class="mt-4 text-xl font-bold text-charbon">C'est noté, merci&nbsp;!</h3>
    <p class="mx-auto mt-2 max-w-md text-charbon/70">
      L'atelier vous recontacte rapidement pour trouver le bon créneau. En attendant,
      vous pouvez consulter nos infos pratiques.
    </p>
    <div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
      <UButton to="/infos-pratiques" color="neutral" variant="outline" size="lg">
        Voir les infos pratiques
      </UButton>
      <UButton to="/" color="primary" size="lg">Retour à l'accueil</UButton>
    </div>
  </div>

  <UForm
    v-else
    :state="state"
    :validate="validate"
    class="rounded-2xl bg-creme-50 p-5 ring-1 ring-charbon/10 sm:p-7"
    @submit="onSubmit"
  >
    <div class="grid gap-4 sm:grid-cols-2">
      <UFormField label="Prénom" name="firstName" required>
        <UInput
          v-model="state.firstName"
          autocomplete="given-name"
          placeholder="Camille"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Nom" name="lastName">
        <UInput
          v-model="state.lastName"
          autocomplete="family-name"
          placeholder="Dupont"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="E-mail" name="email" hint="E-mail ou téléphone">
        <UInput
          v-model="state.email"
          type="email"
          inputmode="email"
          autocomplete="email"
          spellcheck="false"
          placeholder="camille@exemple.fr"
          size="lg"
          class="w-full"
        />
      </UFormField>
      <UFormField label="Téléphone" name="phone" hint="E-mail ou téléphone">
        <UInput
          v-model="state.phone"
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
      label="Décrivez le problème"
      name="problem"
      required
      class="mt-4"
      help="Avec vos mots, sans jargon technique."
    >
      <UTextarea
        v-model="state.problem"
        :rows="4"
        placeholder="Ex. : mon frein arrière fait du bruit et freine moins bien…"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Vos disponibilités (facultatif)"
      name="availability"
      class="mt-4"
    >
      <UInput
        v-model="state.availability"
        placeholder="Ex. : plutôt en fin de journée, ou le samedi…"
        size="lg"
        class="w-full"
      />
    </UFormField>

    <div class="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-charbon/60">
        Réponse sous 48&nbsp;h ouvrées. Vos informations restent entre nous.
      </p>
      <UButton
        type="submit"
        color="primary"
        size="xl"
        :loading="loading"
        class="font-semibold"
      >
        Demander un rappel
      </UButton>
    </div>
  </UForm>
</template>
