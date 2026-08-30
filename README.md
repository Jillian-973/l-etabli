# L'Établi — site de l'atelier

Site vitrine et de réservation pour **L'Établi**, atelier indépendant de réparation
et d'autoréparation de vélos.

- **Réparation confiée** — le client dépose son vélo, l'atelier répare.
- **Atelier participatif** — le client vient réparer lui-même, accompagné.
- **Vélos d'occasion** — section présente mais *bientôt disponible* (pas de catalogue).

## Stack

- [Nuxt 4](https://nuxt.com) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [Nuxt UI 3](https://ui.nuxt.com)
- Police **DM Sans** (Google Fonts)

## Identité graphique

Palette imposée (3 couleurs), définie dans [`app/assets/css/main.css`](app/assets/css/main.css) :

| Rôle | Couleur | Hex |
| --- | --- | --- |
| Fond principal | Crème | `#F3EBDD` |
| Texte / éléments sombres | Charbon | `#20231F` |
| Accent (CTA, liens, actifs) | Terre cuite | `#D5673C` |

> Le texte terre cuite sur crème utilise une nuance plus foncée (`terracotta-700`)
> pour respecter le contraste AA, tout en gardant `#D5673C` pour les aplats, CTA,
> icônes et traits.

## Démarrage

```bash
npm install --legacy-peer-deps   # voir note ci-dessous
npm run dev                      # http://localhost:3000
```

```bash
npm run build     # build de production
npm run preview   # prévisualiser le build
```

> **Note d'installation :** avec npm 10.9.2, `npm install` peut échouer sur un bug
> arborist (`Cannot read properties of null (reading 'edgesOut')`). Utiliser
> `npm install --legacy-peer-deps`.
>
> **Note de chemin :** le dossier du projet ne doit **pas** contenir d'apostrophe
> (`l'etabli` casse la génération de code de Nuxt/Vite). Le dossier a été renommé
> `l-etabli`. Le nom affiché du site reste « L'Établi ».

## Structure

```
app/
  assets/css/main.css     # thème (palette, DM Sans, motifs)
  components/             # Header, Footer, Hero, OfferCard, BookingCTA,
                          # Faq/FaqItem, AvailabilityCard, WorkshopCard,
                          # BikeCard, ContactBlock, BookingWidget, RecallForm…
  composables/            # useSessions (prochaines sessions d'atelier)
  layouts/default.vue     # header + contenu + footer + CTA sticky mobile
  pages/                  # / reparation atelier-participatif velos-occasion
                          # letabli infos-pratiques (+ /reserver, /[slug])
  utils/content.ts        # contenu éditorial (nav, contact, FAQ, capacités)
  app.config.ts           # thème Nuxt UI (primary = terre cuite)
server/api/               # rappel.post.ts, notify.post.ts (stubs à brancher)
```

## Points d'intégration (à brancher)

- **Réservation Calendly** — le composant `BookingWidget` affiche un aperçu tant
  qu'aucune URL n'est fournie. Passer l'URL d'embed pour activer le calendrier :
  `<BookingWidget url="https://calendly.com/…" />`. Aucune autre partie de
  l'interface ne dépend du fournisseur.
- **Formulaire de rappel** — `server/api/rappel.post.ts` : brancher l'envoi
  e-mail / CRM (Resend, Nodemailer, webhook…).
- **« Être informé » (vélos d'occasion)** — `server/api/notify.post.ts` : brancher
  la liste de diffusion.
- **Coordonnées** — valeurs de démonstration dans `app/utils/content.ts`
  (adresse, téléphone, e-mail, Instagram, horaires) : remplacer par les infos réelles.
- **Photographies** — les composants `PhotoFrame` sont des emplacements stylisés
  en attendant les vraies photos de l'atelier.
