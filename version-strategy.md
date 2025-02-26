# Stratégie de Gestion des Versions - CryptoCare

Ce document définit la stratégie de gestion des versions pour la plateforme CryptoCare, afin d'assurer un déploiement contrôlé des nouvelles fonctionnalités et corrections tout en minimisant l'impact sur les utilisateurs actifs.

## 1. Schéma de numérotation des versions

CryptoCare utilise un schéma de versionnement sémantique (SemVer) sous la forme `X.Y.Z` où:

- **X**: Version majeure - Changements incompatibles avec les versions précédentes
- **Y**: Version mineure - Ajout de fonctionnalités rétro-compatibles
- **Z**: Version de correctif - Corrections de bugs rétro-compatibles

Exemples:
- `1.0.0`: Version initiale
- `1.1.0`: Ajout de nouvelles fonctionnalités
- `1.1.1`: Correction de bugs sur la version 1.1.0
- `2.0.0`: Changements majeurs ou refonte d'architecture

### Versions pré-release

Pour les versions en test, un suffixe sera ajouté:
- `1.0.0-alpha.1`: Version alpha (usage interne uniquement)
- `1.0.0-beta.1`: Version beta (testeurs externes)
- `1.0.0-rc.1`: Release candidate (prête pour la production)

## 2. Cycles de release

### 2.1 Planification des releases

- **Releases majeures (X.0.0)**: Planifiées 2 fois par an
- **Releases mineures (X.Y.0)**: Planifiées toutes les 6 semaines
- **Releases de correctifs (X.Y.Z)**: Déployées selon les besoins, généralement chaque semaine

### 2.2 Release spéciales

- **Hotfixes**: Correctifs d'urgence pour des bugs critiques, déployés dès validation
- **Security patches**: Correctifs de sécurité, déployés dans les 24h suivant la découverte d'une vulnérabilité

## 3. Processus de déploiement

### 3.1 Environnements

Le déploiement suit une progression à travers plusieurs environnements:

1. **Développement**: Environnement de développement continu
2. **Test**: Déploiement automatique après intégration continue
3. **Staging**: Réplique de la production pour les tests finaux
4. **Production**: Environnement utilisateur final

### 3.2 Stratégie de déploiement progressif

Pour minimiser les risques, les déploiements en production suivent une approche progressive:

1. **Canary release** (5% des utilisateurs)
   - Déploiement initial auprès d'un petit groupe d'utilisateurs
   - Monitoring intensif pendant 24h

2. **Déploiement par région** (si le canary est stable)
   - Déploiement d'abord en Suisse (marché principal)
   - Puis extension à la France et autres marchés

3. **Déploiement complet** (100% des utilisateurs)
   - Après validation de l'absence de problèmes majeurs

### 3.3 Fenêtres de déploiement

- **Releases planifiées**: Mardi, 10h00 CET (faible activité utilisateur)
- **Hotfixes**: Dès que prêts, après validation
- **Maintenance planifiée**: Dimanche entre 02h00 et 06h00 CET (notifiée 48h à l'avance)

## 4. Gestion des branches Git

### 4.1 Modèle de branches

CryptoCare utilise une version adaptée du Gitflow:

- `main`: Branche de production stable
- `develop`: Branche d'intégration pour le développement
- `feature/*`: Branches de fonctionnalités
- `release/*`: Branches de préparation de release
- `hotfix/*`: Branches de correctifs urgents

### 4.2 Cycle de vie des branches

```
  hotfix/*     release/*     feature/*
      │             │             │
      │             │             │
      ▼             ▼             ▼
┌───────────────────────────────────┐
│               main                │
└───────────────┬───────────────────┘
                │
                ▼
┌───────────────────────────────────┐
│              develop              │
└───────────────────────────────────┘
```

1. Les nouvelles fonctionnalités sont développées dans des branches `feature/*`
2. Le code est fusionné dans `develop` après revue
3. Une branche `release/*` est créée pour la préparation des releases
4. Après les tests, `release/*` est fusionnée dans `main` et `develop`
5. Les hotfixes sont appliqués sur `main` puis fusionnés dans `develop`

## 5. Gestion des versions des API

### 5.1 Versionnement des API

Les API de CryptoCare sont versionnées indépendamment des applications:

- Inclusion de la version dans l'URL: `/api/v1/appointments`
- Support de plusieurs versions simultanément
- Période de dépréciation minimale de 6 mois pour les anciennes versions

### 5.2 Compatibilité ascendante

- Les API maintiennent une compatibilité ascendante au sein d'une même version majeure
- Les changements incompatibles nécessitent une nouvelle version majeure
- Documentation des changements dans un changelog accessible aux développeurs

## 6. Migration des données

### 6.1 Stratégie de migration

- Migrations automatiques lors des déploiements
- Tests préalables sur une copie de la base de données de production
- Sauvegardes avant chaque migration

### 6.2 Gestion des schémas de base de données

- Les changements de schéma sont versionnés avec des migrations numérotées
- Les migrations sont appliquées de manière séquentielle
- Support de rollback pour chaque migration

## 7. Communication des changements

### 7.1 Documentation des changements

Pour chaque version:

- **Changelog**: Liste détaillée des modifications techniques
- **Release notes**: Résumé des nouvelles fonctionnalités pour les utilisateurs
- **Documentation API**: Mise à jour pour les développeurs

### 7.2 Communication aux utilisateurs

- **Changements majeurs**: Email et notification in-app 2 semaines avant
- **Nouvelles fonctionnalités**: Notification in-app et tooltips
- **Correctifs**: Changelog public sur le site

## 8. Gestion des versions mobiles

### 8.1 Spécificités des applications mobiles

- Déploiement via App Store (iOS) et Google Play (Android)
- Délai d'approbation pris en compte dans la planification (1-3 jours)
- Versionnement coordonné avec le backend et frontend web

### 8.2 Stratégie de mise à jour

- **Mises à jour souples**: Pour les fonctionnalités et améliorations
- **Mises à jour forcées**: Pour les problèmes de sécurité critiques ou incompatibilités d'API

### 8.3 Rétrocompatibilité

- Support des 3 dernières versions mineures de l'application mobile
- Message incitant à la mise à jour pour les versions plus anciennes
- Blocage des versions incompatibles avec notification explicative

## 9. Rollback et gestion des incidents

### 9.1 Procédure de rollback

En cas de problème critique après déploiement:

1. Évaluation rapide de l'impact (< 10 minutes)
2. Décision de rollback si nécessaire
3. Restauration de la version précédente
4. Communication aux utilisateurs affectés
5. Analyse post-mortem

### 9.2 Plan de reprise d'activité

- Temps de reprise d'activité (RTO) cible: < 1 heure
- Point de reprise d'activité (RPO) cible: < 5 minutes
- Tests de rollback réguliers durant les fenêtres de maintenance

## 10. Indicateurs de performance (KPIs)

Pour mesurer l'efficacité du processus de gestion des versions:

- Temps moyen entre les déploiements
- Taux d'échec des déploiements
- Nombre d'incidents post-déploiement
- Temps moyen de déploiement
- Temps moyen de résolution des incidents
- Satisfaction utilisateur post-déploiement

## 11. Matrice de responsabilité

| Rôle | Responsabilités |
|------|----------------|
| Product Owner | Priorisation des fonctionnalités, validation des releases |
| Tech Lead | Planification technique des releases, revue d'architecture |
| DevOps | Automatisation du déploiement, monitoring |
| QA Lead | Validation des releases, tests de non-régression |
| Frontend Dev | Implémentation web/mobile, tests unitaires |
| Backend Dev | Implémentation API, migrations, tests unitaires |

## 12. Calendrier des versions pour 2025

| Version | Date prévue | Fonctionnalités principales |
|---------|-------------|----------------------------|
| 1.0.0-alpha | Mars 2025 | Core MVP (interne uniquement) |
| 1.0.0-beta | Mai 2025 | Paiement Bitcoin, intégration Zoom |
| 1.0.0 | 1er Juillet 2025 | Lancement public (Zoug) |
| 1.1.0 | Mi-Août 2025 | Fonctionnalités d'avis, statistiques pros |
| 1.2.0 | Septembre 2025 | Extension géographique (France) |
| 2.0.0 | Janvier 2026 | Intégration dossier médical externe |

## Conclusion

Cette stratégie de gestion des versions doit permettre de minimiser les risques liés aux déploiements tout en maximisant la valeur ajoutée pour les utilisateurs. Elle sera réévaluée périodiquement (tous les 3 mois) et adaptée selon les besoins du projet et les retours d'expérience.
