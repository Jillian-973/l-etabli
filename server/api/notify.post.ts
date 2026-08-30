// Inscription "être informé·e" du lancement des vélos d'occasion.
// STUB : à connecter à la liste de diffusion / e-mail de l'atelier.
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim() ?? ''

  if (!/.+@.+\..+/.test(email)) {
    throw createError({ statusCode: 422, statusMessage: 'E-mail invalide.' })
  }

  // TODO: enregistrer l'e-mail (Resend, Brevo, Google Sheet, webhook…).
  console.info('[notify] Inscription vélos d’occasion:', email)

  return { ok: true }
})
