# Plan de Test - CryptoCare

Ce document définit la stratégie et les procédures de test pour la plateforme CryptoCare. Il vise à garantir que l'application répond aux exigences fonctionnelles, de performance et de sécurité spécifiées dans le cahier des charges technique.

## 1. Objectifs de test

- Vérifier que toutes les fonctionnalités requises sont correctement implémentées
- Valider l'intégration avec les API externes (Zoom, Swiss Bitcoin Pay)
- S'assurer que l'application est sécurisée et conforme aux réglementations (LPD, RGPD)
- Vérifier la performance et la stabilité sous différentes charges
- Confirmer l'expérience utilisateur sur les différentes plateformes (web, iOS, Android)

## 2. Types de tests

### 2.1 Tests unitaires

**Objectif**: Vérifier le fonctionnement correct des fonctions/méthodes individuelles.

**Portée**:
- Fonctions utilitaires (formatage, validation, etc.)
- Composants React isolés
- Méthodes des services backend
- Modèles de données

**Outils**:
- Frontend: Jest, React Testing Library
- Backend: Mocha, Chai, Sinon
- Mobile: Jest, React Native Testing Library

**Couverture minimale exigée**: 80% du code

### 2.2 Tests d'intégration

**Objectif**: Vérifier l'interaction correcte entre les différents modules et services.

**Portée**:
- Communication entre frontend et backend (API)
- Intégrations avec Zoom API
- Intégrations avec Swiss Bitcoin Pay API
- Interactions avec la base de données

**Outils**:
- Supertest pour les API endpoints
- Mocks et stubs pour les services externes
- Test containers pour la base de données

### 2.3 Tests fonctionnels

**Objectif**: Valider que l'application répond aux exigences fonctionnelles.

**Portée**:
- Flux d'inscription et connexion
- Recherche de professionnels
- Prise de rendez-vous
- Paiement en Bitcoin
- Accès aux téléconsultations
- Gestion du profil et des disponibilités

**Outils**:
- Cypress pour le web
- Detox pour les applications mobiles
- Scénarios de test manuels

### 2.4 Tests de performance

**Objectif**: Vérifier que l'application répond aux exigences de performance spécifiées.

**Portée**:
- Temps de réponse API (< 500ms)
- Temps de génération des liens Zoom (< 2s)
- Temps de confirmation des paiements Bitcoin (< 5s)
- Capacité à supporter 1000 utilisateurs simultanés
- Temps de chargement des pages (< 2s)

**Outils**:
- JMeter pour les tests de charge
- Lighthouse pour les performances web
- New Relic pour le monitoring

### 2.5 Tests de sécurité

**Objectif**: S'assurer que l'application est sécurisée et protège les données des utilisateurs.

**Portée**:
- Authentification et autorisation
- Protection contre les attaques courantes (XSS, CSRF, injection SQL)
- Chiffrement des données sensibles
- Conformité RGPD et LPD

**Outils**:
- OWASP ZAP pour l'analyse automatisée
- SonarQube pour l'analyse statique
- Audit manuel de sécurité

### 2.6 Tests d'utilisabilité

**Objectif**: Valider l'expérience utilisateur sur les différentes plateformes.

**Portée**:
- Parcours utilisateur patient
- Parcours utilisateur professionnel
- Adaptation aux différentes tailles d'écran
- Accessibilité

**Méthodes**:
- Tests avec des utilisateurs réels (5 patients, 5 professionnels)
- Tests d'accessibilité (WCAG 2.1)
- Tests de compatibilité multi-navigateurs et multi-appareils

## 3. Environnements de test

### 3.1 Environnement de développement
- Serveur local pour le développement individuel
- Base de données PostgreSQL locale
- Services externes mockés

### 3.2 Environnement de test
- Serveur dédié similaire à la production
- Base de données isolée avec données de test
- Intégration avec les environnements de test des API externes
- Accessible uniquement en interne

### 3.3 Environnement de pré-production
- Configuration identique à la production
- Données anonymisées de production
- Tests complets avant déploiement
- Accessible à un groupe limité d'utilisateurs beta

### 3.4 Environnement de production
- Infrastructure de production finale
- Base de données de production
- Système de monitoring et alertes actif
- Services de sauvegarde automatisés

## 4. Cas de test critiques

### 4.1 Intégration du paiement Bitcoin

#### TC-BTC-001: Génération QR code de paiement
**Prérequis**: Utilisateur connecté, rendez-vous sélectionné
**Étapes**:
1. Confirmer un créneau de rendez-vous
2. Vérifier la page de paiement
3. Observer le QR code généré

**Résultat attendu**: 
- QR code Lightning Network généré en moins de 2 secondes
- Format compatible avec les principaux portefeuilles Bitcoin

#### TC-BTC-002: Confirmation de paiement
**Prérequis**: Page de paiement ouverte avec QR code
**Étapes**:
1. Effectuer un paiement depuis un portefeuille Lightning Network externe
2. Observer le comportement de l'application

**Résultat attendu**:
- L'application détecte le paiement en moins de 5 secondes
- L'utilisateur est redirigé vers la page de confirmation
- Le rendez-vous passe au statut "Confirmé"
- Les deux parties (patient et professionnel) reçoivent une notification

#### TC-BTC-003: Gestion des paiements expirés
**Prérequis**: Page de paiement ouverte avec QR code
**Étapes**:
1. Attendre l'expiration du QR code (10 minutes)
2. Observer le comportement de l'application

**Résultat attendu**:
- Message d'expiration affiché
- Option de générer un nouveau QR code
- Le rendez-vous reste en statut "En attente de paiement"

#### TC-BTC-004: Remboursement après annulation
**Prérequis**: Rendez-vous payé et confirmé
**Étapes**:
1. Annuler le rendez-vous (par le patient ou le professionnel)
2. Observer le processus de remboursement

**Résultat attendu**:
- Demande de remboursement générée via Swiss Bitcoin Pay
- L'utilisateur est informé du processus de remboursement
- Le statut du paiement passe à "Remboursé"

### 4.2 Intégration Zoom

#### TC-ZOOM-001: Génération lien de consultation
**Prérequis**: Rendez-vous confirmé et payé
**Étapes**:
1. Observer l'email de confirmation
2. Accéder au tableau de bord utilisateur
3. Vérifier les détails du rendez-vous

**Résultat attendu**:
- Lien Zoom généré correctement
- Lien Zoom envoyé par email
- Lien Zoom disponible dans l'interface utilisateur
- Durée de réunion configurée correctement (30 minutes)

#### TC-ZOOM-002: Accès à la consultation
**Prérequis**: Rendez-vous confirmé avec lien Zoom
**Étapes**:
1. Cliquer sur le lien Zoom à l'heure du rendez-vous
2. Observer le comportement

**Résultat attendu**:
- Redirection vers l'application Zoom (web ou native)
- Accès à la salle d'attente
- Le professionnel peut faire entrer le patient
- La consultation démarre normalement

#### TC-ZOOM-003: Gestion des problèmes de connexion
**Prérequis**: Rendez-vous confirmé avec lien Zoom
**Étapes**:
1. Simuler une erreur de connexion Zoom
2. Observer les mécanismes de récupération

**Résultat attendu**:
- Message d'erreur explicite
- Suggestions de dépannage affichées
- Option de contacter le support
- Possibilité de rejoindre à nouveau la réunion

### 4.3 Flux de rendez-vous complet

#### TC-FLOW-001: Parcours utilisateur complet
**Prérequis**: Utilisateur inscrit
**Étapes**:
1. Rechercher un professionnel
2. Consulter son profil et ses disponibilités
3. Sélectionner un créneau
4. Confirmer le rendez-vous
5. Effectuer le paiement
6. Recevoir la confirmation et le lien Zoom
7. Rejoindre la consultation à l'heure prévue

**Résultat attendu**:
- Flux complet sans erreurs
- Tous les emails envoyés correctement
- Notifications reçues aux étapes clés
- Consultation accessible à l'heure prévue

## 5. Données de test

### 5.1 Comptes de test

#### Patients:
- patient1@test.com / Password123
- patient2@test.com / Password123
- patient_premium@test.com / Password123

#### Professionnels:
- docteur1@test.com / Password123 (Dermatologue)
- docteur2@test.com / Password123 (Médecin généraliste)
- psy1@test.com / Password123 (Psychologue)

### 5.2 Environnement Bitcoin de test

- Réseau Bitcoin Testnet pour les tests
- Portefeuilles Lightning Network de test:
  - Wallet of Satoshi (testnet mode)
  - Muun Wallet (testnet mode)
- Faucet Bitcoin Testnet pour obtenir des BTC de test

### 5.3 Comptes Zoom de test

- zoom_test1@cryptocare.ch
- zoom_test2@cryptocare.ch
- Comptes configurés avec les API keys de test

## 6. Automatisation des tests

### 6.1 Stratégie d'automatisation

- Les tests unitaires sont automatisés à 100%
- Les tests d'intégration sont automatisés à 80%
- Les tests fonctionnels critiques sont automatisés via Cypress/Detox
- Les tests de performance sont automatisés via JMeter
- Les tests de sécurité sont partiellement automatisés

### 6.2 Pipeline CI/CD

```
┌─────────────┐    ┌────────────────┐    ┌────────────────┐
│ Commit Code ├───►│ Tests Unitaires ├───►│Tests Intégration│
└─────────────┘    └────────────────┘    └────────┬───────┘
                                                  │
┌─────────────┐    ┌────────────────┐    ┌────────▼───────┐
│  Production ◄────┤ Pré-production ◄────┤ Tests E2E Auto  │
└─────────────┘    └────────────────┘    └────────────────┘
```

- Tests unitaires: Exécutés à chaque commit
- Tests d'intégration: Exécutés à chaque pull request
- Tests fonctionnels automatisés: Exécutés avant déploiement en pré-production
- Tests de sécurité: Exécutés hebdomadairement
- Tests de performance: Exécutés avant chaque release majeure

## 7. Scénarios de test spécifiques au Bitcoin

### 7.1 Validation des montants

- Vérifier que le montant exact (0,0005 BTC) est demandé
- Tester avec différentes valeurs de BTC (conversion EUR/CHF)
- Vérifier le comportement en cas de volatilité du prix

### 7.2 Gestion des délais de confirmation

- Tester le comportement en cas de confirmation lente
- Vérifier les mécanismes de retry
- Tester la résilience en cas de problèmes réseau Lightning

### 7.3 Sécurité des transactions

- Vérifier que les adresses Bitcoin sont correctement formées
- Tester la non-réutilisation des QR codes
- Valider le stockage sécurisé des informations de transaction

## 8. Critères d'acceptation

### 8.1 Critères d'entrée en production

- 100% des tests unitaires passent
- 95% des tests d'intégration passent
- 90% des tests fonctionnels automatisés passent
- Aucun problème de sécurité critique ou élevé
- Performance conforme aux exigences (temps de réponse < 500ms)
- Validation par le client des fonctionnalités principales

### 8.2 Critères de sortie beta

- 95% de satisfaction utilisateur (testé sur 20 patients, 5 pros)
- Moins de 2 incidents critiques par semaine
- Temps moyen entre les pannes > 1 semaine
- Délai moyen de résolution des incidents < 4 heures

## 9. Responsabilités

| Rôle | Responsabilité |
|------|----------------|
| Chef de projet | Supervise le plan de test global |
| Développeur | Tests unitaires et d'intégration |
| QA Engineer | Tests fonctionnels et d'acceptation |
| DevOps | Tests de performance et d'infrastructure |
| Expert sécurité | Tests de sécurité et vulnérabilités |

## 10. Planning de test

| Phase | Date | Activités |
|-------|------|-----------|
| Alpha | Avril 2025 | Tests unitaires, d'intégration |
| Beta fermée | Mai 2025 | Tests fonctionnels, utilisateurs internes |
| Beta ouverte | Juin 2025 | Tests avec utilisateurs externes, performance |
| Pre-launch | Fin juin 2025 | Audit de sécurité, tests de charge |
| Post-launch | Juillet 2025 | Monitoring, tests de régression |

## 11. Rapports et métriques

### 11.1 Rapports périodiques

- Rapport quotidien lors du sprint (bugs, corrections)
- Rapport hebdomadaire (couverture de test, tendances)
- Rapport de fin de sprint (métriques, KPIs)

### 11.2 Métriques de qualité

- Couverture de code des tests
- Nombre de bugs par sévérité
- Taux de bugs réouvert
- Temps moyen de résolution des bugs
- Score de satisfaction utilisateur
- Temps moyen de réponse API
- Taux de réussite des paiements Bitcoin
