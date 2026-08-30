// ------------------------------------------------------------------
//  Contenu éditorial centralisé du site L'Établi.
//  (Valeurs de contact = à remplacer par les infos réelles du client.)
// ------------------------------------------------------------------

export interface NavItem {
  label: string
  to: string
  /** CTA visuellement prioritaire dans la navigation */
  cta?: boolean
}

export interface FaqEntry {
  question: string
  answer: string
}

export interface Level {
  label: string
  /** 1 = débutant, 2 = intermédiaire, 3 = confirmé */
  value: 1 | 2 | 3
}

export interface WorkshopSession {
  id: string
  /** Date lisible, ex. « Jeudi 4 septembre » */
  dateLabel: string
  /** Date ISO pour <time datetime> et le tri */
  isoDate: string
  timeRange: string
  theme: string
  level: string
  spotsTotal: number
  spotsLeft: number
}

// --- Navigation principale ---------------------------------------------------

export const siteNav: NavItem[] = [
  { label: "L'Établi", to: '/letabli' },
  { label: 'Réparer', to: '/reparation' },
  { label: 'Apprendre', to: '/atelier-participatif' },
  { label: "Vélos d'occasion", to: '/velos-occasion' },
  { label: 'Infos pratiques', to: '/infos-pratiques' },
  { label: 'Prendre rendez-vous', to: '/reparation/reserver', cta: true },
]

// --- Coordonnées / infos pratiques ------------------------------------------

export const contact = {
  name: "L'Établi",
  tagline: "Atelier de réparation et d'autoréparation de vélos",
  address: {
    street: '6 Bd de l\'Artillerie, 69007 Lyon',
    zip: '69007',
    city: 'Lyon',
  },
  phone: '01 23 45 67 89',
  phoneHref: 'tel:+33123456789',
  email: 'bonjour@letabli.fr',
  instagram: '@letabli.atelier',
  instagramHref: 'https://instagram.com/letabli.atelier',
  mapsHref: 'https://www.openstreetmap.org/search?query=6%20Bd%20de%20l\'Artillerie%2069007%20Lyon',
  hours: [
    { day: 'Lundi', value: 'Fermé' },
    { day: 'Mardi', value: '10h – 13h · 14h – 19h' },
    { day: 'Mercredi', value: '10h – 13h · 14h – 19h' },
    { day: 'Jeudi', value: '10h – 13h · 14h – 20h' },
    { day: 'Vendredi', value: '10h – 13h · 14h – 19h' },
    { day: 'Samedi', value: '10h – 18h' },
    { day: 'Dimanche', value: 'Fermé' },
  ],
}

// --- Capacités (imposées par le brief) --------------------------------------

export const capacity = {
  repairsPerWeek: 25,
  repairDays: 5,
  slotsPerDay: 5,
  workshopsPerWeek: 2,
  seatsPerWorkshop: 8,
}

// --- Étapes « comment ça marche » -------------------------------------------

export const repairSteps = [
  {
    n: 1,
    title: 'Vous décrivez le problème',
    text: "Pas besoin de connaître la mécanique : dites-nous simplement ce qui ne va pas, avec vos mots.",
  },
  {
    n: 2,
    title: 'Vous réservez un créneau',
    text: "Choisissez le moment qui vous arrange, ou demandez à être recontacté si vous hésitez.",
  },
  {
    n: 3,
    title: "L'atelier s'occupe de tout",
    text: "On diagnostique, on vous donne un devis clair avant d'intervenir, puis on répare.",
  },
]

export const workshopSteps = [
  {
    n: 1,
    title: 'Vous venez avec votre vélo',
    text: "Amenez le vélo à réparer. Tout l'outillage de l'atelier est à disposition.",
  },
  {
    n: 2,
    title: 'On vous accompagne',
    text: "Un professionnel vous guide, à votre rythme, quel que soit votre niveau de départ.",
  },
  {
    n: 3,
    title: 'Vous repartez plus autonome',
    text: "Vous réparez vous-même et vous apprenez les gestes pour la prochaine fois.",
  },
]

export const workshopLearnings = [
  'Régler et entretenir vos freins',
  'Réparer une crevaison et changer une chambre à air',
  'Nettoyer et graisser votre transmission',
  'Ajuster un dérailleur qui saute',
  'Vérifier la sécurité de votre vélo avant de rouler',
  'Reconnaître les pièces d’usure à surveiller',
]

// --- FAQ / Réassurance -------------------------------------------------------

export const repairFaq: FaqEntry[] = [
  {
    question: 'Combien coûte une réparation ?',
    answer:
      "Le diagnostic est gratuit. Vous recevez toujours un devis clair avant toute intervention : pas de mauvaise surprise. Le tarif dépend de la main-d’œuvre et des pièces éventuelles, et rien n’est engagé sans votre accord.",
  },
  {
    question: 'Combien de temps faut-il laisser son vélo ?',
    answer:
      "La plupart des réparations courantes sont réalisées dans la semaine. Le délai précis vous est confirmé au moment du dépôt, une fois le problème diagnostiqué.",
  },
  {
    question: 'Puis-je venir sans rendez-vous ?',
    answer:
      "C’est possible, mais l’atelier traite un nombre limité de vélos chaque semaine. Réserver un créneau garantit qu’on pourra s’occuper du vôtre ; sinon, nous vous proposerons le prochain disponible.",
  },
  {
    question: 'Quels vélos sont réparés ?',
    answer:
      "Vélos de ville, VTC, vélos d’enfant, vélos de route, et la plupart des vélos à assistance électrique. En cas de doute, décrivez votre vélo dans une demande de rappel : on vous dira tout de suite.",
  },
  {
    question: 'Comment fonctionne le diagnostic ?',
    answer:
      "Vous décrivez ce que vous constatez (bruit, freinage, vitesses qui sautent…). L’atelier identifie l’origine du problème, vous l’explique simplement et propose la solution la plus adaptée.",
  },
]

export const workshopFaq: FaqEntry[] = [
  {
    question: 'Dois-je savoir réparer un vélo pour participer ?',
    answer:
      "Non, absolument pas. Les ateliers sont ouverts aux débutant·es complet·es. On part de là où vous en êtes, sans jugement.",
  },
  {
    question: 'Que vais-je apprendre pendant l’atelier ?',
    answer:
      "Les gestes essentiels : freins, crevaison, transmission, réglages courants. Vous repartez capable de refaire seul·e ce que vous avez appris.",
  },
  {
    question: 'Quels outils sont disponibles ?',
    answer:
      "Tout l’outillage professionnel de l’atelier est mis à disposition : pied de réparation, clés, démonte-pneus, dérive-chaîne, et l’accompagnement d’un pro.",
  },
  {
    question: 'Que dois-je apporter ?',
    answer:
      "Votre vélo, et de quoi être à l’aise pour bricoler. Les pièces d’usure (câbles, patins, chambre à air…) peuvent être achetées sur place si besoin.",
  },
  {
    question: 'Combien de personnes participent à un atelier ?',
    answer:
      "Huit personnes maximum par session, pour que chacun·e bénéficie d’un vrai accompagnement individuel.",
  },
]

export const generalFaq: FaqEntry[] = [
  {
    question: 'Où se trouve l’atelier ?',
    answer: `${contact.address.street}, ${contact.address.zip} ${contact.address.city}. Voir la page Infos pratiques pour l’accès et les horaires.`,
  },
  {
    question: 'Comment vous contacter ?',
    answer: `Par téléphone au ${contact.phone}, par e-mail à ${contact.email}, ou sur Instagram ${contact.instagram}.`,
  },
]
