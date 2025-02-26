# Métriques de Performance - CryptoCare

Ce document définit les indicateurs clés de performance (KPI) et les métriques techniques qui seront utilisés pour mesurer le succès de la plateforme CryptoCare et garantir une expérience utilisateur optimale.

## 1. Métriques d'expérience utilisateur

### 1.1 Performances techniques

| Métrique | Objectif | Méthode de mesure | Seuil critique |
|----------|----------|-------------------|----------------|
| Temps de chargement initial (web) | < 2s | Lighthouse, RUM | > 3.5s |
| Temps de chargement initial (mobile) | < 3s | Firebase Performance | > 5s |
| First Contentful Paint | < 1.2s | Lighthouse | > 2.5s |
| Time to Interactive | < 3.8s | Lighthouse | > 5.5s |
| Temps de réponse API (moyenne) | < 200ms | Monitoring backend | > 500ms |
| Temps de réponse API (p95) | < 400ms | Monitoring backend | > 800ms |
| Taux d'erreur API | < 0.1% | Logs serveur | > 1% |

### 1.2 Performances des fonctionnalités critiques

| Métrique | Objectif | Méthode de mesure | Seuil critique |
|----------|----------|-------------------|----------------|
| Temps de génération QR code Bitcoin | < 2s | Logs d'application | > 5s |
| Délai de confirmation de paiement Bitcoin | < 5s | Logs d'application | > 15s |
| Temps de génération lien Zoom | < 2s | Logs d'application | > 6s |
| Temps de recherche professionnels | < 1s | RUM, logs | > 3s |
| Temps d'affichage calendrier disponibilités | < 1.5s | RUM | > 4s |

## 2. Métriques d'engagement

### 2.1 Acquisition et rétention

| Métrique | Objectif | Période de mesure | Tendance souhaitée |
|----------|----------|-------------------|-------------------|
| Nouveaux utilisateurs | 500/mois | Mensuelle | Croissance 10% |
| Taux de conversion visiteur → inscription | > 5% | Hebdomadaire | Croissance |
| Taux de conversion inscription → premier RDV | > 40% | Mensuelle | Croissance |
| Taux de rétention D1 | > 30% | Quotidienne | Croissance |
| Taux de rétention D7 | > 15% | Hebdomadaire | Croissance |
| Taux de rétention D30 | > 10% | Mensuelle | Croissance |
| Churn mensuel | < 5% | Mensuelle | Décroissance |

### 2.2 Engagement des patients

| Métrique | Objectif | Période de mesure | Tendance souhaitée |
|----------|----------|-------------------|-------------------|
| Nombre moyen de RDV par patient | > 2 par an | Trimestrielle | Croissance |
| Temps moyen dans l'application | > 5 min | Hebdomadaire | Croissance |
| Taux de complétion du profil | > 85% | Mensuelle | Croissance |
| Taux d'utilisation mobile vs web | 60% / 40% | Mensuelle | Stable |
| Nombre de consultations manquées | < 5% | Mensuelle | Décroissance |
| Net Promoter Score (NPS) | > 50 | Trimestrielle | Croissance |

### 2.3 Engagement des professionnels

| Métrique | Objectif | Période de mesure | Tendance souhaitée |
|----------|----------|-------------------|-------------------|
| Nombre de créneaux disponibles par pro | > 10 par semaine | Hebdomadaire | Croissance |
| Taux d'occupation des créneaux | > 60% | Mensuelle | Croissance |
| Taux de réponse aux demandes de RDV | > 90% dans les 24h | Hebdomadaire | Stable |
| Taux de rétention des pros à 6 mois | > 80% | Semestrielle | Croissance |
| Revenus moyens par pro | > 0.01 BTC/mois | Mensuelle | Croissance |
| Satisfaction des pros (enquête) | > 4.2/5 | Trimestrielle | Croissance |

## 3. Métriques commerciales

### 3.1 Revenus et croissance

| Métrique | Objectif | Période de mesure | Tendance souhaitée |
|----------|----------|-------------------|-------------------|
| Volume total de transactions | 2.0 BTC/mois | Mensuelle | Croissance 15% |
| Nombre de consultations réalisées | 4000/mois | Mensuelle | Croissance 10% |
| Revenu moyen par utilisateur (ARPU) | 0.0015 BTC | Mensuelle | Croissance |
| Customer Acquisition Cost (CAC) | < 0.0008 BTC | Trimestrielle | Décroissance |
| Ratio LTV:CAC | > 3:1 | Trimestrielle | Croissance |
| Taux de conversion entonnoir de paiement | > 85% | Hebdomadaire | Croissance |
| Croissance MoM des revenus | > 12% | Mensuelle | Stable |

### 3.2 Utilisation par segment

| Métrique | Objectif | Période de mesure | Tendance souhaitée |
|----------|----------|-------------------|-------------------|
| Répartition patients par pays | CH: 70%, FR: 30% | Mensuelle | Adaptation stratégie |
| Répartition par spécialité | Diversification | Mensuelle | Équilibrage |
| Répartition par tranche horaire | Optimisation créneaux | Hebdomadaire | Équilibrage |
| Répartition par appareil | Mobile > 60% | Mensuelle | Stable |
| Consultations par jour de la semaine | Équilibre | Hebdomadaire | Équilibrage |

## 4. Métriques techniques et opérationnelles

### 4.1 Disponibilité et fiabilité

| Métrique | Objectif | Méthode de mesure | Seuil critique |
|----------|----------|-------------------|----------------|
| Uptime global | > 99.9% | Monitoring | < 99.5% |
| Uptime API | > 99.95% | Monitoring | < 99.8% |
| Taux de succès des paiements Bitcoin | > 99% | Logs d'application | < 97% |
| Taux de succès des intégrations Zoom | > 99.5% | Logs d'application |
