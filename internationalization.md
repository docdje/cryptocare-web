# Stratégie pour le Support Multilingue - CryptoCare

Ce document détaille la stratégie d'internationalisation (i18n) pour la plateforme CryptoCare, permettant de prendre en charge plusieurs langues tout en maintenant une expérience utilisateur cohérente.

## 1. Langues supportées

### 1.1 Langues initiales

La plateforme supportera initialement deux langues:
- **Français (fr)**: Langue principale pour les utilisateurs suisses romands et français
- **Anglais (en)**: Langue secondaire, utilisée comme langue par défaut pour l'interface

### 1.2 Langues planifiées

En fonction de l'expansion de la plateforme, les langues suivantes seront ajoutées ultérieurement:
- **Allemand (de)**: Pour la Suisse alémanique (prévu pour Q4 2025)
- **Italien (it)**: Pour la Suisse italienne (prévu pour Q1 2026)

## 2. Architecture technique

### 2.1 Frontend (Web)

#### 2.1.1 Bibliothèque i18n

Le frontend web utilise **i18next** avec les plugins suivants:
- `react-i18next`: Intégration React
- `i18next-http-backend`: Chargement des traductions via HTTP
- `i18next-browser-languagedetector`: Détection automatique de la langue

#### 2.1.2 Structure des fichiers

```
frontend/
├── public/
│   └── locales/
│       ├── fr/
│       │   ├── common.json
│       │   ├── auth.json
│       │   ├── appointment.json
│       │   ├── payment.json
│       │   └── profile.json
│       └── en/
│           ├── common.json
│           ├── auth.json
│           ├── appointment.json
│           ├── payment.json
│           └── profile.json
└── src/
    └── i18n/
        └── index.js  // Configuration i18next
```

#### 2.1.3 Exemple de fichier de traduction

```json
// locales/fr/appointment.json
{
  "booking": {
    "title": "Prise de rendez-vous",
    "select_date": "Sélectionnez une date",
    "select_time": "Sélectionnez un horaire",
    "confirm": "Confirmer le rendez-vous",
    "price": "Prix: {{price}} BTC",
    "success": "Rendez-vous confirmé avec succès!",
    "error": "Erreur lors de la prise de rendez-vous"
  },
  "calendar": {
    "available": "Disponible",
    "unavailable": "Indisponible",
    "today": "Aujourd'hui",
    "no_slots": "Aucun créneau disponible"
  }
}
```

#### 2.1.4 Implémentation dans les composants React

```jsx
import { useTranslation } from 'react-i18next';

function AppointmentForm() {
  const { t } = useTranslation('appointment');
  
  return (
    <div>
      <h2>{t('booking.title')}</h2>
      <p>{t('booking.select_date')}</p>
      <button>{t('booking.confirm')}</button>
      <p>{t('booking.price', { price: 0.0005 })}</p>
    </div>
  );
}
```

### 2.2 Application Mobile (React Native)

#### 2.2.1 Bibliothèque i18n

L'application mobile utilise **i18n-js** avec:
- `react-native-localize`: Détection de la langue du système

#### 2.2.2 Structure des fichiers

```
mobile/
└── src/
    ├── i18n/
    │   ├── index.js  // Configuration i18n
    │   └── translations/
    │       ├── fr.js
    │       └── en.js
    └── components/
```

#### 2.2.3 Exemple de fichier de traduction

```javascript
// translations/fr.js
export default {
  appointment: {
    booking: {
      title: 'Prise de rendez-vous',
      select_date: 'Sélectionnez une date',
      select_time: 'Sélectionnez un horaire',
      confirm: 'Confirmer le rendez-vous',
      price: 'Prix: {{price}} BTC',
      success: 'Rendez-vous confirmé avec succès!',
      error: 'Erreur lors de la prise de rendez-vous'
    },
    // ...
  },
  // ...
};
```

#### 2.2.4 Implémentation dans les composants React Native

```jsx
import i18n from '../i18n';

function AppointmentForm() {
  return (
    <View>
      <Text>{i18n.t('appointment.booking.title')}</Text>
      <Text>{i18n.t('appointment.booking.select_date')}</Text>
      <Button title={i18n.t('appointment.booking.confirm')} />
      <Text>{i18n.t('appointment.booking.price', { price: 0.0005 })}</Text>
    </View>
  );
}
```

### 2.3 Backend (Node.js)

#### 2.3.1 Gestion des langues

Le backend stocke la préférence de langue de l'utilisateur et fournit des messages d'erreur localisés.

```javascript
// Exemple de middleware d'erreur localisé
const errorMessages = {
  en: require('./locales/en/errors.json'),
  fr: require('./locales/fr/errors.json')
};

function errorHandler(err, req, res, next) {
  const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  const supportedLang = ['fr', 'en'].includes(lang) ? lang : 'en';
  
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = errorMessages[supportedLang][errorCode] || err.message;
  
  res.status(err.status || 500).json({
    error: {
      code: errorCode,
      message: message
    }
  });
}
```

#### 2.3.2 Emails et notifications

Les emails et notifications sont envoyés dans la langue préférée de l'utilisateur.

```javascript
// Exemple de service d'email
const emailTemplates = {
  en: require('./email-templates/en'),
  fr: require('./email-templates/fr')
};

async function sendAppointmentConfirmation(user, appointment) {
  const lang = user.languagePreference || 'en';
  const template = emailTemplates[lang].appointmentConfirmation;
  
  // Remplir le template avec les données de rendez-vous
  const emailContent = template.replace('{{date}}', formatDate(appointment.date, lang));
  
  await sendEmail(user.email, emailContent);
}
```

## 3. Gestion des traductions

### 3.1 Organisation

- **Propriétaire**: Product Manager
- **Contributeurs**: Développeurs frontend, designers UX, traducteurs professionnels
- **Processus de validation**: Revue par un locuteur natif avant déploiement

### 3.2 Flux de travail

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Extraction  │   │ Traduction  │   │  Revue et   │   │ Intégration │
│ des textes  ├──►│  externe    ├──►│ validation  ├──►│  au code    │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

1. **Extraction des textes**: Les développeurs identifient les chaînes à traduire
2. **Traduction externe**: Utilisation d'un service professionnel de traduction
3. **Revue et validation**: Vérification par des locuteurs natifs
4. **Intégration au code**: Ajout des traductions dans les fichiers JSON/JS

### 3.3 Outils

- **Lokalise**: Plateforme de gestion des traductions
- **i18next Scanner**: Extraction automatique des clés de traduction du code
- **Scripts CI**: Vérification de l'exhaustivité des traductions

## 4. Contenu dynamique et données

### 4.1 Données multilingues en base de données

Certaines données doivent être stockées en plusieurs langues:

#### 4.1.1 Schéma pour les spécialités médicales

```sql
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE specialty_translations (
    specialty_id INTEGER REFERENCES specialties(id) ON DELETE CASCADE,
    language_code VARCHAR(2) NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (specialty_id, language_code)
);
```

#### 4.1.2 API pour les données multilingues

```javascript
// Exemple de requête API pour les spécialités
router.get('/specialties', async (req, res) => {
  const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  const supportedLang = ['fr', 'en'].includes(lang) ? lang : 'en';
  
  const specialties = await db.query(`
    SELECT s.id, st.name
    FROM specialties s
    JOIN specialty_translations st ON s.id = st.specialty_id
    WHERE st.language_code = $1
    ORDER BY st.name
  `, [supportedLang]);
  
  res.json({ data: specialties });
});
```

### 4.2 Formats localisés

#### 4.2.1 Dates et heures

Utilisation de `Intl.DateTimeFormat` pour formater les dates selon la locale:

```javascript
function formatDate(isoString, locale = 'fr-CH') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(isoString));
}

// Exemple: 7 juillet 2025 (fr) vs. July 7, 2025 (en)
```

#### 4.2.2 Nombres et devises

```javascript
function formatCurrency(amount, currency, locale = 'fr-CH') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Exemple: 34,50 CHF (fr) vs. CHF 34.50 (en)
```

## 5. Sélection et persistance de la langue

### 5.1 Détection initiale

1. Langue préférée stockée dans le profil utilisateur (utilisateurs connectés)
2. Langue stockée dans le localStorage (utilisateurs non connectés)
3. Langue du navigateur/appareil
4. Français comme langue par défaut

### 5.2 Sélecteur de langue

Un sélecteur de langue sera disponible dans:
- L'en-tête du site web
- Les paramètres de l'application mobile
- La page de profil utilisateur (pour sauvegarder la préférence)

### 5.3 Persistance

- La préférence de langue est sauvegardée dans le profil utilisateur
- Pour les utilisateurs non connectés: stockage dans localStorage/AsyncStorage
- Utilisation de cookies pour maintenir la préférence entre les sessions

## 6. Tests et assurance qualité

### 6.1 Tests automatisés

- **Tests unitaires**: Vérification du chargement des traductions
- **Tests d'intégration**: Changement de langue, persistance
- **Tests visuels**: Débordements de texte, alignements

### 6.2 Tests manuels

- Vérification des traductions dans le contexte
- Tests avec des utilisateurs natifs
- Validation des formats de date, heure et devise

### 6.3 Check-list de qualité

```
[ ] Toutes les chaînes de caractères sont externalisées
[ ] Pas de texte codé en dur dans les composants
[ ] Les pluriels sont correctement gérés
[ ] Les formats de date et nombres sont localisés
[ ] L'interface s'adapte aux longueurs variables de texte
[ ] L'expérience est cohérente dans toutes les langues
```

## 7. Ajout d'une nouvelle langue

### 7.1 Processus

1. **Préparation**:
   - Création des fichiers de traduction vides
   - Duplication des structures de la langue de référence (français)

2. **Traduction**:
   - Extraction des clés à traduire
   - Envoi au service de traduction
   - Réception et intégration des traductions

3. **Validation**:
   - Revue par un locuteur natif
   - Tests d'affichage et fonctionnels
   - Correction des anomalies

4. **Déploiement**:
   - Ajout de la langue au sélecteur
   - Mise à jour de la documentation
   - Communication aux utilisateurs

### 7.2 Estimation des ressources

Pour chaque nouvelle langue:
- **Effort de traduction**: ~3000 mots
- **Effort de développement**: 2 jours-homme
- **Effort de test**: 1 jour-homme
- **Coût estimé**: ~1500 CHF (incluant traduction professionnelle)

## 8. Bonnes pratiques

### 8.1 Pour les développeurs

- Ne jamais coder en dur des chaînes de caractères visibles par l'utilisateur
- Utiliser des clés de traduction explicites et hiérarchiques
- Fournir du contexte pour les traducteurs dans les commentaires
- Éviter les constructions de phrases dynamiques complexes
- Prévoir de l'espace pour l'expansion du texte (les traductions peuvent être 30% plus longues)

### 8.2 Pour les designers

- Concevoir des interfaces flexibles qui s'adaptent à différentes longueurs de texte
- Prévoir un espace suffisant pour les langues qui nécessitent plus de caractères
- Éviter d'utiliser du texte dans les images
- Tester les maquettes avec différentes langues

## 9. Métriques et KPIs

- **Couverture de traduction**: % des chaînes traduites
- **Qualité de traduction**: Nombre d'erreurs signalées par les utilisateurs
- **Utilisation des langues**: % d'utilisateurs par langue
- **Impact business**: Taux de conversion par langue

## 10. Documentation

### 10.1 Pour les développeurs

Documentation technique détaillée sur l'utilisation des outils i18n:
- Comment ajouter de nouvelles chaînes
- Comment tester les traductions
- Comment gérer les cas spéciaux (pluriels, interpolation, formatage)

### 10.2 Pour les traducteurs

Guide pour les traducteurs:
- Contexte du projet et public cible
- Instructions spécifiques pour chaque section
- Glossaire des termes techniques (Bitcoin, télémédecine, etc.)
- Exemples d'écrans pour contextualiser les traductions

## Conclusion

Cette stratégie d'internationalisation fournit un cadre complet pour implémenter et gérer le support multilingue dans la plateforme CryptoCare. Grâce à cette approche:

1. Les utilisateurs peuvent accéder à la plateforme dans leur langue préférée
2. L'expérience utilisateur reste cohérente entre les différentes langues
3. L'ajout de nouvelles langues est simplifié et standardisé
4. La maintenance des traductions est intégrée au processus de développement

En suivant ces directives, CryptoCare pourra offrir une expérience véritablement internationale, tout en respectant les particularités linguistiques et culturelles de chaque marché cible.

## Annexes

### Exemple de fichier de traduction complet (extrait)

```json
// locales/fr/common.json
{
  "nav": {
    "home": "Accueil",
    "appointments": "Rendez-vous",
    "professionals": "Professionnels",
    "profile": "Profil",
    "logout": "Déconnexion"
  },
  "footer": {
    "terms": "Conditions d'utilisation",
    "privacy": "Politique de confidentialité",
    "contact": "Contact",
    "copyright": "© 2025 CryptoCare SA. Tous droits réservés."
  },
  "errors": {
    "general": "Une erreur est survenue",
    "network": "Problème de connexion réseau",
    "not_found": "Page non trouvée",
    "try_again": "Veuillez réessayer"
  },
  "buttons": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "confirm": "Confirmer",
    "back": "Retour",
    "next": "Suivant"
  },
  "notifications": {
    "success": "Opération réussie",
    "error": "Erreur",
    "info": "Information",
    "warning": "Attention"
  }
}
```

### Traductions sensibles aux terminologies médicales et Bitcoin

```json
// locales/fr/glossary.json
{
  "medical": {
    "teleconsultation": "Téléconsultation",
    "appointment": "Rendez-vous",
    "diagnosis": "Diagnostic",
    "prescription": "Ordonnance",
    "follow_up": "Suivi médical"
  },
  "bitcoin": {
    "payment": "Paiement Bitcoin",
    "lightning_network": "Réseau Lightning",
    "wallet": "Portefeuille Bitcoin",
    "transaction": "Transaction",
    "confirmation": "Confirmation",
    "qr_code": "QR code de paiement"
  }
}
```

### Planification d'implémentation

| Phase | Date | Livrable |
|-------|------|----------|
| Initialisation | Mars 2025 | Structure i18n, FR/EN de base |
| Expansion | Mai 2025 | Traduction complète FR/EN |
| Optimisation | Juin 2025 | Tests, corrections, contexte |
| Lancement | Juillet 2025 | Déploiement avec support FR/EN |
| Allemand | T4 2025 | Ajout du support DE |
| Italien | T1 2026 | Ajout du support IT |
