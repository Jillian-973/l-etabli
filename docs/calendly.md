# Intégration Calendly — L'Établi

Réservation **native** au site : l'utilisateur reste dans l'interface de L'Établi
du début à la fin. Calendly sert de moteur (disponibilités, créneaux) en coulisses,
appelé uniquement côté serveur. Le frontend n'appelle jamais Calendly directement.

```
Interface L'Établi → composants booking/ → /api/calendly/* → Calendly API
```

> ⚠️ **Périmètre actuel** : seule la **réparation confiée** (`repair`) est active.
> L'**atelier participatif** (`workshop`) est câblé dans l'architecture mais pas
> encore activé (URI vide → l'API répond 501). Voir « Activer l'atelier » plus bas.

---

## 1. Créer le token Calendly

1. Se connecter au compte Calendly de l'atelier.
2. Aller dans **Integrations & apps → API & webhooks** :
   <https://calendly.com/integrations/api_webhooks>
3. Section **Personal Access Tokens** → créer un token.
4. Le copier immédiatement (il ne sera plus affiché).

Le token est **secret** : il reste strictement côté serveur, n'est jamais exposé
au navigateur, jamais journalisé, jamais commité.

## 2. Variables d'environnement

Copier `.env.example` en `.env` (déjà ignoré par git) et renseigner :

```env
CALENDLY_ACCESS_TOKEN=            # le Personal Access Token (secret)
CALENDLY_REPAIR_EVENT_TYPE_URI=   # URI API de "Réparation confiée"
CALENDLY_WORKSHOP_EVENT_TYPE_URI= # laisser vide tant que l'atelier n'est pas activé
```

Elles sont lues dans `nuxt.config.ts` via `runtimeConfig` **privé** (jamais
`runtimeConfig.public`, jamais de préfixe `NUXT_PUBLIC_`).

## 3. Récupérer les Event Type URI

L'**URI API** (≠ l'URL publique) est nécessaire côté serveur.

- URL publique (à ne PAS utiliser ici) :
  `https://calendly.com/<compte>/reparation-confiee`
- URI API (à utiliser) :
  `https://api.calendly.com/event_types/XXXXXXXX`

Pour la lister, appeler `GET https://api.calendly.com/event_types?user=<user_uri>`
avec le header `Authorization: Bearer <token>`, et repérer l'event type par son nom.

Valeur actuellement configurée pour la réparation :

```
CALENDLY_REPAIR_EVENT_TYPE_URI=https://api.calendly.com/event_types/2b9ccba1-f8ce-46db-a6e1-f24bdbf28c85
```

## 4. Architecture des endpoints

| Fichier | Rôle |
| --- | --- |
| `server/utils/calendly.ts` | Client centralisé : token, headers, requêtes, découpage 7 jours, cache, transformation, URL pré-remplie. Seul endroit qui connaît Calendly. |
| `server/api/calendly/availability.get.ts` | `GET /api/calendly/availability?type=repair&start=YYYY-MM-DD&end=YYYY-MM-DD` → jours + créneaux nettoyés. |
| `server/api/calendly/booking.post.ts` | `POST /api/calendly/booking` → valide, **re-vérifie la disponibilité**, prépare la réservation. |
| `shared/types/booking.ts` | Types partagés app ↔ serveur. |
| `shared/booking.mock.ts` | Données fictives (dev) quand le token n'est pas configuré. |
| `app/composables/useBooking.ts` | Logique frontend (chargement, sélection, étapes, erreurs). |
| `app/components/booking/*` | UI (sélecteur, calendrier, créneaux, formulaire, récap, confirmation). |

Le parcours est intégré à la page existante `app/pages/reparation/reserver.vue`
(pas de page de réservation isolée).

## 5. Fonctionnement de l'API

- **Disponibilités** : le serveur interroge `event_type_available_times` de Calendly
  par fenêtres de **7 jours maximum** (limite de l'API), fusionne les résultats,
  les regroupe par jour (fuseau **Europe/Paris**) et ne renvoie que le nécessaire.
  Un **cache mémoire de 90 s** évite d'appeler Calendly à chaque interaction.
- **Réservation** : le serveur revalide toutes les données (jamais confiance au
  navigateur) puis **reconfirme la disponibilité du créneau** juste avant de rendre
  la main, afin d'éviter les doubles réservations. En cas de créneau déjà pris, il
  répond `409` / `slot_taken` et le frontend propose d'en choisir un autre.

## 6. Lancement local

```bash
npm install --legacy-peer-deps
npm run dev            # http://localhost:3000/reparation/reserver
```

- **Avec** `.env` renseigné → vraies disponibilités Calendly.
- **Sans** token (dev uniquement) → données **fictives** automatiques, pour
  développer l'interface sans dépendre du compte réel.

## 7. Mise en production

- Ne jamais committer `.env` (déjà dans `.gitignore`).
- Définir les mêmes variables dans les **variables d'environnement de l'hébergeur**
  (`CALENDLY_ACCESS_TOKEN`, `CALENDLY_REPAIR_EVENT_TYPE_URI`, …).
- En production, l'absence de token renvoie une erreur explicite (pas de mock).

## 8. Limitations liées au plan Calendly

Compte actuel = **Calendly Free**. Vérifié par diagnostic + documentation officielle :

| Capacité | Free | Détail |
| --- | --- | --- |
| Lire les Event Types | ✅ | `event_types:read` |
| Lire les disponibilités | ✅ | fenêtres ≤ 7 jours par requête |
| Places restantes (atelier de groupe) | ✅* | champ `invitees_remaining` (si l'event est configuré en groupe) |
| **Créer un RDV directement via API** | ❌ | **Scheduling API (Create Event Invitee) = plan PAYANT + app OAuth** |
| Webhooks (confirmation temps réel) | ❌ | plan payant |

**Conséquence pour la réservation** (mode `handoff`) : sur le plan Free, la dernière
étape de confirmation se fait sur la **page sécurisée Calendly**, pré-remplie avec le
créneau exact et les coordonnées de l'utilisateur (ni redirection automatique, ni
iframe : l'utilisateur clique un bouton depuis l'écran de confirmation du site).

**Passage à un plan payant** : il suffira de remplacer le bloc « handoff » de
`server/api/calendly/booking.post.ts` par un appel de création (Scheduling API) et
de renvoyer `status: 'confirmed'`. Le frontend et les types gèrent déjà ce cas
(écran « Réservation confirmée »).

## 9. Activer l'atelier participatif (plus tard)

1. Configurer l'event type « Atelier participatif » dans Calendly (idéalement en
   **événement de groupe**, 8 places).
2. Renseigner `CALENDLY_WORKSHOP_EVENT_TYPE_URI` dans `.env`.
3. Exposer le parcours `workshop` (le code le gère déjà : type, capacité via
   `invitees_remaining`, affichage des places dans `BookingSlots`).

Tant que l'URI est vide, `type=workshop` renvoie volontairement `501`.
