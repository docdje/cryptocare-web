# Plan de Conformité RGPD/LPD - CryptoCare

## Introduction

Ce document détaille la stratégie de conformité de CryptoCare aux réglementations sur la protection des données, notamment la Loi fédérale sur la protection des données (LPD) en Suisse et le Règlement Général sur la Protection des Données (RGPD) en Europe.

En tant que plateforme de télémédecine traitant des données personnelles sensibles, CryptoCare s'engage à respecter les normes les plus strictes en matière de confidentialité et de protection des données tout en utilisant une approche innovante basée sur le principe "pas de stockage de données médicales".

## 1. Cadre réglementaire

### 1.1 Réglementations applicables

- **LPD (Suisse)**: Loi fédérale sur la protection des données, version révisée de 2023
- **RGPD (UE/EEE)**: Règlement (UE) 2016/679, applicable aux clients de France et autres pays européens
- **Règles sectorielles**: Exigences spécifiques à la télémédecine en Suisse et en Europe

### 1.2 Principes fondamentaux

| Principe | Application chez CryptoCare |
|----------|----------------------------|
| Licéité, loyauté et transparence | Consentement explicite, politique de confidentialité claire |
| Limitation des finalités | Utilisation des données uniquement pour la facilitation des consultations |
| Minimisation des données | Collecte des données strictement nécessaires, pas de stockage de données médicales |
| Exactitude | Mécanismes permettant aux utilisateurs de mettre à jour leurs informations |
| Limitation de conservation | Suppression ou anonymisation des données après la période nécessaire |
| Intégrité et confidentialité | Chiffrement de bout en bout, mesures de sécurité robustes |
| Responsabilité | Documentation, audits réguliers, DPO désigné |

## 2. Cartographie des données personnelles

### 2.1 Types de données collectées et traitées

#### 2.1.1 Données des patients

| Catégorie | Données | Finalité | Base légale | Durée de conservation |
|-----------|---------|----------|------------|----------------------|
| Identification | Nom, prénom, email, mot de passe (haché) | Création de compte, authentification | Consentement, Exécution du contrat | Durée du compte + 1 an |
| Contact | Téléphone | Notifications, support d'urgence | Consentement, Intérêt légitime | Durée du compte + 1 an |
| Agenda | Dates et heures des rendez-vous | Gestion des consultations | Exécution du contrat | 2 ans après le rendez-vous |
| Paiement | Historique des transactions Bitcoin | Facturation, preuve de paiement | Exécution du contrat, Obligation légale | 10 ans (obligation comptable) |
| Technique | Adresse IP, logs de connexion | Sécurité, détection de fraude | Intérêt légitime | 12 mois |

#### 2.1.2 Données des professionnels

| Catégorie | Données | Finalité | Base légale | Durée de conservation |
|-----------|---------|----------|------------|----------------------|
| Identification | Nom, prénom, email, mot de passe (haché) | Création de compte, authentification | Consentement, Exécution du contrat | Durée du compte + 1 an |
| Professionnel | Spécialité, qualifications, numéro professionnel | Vérification, présentation aux patients | Exécution du contrat, Obligation légale | Durée du compte + 5 ans |
| Contact | Téléphone, adresse professionnelle | Communication, vérification | Consentement, Intérêt légitime | Durée du compte + 1 an |
| Agenda | Disponibilités, rendez-vous | Gestion des consultations | Exécution du contrat | 2 ans après le rendez-vous |
| Financier | Adresse Bitcoin, historique des paiements reçus | Paiement des services | Exécution du contrat, Obligation légale | 10 ans (obligation comptable) |

### 2.2 Données sensibles et approche spécifique

**Principe clé**: CryptoCare ne stocke aucune donnée médicale sur ses serveurs.

| Type de données sensibles | Approche de CryptoCare |
|--------------------------|------------------------|
| Contenu des consultations | Non enregistré ni stocké |
| Diagnostics et traitements | Non enregistrés ni stockés |
| Informations médicales | Non enregistrées ni stockées |
| Ordonnances | Gérées directement par le professionnel hors plateforme |

Cette approche "zéro stockage médical" constitue un avantage majeur en termes de conformité RGPD/LPD et de sécurité pour les utilisateurs.

### 2.3 Flux de données

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Application  │     │    Backend    │     │  Base de      │
│  Web/Mobile   │<───>│    API        │<───>│  données      │
└───────┬───────┘     └───────┬───────┘     └───────────────┘
        │                     │
        │                     │
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│  Zoom API     │     │ Swiss Bitcoin │
│  (externe)    │     │ Pay (externe) │
└───────────────┘     └───────────────┘
```

#### Points d'attention particuliers:

- **Transmission des données** entre le frontend et le backend via HTTPS chiffré
- **Transmission aux services tiers** (Zoom, Swiss Bitcoin Pay) limitée au strict minimum nécessaire
- **Absence de transfert de données médicales** vers les services tiers

## 3. Mesures techniques et organisationnelles

### 3.1 Sécurité des données

| Mesure | Description |
|--------|-------------|
| Chiffrement en transit | HTTPS/TLS 1.3 pour toutes les communications |
| Chiffrement au repos | AES-256 pour les données sensibles stockées |
| Hachage des mots de passe | Algorithme bcrypt avec sel unique |
| Protection des API | Authentification JWT, limitation de débit |
| Sécurité de l'infrastructure | Pare-feu, détection d'intrusion, mises à jour régulières |
| Sauvegardes | Chiffrées, testées régulièrement, avec des contrôles d'accès stricts |

### 3.2 Contrôles d'accès

| Type d'accès | Mesures |
|--------------|---------|
| Accès utilisateur | Authentification multifacteur pour tous les utilisateurs |
| Accès administrateur | MFA obligatoire, accès basé sur les rôles, journalisation détaillée |
| Accès développeur | Accès limité aux environnements de production, revue de code |
| Accès tiers | Audit des intégrations, accès minimaux nécessaires |

### 3.3 Surveillance et journalisation

- Journalisation de toutes les actions sensibles (connexion, modifications de données, etc.)
- Surveillance automatisée des événements de sécurité
- Analyse régulière des logs pour détecter les comportements suspects
- Conservation des logs pendant 12 mois avec contrôles d'accès stricts

## 4. Droits des personnes concernées

### 4.1 Processus de gestion des droits

| Droit | Mise en œuvre | Délai de réponse |
|-------|---------------|------------------|
| Information | Politique de confidentialité claire et accessible | Immédiat |
| Accès | Téléchargement des données depuis le profil utilisateur | Immédiat (automatisé) |
| Rectification | Modification directe dans le profil utilisateur | Immédiat (automatisé) |
| Effacement | Fonction de suppression de compte avec confirmation | 72 heures max. |
| Limitation du traitement | Possibilité de suspendre le compte | 24 heures max. |
| Portabilité | Export des données en format JSON/CSV | Immédiat (automatisé) |
| Opposition | Configuration des préférences marketing et analytiques | Immédiat (automatisé) |
| Non-profilage automatisé | Pas de décision automatisée basée sur le profilage | N/A |

### 4.2 Interfaces utilisateur pour l'exercice des droits

#### 4.2.1 Interface web/mobile

- Section dédiée "Confidentialité et données" dans les paramètres du compte
- Tableau de bord intuitif pour visualiser et gérer ses données
- Formulaires de contact directs pour les demandes spécifiques
- Processus de suppression de compte en deux étapes avec confirmation

#### 4.2.2 Exemple de flux pour la suppression de compte

```
1. Utilisateur → Paramètres → Confidentialité → "Supprimer mon compte"
2. Écran d'information expliquant les conséquences
3. Confirmation par mot de passe
4. Confirmation par email avec lien de validation
5. Suppression technique des données (72h max)
6. Email de confirmation de suppression
```

## 5. Consentement et transparence

### 5.1 Politique de confidentialité

La politique de confidentialité sera:
- Rédigée en langage clair et accessible
- Disponible en français et en anglais (+ allemand à terme)
- Accessible avant l'inscription et à tout moment dans l'application
- Mise à jour en cas de changement avec notification aux utilisateurs
- Versionnable avec historique des modifications

### 5.2 Recueil du consentement

| Moment | Méthode | Conservation |
|--------|---------|--------------|
| Création de compte | Case à cocher active + lien vers politique | Horodatage et version acceptée |
| Collecte de données supplémentaires | Consentement contextuel explicite | Horodatage et détail du consentement |
| Intégrations tierces | Consentement spécifique pour Zoom | Horodatage et service concerné |
| Cookies | Bannière de consentement conforme | Préférences stockées localement |

### 5.3 Transparence des traitements

- Information claire sur les finalités de chaque collecte de données
- Explication du modèle "zéro stockage de données médicales"
- Transparence sur les intégrations tierces (Zoom, Swiss Bitcoin Pay)
- Communication claire sur les durées de conservation

## 6. Sous-traitants et transferts de données

### 6.1 Principaux sous-traitants

| Sous-traitant | Localisation | Données transférées | Garanties |
|---------------|--------------|---------------------|----------|
| DigitalOcean | Suisse (région Zurich) | Toutes les données d'application | Clauses contractuelles, centre de données en Suisse |
| Zoom | États-Unis | Noms, emails, horaires des RDV | Clauses contractuelles types, minimisation des données |
| Swiss Bitcoin Pay | Suisse | Montants, identifiants de transaction | Entreprise suisse, données en Suisse |
| SendGrid | États-Unis | Emails, noms pour notifications | Clauses contractuelles types, minimisation des données |

### 6.2 Garanties pour les transferts internationaux

- Utilisation de clauses contractuelles types de l'UE
- Analyse d'impact pour les transferts vers les États-Unis
- Minimisation des données transférées hors Suisse/UE
- Préférence pour l'hébergement en Suisse ou dans l'UE

## 7. Procédures en cas d'incident

### 7.1 Gestion des violations de données

#### 7.1.1 Détection et classification

| Niveau | Critères | Exemples |
|--------|----------|----------|
| Critique | Accès non autorisé à des données sensibles à grande échelle | Compromission de la base de données |
| Élevé | Accès non autorisé à des données d'un nombre limité d'utilisateurs | Compromission de comptes administrateurs |
| Moyen | Accès non autorisé à des données non sensibles | Exposition d'adresses email |
| Faible | Incident sans accès à des données personnelles | Tentative d'intrusion échouée |

#### 7.1.2 Procédure de réponse

```
1. Détection et alerte → Équipe sécurité
2. Évaluation initiale et classification → DPO + RSSI
3. Confinement et correction → Équipe technique
4. Analyse d'impact et documentation → DPO
5. Notification aux autorités si nécessaire (72h) → DPO
6. Notification aux personnes concernées si nécessaire → DPO + Direction
7. Actions correctives et préventives → Équipe technique
8. Rapport post-incident et leçons apprises → Direction
```

### 7.2 Notifications réglementaires

- **Autorités**: PFPDT (Suisse), CNIL (France) selon la portée de l'incident
- **Délai**: 72 heures maximum après prise de connaissance
- **Contenu**: Nature de la violation, catégories et nombre approximatif de personnes concernées, conséquences probables, mesures prises

## 8. Analyse d'impact sur la protection des données (AIPD)

Une AIPD complète a été réalisée pour la plateforme CryptoCare, avec les résultats suivants:

### 8.1 Résumé de l'AIPD

| Aspect | Évaluation | Mesures d'atténuation |
|--------|------------|------------------------|
| Nécessité et proportionnalité | Données limitées au strict nécessaire | Principe de minimisation appliqué systématiquement |
| Risques pour les droits et libertés | Modérés en raison de l'absence de stockage de données médicales | Chiffrement, séparation des données, anonymisation |
| Mesures de sécurité | Adéquates pour le niveau de risque identifié | Revues de sécurité régulières, tests de pénétration |
| Conclusion | Traitement acceptable sous réserve d'application des mesures | Suivi régulier des risques et des mesures |

### 8.2 Registre des traitements

Un registre des activités de traitement est maintenu conformément à l'article 30 du RGPD, incluant:
- Description des activités de traitement
- Finalités du traitement
- Catégories de données et de personnes concernées
- Catégories de destinataires
- Transferts vers des pays tiers
- Délais de suppression
- Description des mesures de sécurité

## 9. Gouvernance et responsabilités

### 9.1 Organisation interne

| Rôle | Responsabilités |
|------|----------------|
| Direction | Responsabilité globale, allocation des ressources |
| Délégué à la Protection des Données (DPO) | Conformité RGPD/LPD, point de contact pour les autorités |
| Responsable Sécurité (RSSI) | Mise en œuvre des mesures de sécurité |
| Équipe juridique | Contrats, clauses de confidentialité |
| Développeurs | Privacy by Design, implémentation des mesures techniques |
| Support client | Gestion des demandes des utilisateurs |

### 9.2 Documentation et preuves

Documentation maintenue et régulièrement mise à jour:
- Politique de protection des données
- Registre des traitements
- Analyses d'impact
- Preuves de consentement
- Procédures de sécurité
- Journaux d'audit et de formation

## 10. Formation et sensibilisation

### 10.1 Programme de formation

| Public | Contenu | Fréquence |
|--------|---------|-----------|
| Tous les employés | Sensibilisation générale à la protection des données | À l'embauche + annuel |
| Développeurs | Privacy by Design, sécurité des données | Semestriel |
| Support client | Gestion des demandes RGPD/LPD | Trimestriel |
| Direction | Responsabilités légales, gestion des risques | Annuel |

### 10.2 Culture de la confidentialité

- Intégration de la protection des données dans les valeurs de l'entreprise
- Privacy by Design comme principe fondamental de développement
- Responsabilisation de chaque collaborateur
- Communication régulière sur l'importance de la protection des données

## 11. Plan d'action et améliorations continues

### 11.1 Actions à court terme (avant lancement)

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Finalisation de la politique de confidentialité | DPO + Juridique | Mai 2025 |
| Implémentation des interfaces pour les droits des personnes | Développement | Juin 2025 |
| Test de pénétration complet | RSSI + Externe | Juin 2025 |
| Formation de tous les employés | DPO | Juin 2025 |
| Signature des avenants avec tous les sous-traitants | Juridique | Mai 2025 |

### 11.2 Actions à moyen terme (6 mois post-lancement)

| Action | Responsable | Échéance |
|--------|-------------|----------|
| Audit externe de conformité RGPD/LPD | DPO + Externe | Décembre 2025 |
| Révision de l'AIPD après premiers retours d'usage | DPO | Janvier 2026 |
| Automatisation accrue des processus de conformité | Développement | Février 2026 |
| Expansion du programme de formation | DPO + RH | Janvier 2026 |

## 12. Avantage concurrentiel de l'approche "zéro stockage médical"

L'approche unique de CryptoCare, consistant à ne pas stocker de données médicales sur ses serveurs, présente plusieurs avantages stratégiques:

1. **Conformité simplifiée**: Réduction significative des risques réglementaires
2. **Confiance des utilisateurs**: Argument de confidentialité fort pour les patients
3. **Responsabilité réduite**: Limitation de l'impact potentiel en cas de violation
4. **Modèle d'affaires transparent**: Clarté sur l'utilisation des données personnelles

Cette approche sera mise en avant dans la communication et le marketing comme un différenciateur majeur par rapport aux plateformes concurrentes.

## Conclusion

Ce plan de conformité RGPD/LPD démontre l'engagement de CryptoCare à protéger les données de ses utilisateurs tout en offrant un service innovant de télémédecine avec paiement en Bitcoin. L'approche "zéro stockage de données médicales" constitue un avantage compétitif majeur et un exemple de Privacy by Design réussi.

La conformité n'est pas vue comme une simple obligation légale mais comme une opportunité de construire une relation de confiance durable avec les utilisateurs, élément essentiel dans le domaine sensible de la santé.
