# Architecture Système - CryptoCare

## Vue d'ensemble

L'architecture de CryptoCare est conçue pour être modulaire, sécurisée et évolutive, tout en respectant les contraintes de protection des données médicales conformément à la LPD suisse et au RGPD européen.

## Diagramme d'architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                       │
│  ┌────────────┐     ┌─────────────┐     ┌──────────────────────┐    │
│  │ Application│     │  Application │     │      Navigateur      │    │
│  │   iOS      │     │   Android   │     │        Web           │    │
│  └─────┬──────┘     └──────┬──────┘     └───────────┬──────────┘    │
└────────┼─────────────────┬─┼──────────────────────┬─┘                
         │                 │ │                      │                  
         │                 │ │                      │  HTTPS/SSL       
         │                 │ │                      │                  
┌────────┼─────────────────┼─┼──────────────────────┼─────────────────┐
│        │   LOAD BALANCER │ │                      │                 │
│        └─────────────────┼─┼──────────────────────┘                 │
│                          │ │                                        │
│          ┌───────────────┘ └───────────┐                           │
│          │                             │                           │
│   ┌──────▼──────┐               ┌──────▼──────┐                    │
│   │  Frontend   │               │   Backend   │                    │
│   │  Server     │◄─────REST─────►   API       │                    │
│   │  (React.js) │               │  (Node.js)  │                    │
│   └─────────────┘               └──────┬──────┘                    │
│                                        │                           │
│                                ┌───────▼───────┐                   │
│                                │  PostgreSQL   │                   │
│                                │  Database     │                   │
│                                └───────────────┘                   │
└────────────────────────────────────────┬───────────────────────────┘
                                         │
┌────────────────────────────────────────┼───────────────────────────┐
│                SERVICES EXTERNES        │                           │
│                                         │                           │
│  ┌────────────────┐           ┌────────▼─────────┐                 │
│  │                │           │                  │                 │
│  │    Zoom API    │◄────────►│  Swiss Bitcoin   │                 │
│  │                │           │    Pay API       │                 │
│  └────────────────┘           └──────────────────┘                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Description des composants

### 1. Clients

Trois points d'accès principaux pour les utilisateurs:
- **Application iOS**: Développée avec React Native
- **Application Android**: Développée avec React Native
- **Application Web**: Développée avec React.js, responsive pour ordinateurs et smartphones

### 2. Frontend

- **Technologie**: React.js/React Native
- **Responsabilités**:
  - Interface utilisateur responsive
  - Validation des entrées utilisateur
  - Gestion de l'état de l'application
  - Affichage des QR codes pour les paiements Bitcoin
  - Intégration avec le SDK Zoom pour les téléconsultations
  - Gestion des formulaires et du calendrier
  - Internationalisation (FR/EN)

### 3. Backend API

- **Technologie**: Node.js avec Express.js
- **Responsabilités**:
  - Exposition des endpoints REST
  - Authentification et autorisation (JWT)
  - Validation des données
  - Logique métier
  - Communication avec la base de données
  - Intégration avec les services externes (Zoom, Swiss Bitcoin Pay)
  - Gestion des événements asynchrones (webhooks)
  - Génération des tokens pour les téléconsultations
  - Logging et surveillance

### 4. Base de données PostgreSQL

- **Contenu**: Stocke toutes les données structurées sauf les données médicales
  - Utilisateurs (patients et professionnels)
  - Rendez-vous (date, heure, statut)
  - Disponibilités des professionnels
  - Paiements (montant, statut, timestamps)
  - Pas de stockage de données médicales sensibles

### 5. Services externes

- **Zoom API**:
  - Création automatique de réunions
  - Génération de liens d'invitation
  - Gestion des téléconsultations
  
- **Swiss Bitcoin Pay API**:
  - Génération de factures Bitcoin (Lightning Network)
  - QR codes pour paiements
  - Confirmation de paiement via webhooks
  - Vérification du statut des transactions

## Flux de données

### Prise de rendez-vous et paiement

1. Le patient recherche un professionnel via l'application
2. Le patient sélectionne un créneau disponible
3. L'API backend vérifie la disponibilité en temps réel
4. L'API génère une facture via Swiss Bitcoin Pay (0,0005 BTC)
5. Le frontend affiche le QR code de paiement Lightning Network
6. Le patient effectue le paiement depuis son portefeuille Bitcoin
7. Swiss Bitcoin Pay notifie le backend via webhook
8. L'API backend confirme le rendez-vous et crée une réunion Zoom
9. Le lien Zoom est envoyé par email et disponible dans l'application

### Téléconsultation

1. À l'heure du rendez-vous, le patient et le professionnel accèdent au lien Zoom
2. La consultation se déroule via Zoom
3. Le statut du rendez-vous est mis à jour dans la base de données
4. Aucune donnée médicale n'est stockée sur les serveurs CryptoCare

## Mesures de sécurité

1. **Transport des données**:
   - HTTPS/TLS pour toutes les communications
   - Headers de sécurité configurés (HSTS, CSP, etc.)

2. **Authentification**:
   - JWT avec expiration (24h)
   - Stockage sécurisé des mots de passe (bcrypt)
   - Double authentification pour les professionnels

3. **Protection des données**:
   - Chiffrement AES-256 pour les données sensibles
   - Pas de stockage de données médicales
   - Conformité RGPD (droit à l'effacement)

4. **Infrastructure**:
   - Pare-feu configuré
   - Accès SSH restreint
   - Monitoring et alertes

## Scalabilité

- **Horizontale**: Ajout de serveurs API derrière le load balancer
- **Verticale**: Augmentation des ressources des serveurs
- **Base de données**: Réplication pour la lecture, partitionnement pour la scalabilité

## Haute disponibilité

- **Load balancing**: Distribution de la charge
- **Surveillance**: Prometheus et Grafana
- **Mécanismes de reprise**: Redémarrage automatique des services
- **Sauvegarde**: Sauvegarde quotidienne de la base de données

## Environnements

1. **Développement**:
   - Instance locale pour les développeurs
   - Base de données de test

2. **Test/Staging**:
   - Réplique de la production
   - Données anonymisées pour les tests

3. **Production**:
   - Infrastructure complète
   - Monitoring complet
   - Sauvegardes automatisées
