# User Stories et Parcours Utilisateurs - CryptoCare

## Introduction

Ce document décrit les principales user stories et parcours utilisateurs pour la plateforme CryptoCare. Il est destiné à guider le développement en garantissant que toutes les fonctionnalités essentielles sont implémentées et que l'expérience utilisateur est optimale.

## Personas

### 1. Patient - Sophie, 35 ans

**Profil**: Professionnelle occupée, habite à Genève, possède un portefeuille Bitcoin, recherche des consultations médicales flexibles sans contrainte horaire.

**Objectifs**:
- Consulter rapidement des spécialistes sans se déplacer
- Avoir une solution discrète pour certaines consultations
- Payer facilement avec ses bitcoins
- Gérer ses rendez-vous depuis son smartphone

**Défis**:
- Ne maîtrise pas parfaitement les aspects techniques du Bitcoin
- A besoin d'une interface intuitive
- Souhaite une confidentialité maximale

### 2. Professionnel de santé - Dr. Martin, 42 ans

**Profil**: Médecin généraliste à Zoug, intéressé par les nouvelles technologies, souhaite développer une patientèle internationale et propose des plages horaires flexibles.

**Objectifs**:
- Augmenter sa patientèle sans agrandir son cabinet
- Optimiser son emploi du temps avec des téléconsultations
- Recevoir des paiements directement en Bitcoin
- Gérer facilement ses disponibilités et rendez-vous

**Défis**:
- Doit jongler entre consultations physiques et téléconsultations
- Souhaite un système fiable pour les paiements en Bitcoin
- A besoin d'une interface simple pour gérer son calendrier

## User Stories - Patients

### Inscription et Configuration

#### US-P01: Inscription Patient
**En tant que** patient,  
**Je veux** m'inscrire sur la plateforme,  
**Afin de** pouvoir prendre des rendez-vous avec des professionnels de santé.

**Critères d'acceptation**:
- Je peux m'inscrire avec mon email et un mot de passe
- Je dois fournir mon nom et prénom
- Je reçois un email de confirmation
- Je peux choisir ma langue préférée (français ou anglais)

#### US-P02: Configuration Portefeuille Bitcoin
**En tant que** patient,  
**Je veux** être guidé sur la configuration d'un portefeuille Bitcoin compatible Lightning Network,  
**Afin de** pouvoir payer mes consultations.

**Critères d'acceptation**:
- Je vois des instructions claires pour installer un portefeuille compatible
- J'ai accès à une FAQ sur les paiements Bitcoin
- Je peux tester le scan d'un QR code d'exemple

### Recherche et Prise de Rendez-vous

#### US-P03: Recherche de Professionnels
**En tant que** patient,  
**Je veux** rechercher des professionnels selon différents critères,  
**Afin de** trouver le spécialiste qui correspond à mes besoins.

**Critères d'acceptation**:
- Je peux filtrer par spécialité médicale
- Je peux filtrer par localisation (Suisse, France)
- Je peux filtrer par disponibilité (dates/heures)
- Je peux voir les informations de base des professionnels (nom, spécialité, tarif)

#### US-P04: Consultation des Disponibilités
**En tant que** patient,  
**Je veux** voir les créneaux disponibles d'un professionnel sur un calendrier,  
**Afin de** choisir un moment qui me convient.

**Critères d'acceptation**:
- Je vois un calendrier interactif avec les créneaux disponibles
- Je peux naviguer facilement entre les jours et les semaines
- Les créneaux sont affichés dans mon fuseau horaire
- Je vois clairement la durée d'une consultation

#### US-P05: Prise de Rendez-vous
**En tant que** patient,  
**Je veux** réserver un créneau spécifique avec un professionnel,  
**Afin de** planifier une téléconsultation.

**Critères d'acceptation**:
- Je peux sélectionner un créneau disponible
- Je vois un récapitulatif avant confirmation (date, heure, durée, prix)
- Je reçois une confirmation immédiate de ma réservation
- Je vois le prix en Bitcoin (0,0005 BTC)

### Paiement et Consultation

#### US-P06: Paiement en Bitcoin
**En tant que** patient,  
**Je veux** payer ma consultation en Bitcoin,  
**Afin de** confirmer mon rendez-vous.

**Critères d'acceptation**:
- Je vois un QR code Lightning Network clair
- Je peux scanner le QR code avec mon portefeuille Bitcoin
- Je reçois une confirmation immédiate après paiement
- Je vois un historique de mes paiements

#### US-P07: Accès à la Téléconsultation
**En tant que** patient,  
**Je veux** accéder facilement à ma téléconsultation au moment prévu,  
**Afin de** consulter le professionnel de santé.

**Critères d'acceptation**:
- Je reçois le lien Zoom par email après confirmation du paiement
- Je vois le lien Zoom dans mon espace personnel
- Je reçois un rappel 30 minutes avant la consultation
- Je peux rejoindre la réunion en un clic

#### US-P08: Gestion des Rendez-vous
**En tant que** patient,  
**Je veux** voir la liste de mes rendez-vous passés et à venir,  
**Afin de** gérer mon planning médical.

**Critères d'acceptation**:
- Je peux voir tous mes rendez-vous sur un calendrier
- Je peux annuler un rendez-vous (selon conditions)
- Je peux demander un report de rendez-vous
- Je vois le statut de chaque rendez-vous (confirmé, payé, terminé)

## User Stories - Professionnels de Santé

### Inscription et Configuration

#### US-M01: Inscription Professionnel
**En tant que** professionnel de santé,  
**Je veux** créer un compte professionnel sur la plateforme,  
**Afin de** proposer des téléconsultations.

**Critères d'acceptation**:
- Je peux m'inscrire avec mon email professionnel
- Je dois fournir mes informations professionnelles (spécialité, numéro d'identification)
- Je reçois un email de vérification
- Mon compte est activé après vérification de mes qualifications

#### US-M02: Configuration du Profil
**En tant que** professionnel,  
**Je veux** configurer mon profil professionnel,  
**Afin d'** être visible pour les patients.

**Critères d'acceptation**:
- Je peux ajouter une photo de profil
- Je peux rédiger une description de ma pratique
- Je peux lister mes spécialités et qualifications
- Je peux configurer mon adresse Bitcoin pour recevoir les paiements

#### US-M03: Configuration Zoom
**En tant que** professionnel,  
**Je veux** connecter mon compte Zoom à la plateforme,  
**Afin de** faciliter la création de téléconsultations.

**Critères d'acceptation**:
- Je peux autoriser l'accès à mon compte Zoom
- Mes réunions sont automatiquement créées et planifiées
- Je peux personnaliser certains paramètres Zoom
- Je peux tester la configuration avant une vraie consultation

### Gestion des Disponibilités

#### US-M04: Définition des Disponibilités
**En tant que** professionnel,  
**Je veux** définir mes plages horaires disponibles,  
**Afin de** recevoir des réservations uniquement sur ces créneaux.

**Critères d'acceptation**:
- Je peux définir des plages horaires récurrentes (ex: tous les lundis de 14h à 17h)
- Je peux ajouter des exceptions (congés, jours fériés)
- Je peux définir la durée de mes consultations
- Je peux modifier mes disponibilités à tout moment

#### US-M05: Validation des Rendez-vous
**En tant que** professionnel,  
**Je veux** être notifié des nouvelles réservations,  
**Afin de** les valider ou les rejeter.

**Critères d'acceptation**:
- Je reçois une notification pour chaque nouvelle réservation
- Je peux voir les informations du patient avant d'accepter
- Je peux accepter ou refuser un rendez-vous
- Je peux proposer un horaire alternatif

### Consultation et Paiement

#### US-M06: Conduite des Téléconsultations
**En tant que** professionnel,  
**Je veux** accéder facilement à mes téléconsultations planifiées,  
**Afin de** consulter mes patients à distance.

**Critères d'acceptation**:
- Je vois mon planning du jour sur mon tableau de bord
- Je reçois un rappel 15 minutes avant chaque consultation
- Je peux démarrer la réunion Zoom en un clic
- Je peux noter la fin d'une consultation

#### US-M07: Suivi des Paiements
**En tant que** professionnel,  
**Je veux** suivre les paiements reçus pour mes consultations,  
**Afin de** gérer ma comptabilité.

**Critères d'acceptation**:
- Je vois toutes les transactions dans mon tableau de bord
- Je peux filtrer les paiements par période
- Je peux exporter un récapitulatif pour ma comptabilité
- Je suis notifié en temps réel des paiements reçus

#### US-M08: Statistiques d'Activité
**En tant que** professionnel,  
**Je veux** accéder à des statistiques sur mon activité,  
**Afin d'** optimiser mon planning.

**Critères d'acceptation**:
- Je vois le nombre de consultations réalisées par période
- Je vois mon taux d'occupation
- Je vois les revenus générés
- Je peux identifier les plages horaires les plus demandées

## Parcours Utilisateurs (User Journeys)

### Parcours Patient: Première Consultation

1. **Découverte et Inscription**
   - Sophie découvre CryptoCare via une recherche en ligne
   - Elle crée un compte en fournissant son email et ses informations de base
   - Elle confirme son compte via le lien reçu par email
   - Elle explore l'interface et lit la FAQ sur les paiements en Bitcoin

2. **Recherche et Sélection**
   - Sophie recherche un dermatologue disponible ce week-end
   - Elle filtre les résultats par spécialité et disponibilité
   - Elle consulte les profils de plusieurs professionnels
   - Elle sélectionne le Dr. Martin qui a de bonnes évaluations

3. **Réservation et Paiement**
   - Sophie consulte le calendrier du Dr. Martin
   - Elle sélectionne un créneau samedi à 10h00
   - Elle confirme la réservation et voit le récapitulatif
   - Un QR code Bitcoin apparaît pour le paiement de 0,0005 BTC
   - Elle scanne le code avec son portefeuille Bitcoin et confirme le paiement
   - Elle reçoit immédiatement une confirmation de paiement

4. **Préparation à la Consultation**
   - Sophie reçoit un email avec le lien Zoom pour la consultation
   - Elle peut également retrouver ce lien dans son espace personnel
   - La veille, elle reçoit un rappel par email et notification
   - 30 minutes avant, elle reçoit un dernier rappel

5. **Consultation**
   - À l'heure prévue, Sophie clique sur le lien Zoom
   - Elle rejoint la salle d'attente virtuelle
   - Le Dr. Martin la fait entrer dans la consultation
   - Ils réalisent la consultation par vidéo
   - À la fin, le statut du rendez-vous passe à "Terminé" dans l'application

### Parcours Professionnel: Configuration et Première Journée

1. **Inscription et Vérification**
   - Le Dr. Martin s'inscrit sur CryptoCare comme professionnel
   - Il remplit son profil avec ses qualifications et sa spécialité
   - Il attend la vérification de ses informations professionnelles
   - Il reçoit un email confirmant l'activation de son compte

2. **Configuration**
   - Il configure son portefeuille Bitcoin pour recevoir les paiements
   - Il connecte son compte Zoom professionnel
   - Il définit la durée standard de ses consultations (30 minutes)
   - Il paramètre ses préférences de notification

3. **Définition des Disponibilités**
   - Il configure ses plages horaires habituelles (lundi-vendredi 9h-12h, 14h-17h)
   - Il ajoute des disponibilités spéciales pour le week-end (samedi 9h-12h)
   - Il marque ses vacances prévues comme indisponibles
   - Il vérifie l'aperçu de son calendrier public

4. **Première Réservation**
   - Il reçoit une notification de réservation de Sophie
   - Il voit les informations de base et le créneau demandé
   - Il accepte la réservation
   - Il voit le rendez-vous apparaître dans son calendrier

5. **Préparation et Consultation**
   - Le jour J, il consulte son planning sur son tableau de bord
   - Il reçoit un rappel 15 minutes avant la consultation
   - À l'heure prévue, il démarre la réunion Zoom depuis l'application
   - Il réalise la consultation
   - Il marque la consultation comme terminée
   - Il voit le paiement confirmé dans son tableau de bord

## Épics et Priorités

### Épic 1: Système d'authentification et de profils
- US-P01, US-M01, US-M02
- Priorité: Haute (P0)

### Épic 2: Gestion des rendez-vous
- US-P03, US-P04, US-P05, US-M04, US-M05
- Priorité: Haute (P0)

### Épic 3: Paiements Bitcoin
- US-P02, US-P06, US-M07
- Priorité: Haute (P0)

### Épic 4: Intégration Zoom
- US-P07, US-M03, US-M06
- Priorité: Haute (P0)

### Épic 5: Tableau de bord et statistiques
- US-P08, US-M08
- Priorité: Moyenne (P1)

## Conclusion

Ces user stories et parcours utilisateurs servent de base pour le développement de la plateforme CryptoCare. Elles doivent être affinées et complétées au fur et à mesure du développement et des retours utilisateurs.
