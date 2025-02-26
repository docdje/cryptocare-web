# Maquettes UI/UX - CryptoCare

Ce document décrit les principales interfaces utilisateur de la plateforme CryptoCare. Les wireframes présentés ici constituent une référence pour le développement frontend.

## Charte graphique

### Couleurs

- **Primaire**: `#0052CC` (Bleu royal)
- **Secondaire**: `#FF8C00` (Orange Bitcoin)
- **Accent**: `#32CD32` (Vert confirmation)
- **Fond clair**: `#F5F7FA`
- **Fond foncé**: `#172B4D`
- **Texte principal**: `#172B4D`
- **Texte secondaire**: `#6B778C`
- **Erreur**: `#DE350B`

### Typographie

- **Titres**: Montserrat, sans-serif
- **Corps de texte**: Open Sans, sans-serif
- **Monospace** (pour les adresses Bitcoin): Roboto Mono, monospace

### Iconographie

- Style épuré et minimaliste
- Ensemble cohérent d'icônes (Material Design ou similaire)
- Icône Bitcoin pour les paiements
- Icône Zoom pour les téléconsultations

## Wireframes clés

### 1. Page d'accueil (Web)

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] CryptoCare                 [FR/EN] [Connexion][Inscription] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Image de bannière                     │  │
│  │  Consultez des professionnels de santé à distance      │  │
│  │  et payez en Bitcoin                                   │  │
│  │                                                        │  │
│  │  [Trouver un spécialiste]      [Comment ça marche]     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ SIMPLICITÉ     │ │ SÉCURITÉ       │ │ BITCOINS       │  │
│  │                │ │                │ │                │  │
│  │ Prenez RDV     │ │ Données        │ │ Paiements      │  │
│  │ depuis chez    │ │ protégées      │ │ rapides et     │  │
│  │ vous 24/7      │ │ et cryptées    │ │ sécurisés      │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ NOS SPÉCIALITÉS                                       │  │
│  │                                                        │  │
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│  │
│  │ │Médecine│ │Dermato-│ │Psycho- │ │Nutri-  │ │  Voir  ││  │
│  │ │générale│ │ logie  │ │ logie  │ │ tion   │ │ tous + ││  │
│  │ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘│  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ COMMENT ÇA MARCHE                                     │  │
│  │                                                        │  │
│  │ 1. Trouvez un spécialiste                             │  │
│  │ 2. Choisissez un créneau disponible                   │  │
│  │ 3. Payez en Bitcoin (Lightning Network)               │  │
│  │ 4. Recevez votre lien de consultation Zoom            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Recherche de professionnels (Web/Mobile)

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] CryptoCare                 [Notifications] [Profil]  │
├─────────────────────────────────────────────────────────────┤
│  RECHERCHE DE PROFESSIONNELS                                │
│                                                             │
│  ┌─────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐  │
│  │ Spécialité ▼ │ │ Pays      ▼ │ │ Date      ▼ │ │Rechercher│  │
│  └─────────────┘ └────────────┘ └────────────┘ └─────────┘  │
│                                                             │
│  Résultats (15)                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ┌─────┐  Dr. Martin Dupont                            │  │
│  │ │     │  Dermatologie                                 │  │
│  │ │ IMG │  ★★★★☆ (28 avis)                             │  │
│  │ └─────┘  Disponible: Aujourd'hui, Demain              │  │
│  │          Prix: 0,0005 BTC                             │  │
│  │          [Voir profil]     [Prendre rendez-vous]      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ┌─────┐  Dr. Sophie Lambert                           │  │
│  │ │     │  Médecine générale                            │  │
│  │ │ IMG │  ★★★★★ (42 avis)                             │  │
│  │ └─────┘  Disponible: Demain, Après-demain             │  │
│  │
