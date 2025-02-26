# Guide de Contribution - CryptoCare

## Introduction

Merci de votre intérêt pour contribuer au projet CryptoCare ! Ce guide est conçu pour vous aider à comprendre notre processus de contribution et à vous permettre de participer efficacement au développement de notre plateforme de télémédecine avec paiement en Bitcoin.

## Table des matières

1. [Code de conduite](#1-code-de-conduite)
2. [Comment commencer](#2-comment-commencer)
3. [Processus de développement](#3-processus-de-développement)
4. [Soumission de Pull Requests](#4-soumission-de-pull-requests)
5. [Standards de code](#5-standards-de-code)
6. [Documentation](#6-documentation)
7. [Tests](#7-tests)
8. [Rapports de bugs](#8-rapports-de-bugs)
9. [Propositions de fonctionnalités](#9-propositions-de-fonctionnalités)
10. [Revue de code](#10-revue-de-code)

## 1. Code de conduite

### 1.1 Nos engagements

En tant que contributeurs et mainteneurs du projet CryptoCare, nous nous engageons à:

- Créer une expérience positive pour tous, indépendamment du niveau d'expérience, du genre, de l'orientation sexuelle, du handicap, de l'apparence personnelle, de la taille corporelle, de l'origine ethnique, de l'âge, de la religion ou de la nationalité.
- Être respectueux des opinions divergentes.
- Accepter les critiques constructives.
- Se concentrer sur ce qui est le mieux pour la communauté.
- Faire preuve d'empathie envers les autres membres de la communauté.

### 1.2 Comportements inacceptables

Les comportements suivants sont considérés comme inacceptables:

- Harcèlement et commentaires offensants
- Trolling, insultes ou dépréciation
- Publication d'informations privées sans autorisation
- Toute forme de discrimination
- Comportement non professionnel ou contraire à l'éthique

### 1.3 Signalement

Si vous êtes témoin ou victime d'un comportement inacceptable, veuillez le signaler à l'équipe du projet à l'adresse code-conduct@cryptocare.ch. Tous les rapports seront examinés et traités de manière confidentielle.

## 2. Comment commencer

### 2.1 Prérequis

Avant de commencer à contribuer, assurez-vous d'avoir:

- Un compte GitHub
- Git installé sur votre machine
- Node.js (version 16+) et npm (version 8+)
- PostgreSQL (version 14+)
- Connaissance de base de React.js et Node.js

### 2.2 Fork et clone

1. Visitez le dépôt GitHub: https://github.com/cryptocare-sa/cryptocare-platform
2. Cliquez sur le bouton "Fork" en haut à droite pour créer votre propre copie du dépôt
3. Clonez votre fork localement:

```bash
git clone https://github.com/VOTRE-USERNAME/cryptocare-platform.git
cd cryptocare-platform
```

4. Ajoutez le dépôt d'origine comme "upstream":

```bash
git remote add upstream https://github.com/cryptocare-sa/cryptocare-platform.git
```

### 2.3 Configuration de l'environnement

Suivez les instructions détaillées dans le fichier README.md pour configurer votre environnement de développement.

```bash
# Configuration du backend
cd backend
npm install
cp .env.example .env
# Configurez votre fichier .env

# Configuration du frontend
cd ../frontend
npm install
cp .env.example .env.local
# Configurez votre fichier .env.local

# Configuration de l'application mobile (optionnel)
cd ../mobile
npm install
cp .env.example .env
# Configurez votre fichier .env
```

## 3. Processus de développement

### 3.1 Modèle de branches

Nous utilisons une version adaptée du workflow GitFlow:

- `main`: Branche de production stable
- `develop`: Branche d'intégration pour le développement
- `feature/xxx`: Branches pour les nouvelles fonctionnalités
- `bugfix/xxx`: Branches pour les corrections de bugs
- `release/x.y.z`: Branches pour la préparation des releases
- `hotfix/xxx`: Branches pour les correctifs urgents

### 3.2 Création d'une branche de fonctionnalité

Avant de commencer un travail, assurez-vous que votre branche `develop` est à jour:

```bash
git checkout develop
git pull upstream develop
```

Créez ensuite une nouvelle branche pour votre fonctionnalité:

```bash
git checkout -b feature/ma-fonctionnalite
```

### 3.3 Commits

Nous suivons la convention de [Conventional Commits](https://www.conventionalcommits.org/) pour les messages de commit:

```
<type>[scope optional]: <description>

[optional body]

[optional footer(s)]
```

Types courants:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Modifications de la documentation
- `style`: Changements de formatage (espaces, indentation, etc.)
- `refactor`: Refactoring du code
- `test`: Ajout ou modification de tests
- `chore`: Modifications de builds, outils, etc.

Exemple:
```
feat(auth): ajouter l'authentification à deux facteurs

- Implémentation de l'authentification TOTP
- Ajout des tests unitaires
- Mise à jour de la documentation utilisateur

Closes #123
```

### 3.4 Développement local

Lors du développement, assurez-vous de suivre ces bonnes pratiques:

1. **Petites modifications**: Faites des modifications petites et ciblées
2. **Tests**: Écrivez des tests pour vos fonctionnalités
3. **Documentation**: Mettez à jour la documentation si nécessaire
4. **Commits fréquents**: Commitez régulièrement pour faciliter le suivi

## 4. Soumission de Pull Requests

### 4.1 Préparation

Avant de soumettre votre Pull Request (PR):

1. Assurez-vous que votre code respecte les standards du projet
2. Vérifiez que tous les tests passent
3. Mettez à jour la documentation si nécessaire
4. Assurez-vous que votre branche est à jour avec `develop`:

```bash
git checkout develop
git pull upstream develop
git checkout feature/ma-fonctionnalite
git rebase develop
```

### 4.2 Création d'une Pull Request

1. Poussez votre branche vers votre fork:

```bash
git push origin feature/ma-fonctionnalite
```

2. Allez sur GitHub et créez une Pull Request vers la branche `develop` du dépôt original
3. Remplissez le template de PR avec:
   - Description claire de vos modifications
   - Issue(s) associée(s)
   - Modifications apportées
   - Comment tester vos changements
   - Captures d'écran (si applicable)

### 4.3 Revue et itération

1. Un ou plusieurs mainteneurs examineront votre PR
2. Ils pourront demander des modifications ou des clarifications
3. Faites les modifications nécessaires et poussez-les vers votre branche
4. Une fois la PR approuvée, un mainteneur la fusionnera

## 5. Standards de code

### 5.1 Formats et style

Nous utilisons ESLint et Prettier pour maintenir une cohérence dans le code:

```bash
# Vérification du style
npm run lint

# Correction automatique des problèmes de style
npm run lint:fix
```

### 5.2 Conventions de nommage

- **Variables et fonctions**: camelCase
- **Composants React**: PascalCase
- **Fichiers de composants**: PascalCase
- **Fichiers JS utilitaires**: kebab-case
- **Classes CSS**: kebab-case
- **Constantes**: UPPER_SNAKE_CASE

### 5.3 Structure du code

- **Modularité**: Privilégiez les petites fonctions et composants
- **Responsabilité unique**: Chaque module devrait avoir une seule responsabilité
- **DRY (Don't Repeat Yourself)**: Évitez la duplication de code
- **KISS (Keep It Simple, Stupid)**: Favorisez la simplicité

## 6. Documentation

### 6.1 Documentation du code

- Utilisez JSDoc pour documenter les fonctions, classes et composants:

```javascript
/**
 * Calcule le montant total d'une facture
 * @param {Object} options - Options de calcul
 * @param {number} options.amount - Montant de base
 * @param {number} options.taxRate - Taux de taxe (entre 0 et 1)
 * @param {number} [options.discount=0] - Remise (en pourcentage, entre 0 et 1)
 * @returns {number} Montant total calculé
 */
function calculateTotal({ amount, taxRate, discount = 0 }) {
  return amount * (1 + taxRate) * (1 - discount);
}
```

### 6.2 Documentation des changements

- Mettez à jour le CHANGELOG.md pour les changements notables
- Mettez à jour le README.md si nécessaire
- Documentez les nouvelles fonctionnalités dans le wiki du projet

### 6.3 Documentation des API

- Toute nouvelle API doit être documentée dans le fichier api-documentation.md
- Les changements d'API existante doivent être clairement indiqués

## 7. Tests

### 7.1 Types de tests

Nous utilisons différents niveaux de tests:

- **Tests unitaires**: Tester les fonctions et composants isolément
- **Tests d'intégration**: Tester l'interaction entre les composants
- **Tests e2e**: Tester les parcours utilisateurs complets

### 7.2 Écriture des tests

- Chaque nouvelle fonctionnalité doit être accompagnée de tests
- Les corrections de bugs doivent inclure un test qui reproduit le bug
- Visez une couverture de code d'au moins 80%

### 7.3 Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm test -- --watch

# Vérifier la couverture des tests
npm test -- --coverage
```

## 8. Rapports de bugs

### 8.1 Avant de signaler un bug

- Vérifiez que le bug n'a pas déjà été signalé
- Assurez-vous que vous utilisez la dernière version
- Vérifiez que le problème peut être reproduit de manière cohérente

### 8.2 Comment signaler un bug

Créez une nouvelle issue sur GitHub avec:

1. Un titre clair et descriptif
2. Une description détaillée du problème
3. Étapes pour reproduire le bug
4. Comportement attendu vs comportement observé
5. Environnement (navigateur, OS, versions)
6. Captures d'écran ou vidéos (si applicable)
7. Toute erreur de console ou logs pertinents

### 8.3 Résolution des bugs

Si vous souhaitez corriger un bug:

1. Commentez sur l'issue que vous travaillez dessus
2. Créez une branche `bugfix/xxx` à partir de `develop`
3. Corrigez le bug et ajoutez un test qui vérifie la correction
4. Créez une PR avec une référence à l'issue

## 9. Propositions de fonctionnalités

### 9.1 Processus de proposition

1. Vérifiez que la fonctionnalité n'a pas déjà été proposée ou rejetée
2. Créez une nouvelle issue avec le label "enhancement"
3. Décrivez clairement la fonctionnalité et son cas d'utilisation
4. Expliquez pourquoi cette fonctionnalité serait bénéfique pour le projet

### 9.2 Évaluation des propositions

Les propositions seront évaluées par l'équipe principale en fonction de:

- L'alignement avec la vision du projet
- La complexité et l'effort requis
- L'impact sur les utilisateurs
- La maintenabilité à long terme

### 9.3 Implémentation des fonctionnalités acceptées

Si une proposition est acceptée et que vous souhaitez l'implémenter:

1. Commentez sur l'issue que vous travaillez dessus
2. Créez une branche `feature/xxx` à partir de `develop`
3. Implémentez la fonctionnalité avec les tests appropriés
4. Créez une PR avec une référence à l'issue

## 10. Revue de code

### 10.1 Processus de revue

Chaque PR est soumise à un processus de revue:

1. Tests automatisés (CI) pour vérifier que le build passe
2. Revue par au moins un membre de l'équipe principale
3. Adressage des commentaires et suggestions
4. Approbation finale

### 10.2 Critères de revue

Les reviewers évaluent:

- La fonctionnalité (répond-elle au besoin?)
- La qualité du code (lisibilité, maintenabilité)
- Les tests (couverture, pertinence)
- La documentation
- La performance et la sécurité

### 10.3 Conseils pour les reviewers

- Soyez respectueux et constructif
- Concentrez-vous sur le code, pas sur la personne
- Expliquez pourquoi quelque chose pourrait être amélioré
- Faites référence aux standards ou à la documentation
- Reconnaissez les bons aspects du code

### 10.4 Conseils pour recevoir des revues

- Ne prenez pas les commentaires personnellement
- Demandez des clarifications si nécessaire
- Expliquez vos choix d'implémentation
- Soyez ouvert aux suggestions
- Remerciez les reviewers pour leur temps et leurs commentaires

## Conclusion

Votre contribution est précieuse pour le projet CryptoCare. En suivant ces directives, vous aidez à maintenir la qualité du projet et à créer une expérience positive pour tous les contributeurs.

Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter l'équipe via:

- GitHub Issues
- Canal Slack #cryptocare-dev
- Email: dev@cryptocare.ch

Merci de contribuer à CryptoCare et de nous aider à construire une plateforme de télémédecine innovante avec paiement en Bitcoin !

---

_Ce document est régulièrement mis à jour. Dernière mise à jour: Février 2025._
