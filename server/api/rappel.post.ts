// Réception d'une demande de rappel.
// STUB : à connecter à l'e-mail / au CRM de l'atelier (envoi de mail, webhook…).
export default defineEventHandler(async (event) => {
  const body = await readBody<{
    firstName?: string
    email?: string
    phone?: string
    problem?: string
  }>(event)

  if (!body?.firstName || !body?.problem || (!body?.email && !body?.phone)) {
    throw createError({ statusCode: 422, statusMessage: 'Champs requis manquants.' })
  }

  // TODO: brancher l'envoi réel (Nodemailer, Resend, webhook…).
  console.info('[rappel] Nouvelle demande de rappel reçue:', {
    firstName: body.firstName,
    hasEmail: Boolean(body.email),
    hasPhone: Boolean(body.phone),
  })

  return { ok: true }
})
