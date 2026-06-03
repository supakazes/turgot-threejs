# Backlog Vertical Slice

## VS-001 Initialiser le projet Vite + TypeScript + Three.js

Estimation : 2h

Pourquoi :

Créer une base propre et moderne.

Comment faire :

- Créer projet Vite TS
- Installer Three.js
- Installer OrbitControls
- Mettre en place ESLint et Prettier

Critères d'acceptation :

- npm run dev fonctionne
- scène vide affichée

---

## VS-002 Définir l'architecture du projet

Estimation : 1h

Comment faire :

Créer :

- src/core
- src/scenes
- src/ui
- src/data
- src/utils

Critères :

- structure documentée

---

## VS-003 Valider le pipeline Blender → GLB

Estimation : 3h

Comment faire :

- exporter un modèle test
- vérifier matériaux
- vérifier échelle

Critères :

- GLB réutilisable dans Three.js

---

## VS-004 Charger un GLB dans Three.js

Estimation : 2h

Comment faire :

- GLTFLoader
- gestion des erreurs
- affichage dans la scène

Critères :

- modèle visible

---

## VS-005 Navigation caméra

Estimation : 2h

Comment faire :

- OrbitControls
- limites de zoom
- angle minimum / maximum

Critères :

- navigation agréable

---

## VS-006 Import de la planche 11

Estimation : 3h

Comment faire :

- export Blender
- import Three.js
- vérification des coordonnées

Critères :

- planche visible et exploitable

---

## VS-007 Notre-Dame (zone héro)

Estimation : 4h

Comment faire :

- améliorer géométrie
- améliorer textures

Critères :

- élément visuellement marquant

---

## VS-008 Pont-Neuf

Estimation : 3h

Critères :

- identifiable immédiatement

---

## VS-009 Palais de Justice

Estimation : 3h

Critères :

- identifiable immédiatement

---

## VS-010 Place Dauphine

Estimation : 2h

Critères :

- cohérente avec l'environnement

---

## VS-011 Seine et embarcations

Estimation : 3h

Comment faire :

- matériau eau
- quelques bateaux

Critères :

- scène plus vivante

---

## VS-012 Style graphique Turgot

Estimation : 4h

Comment faire :

- éclairage
- couleurs
- matériaux

Critères :

- identité visuelle cohérente

---

## VS-013 Système de POI

Estimation : 3h

Comment faire :

- raycast
- sélection

Critères :

- clic fonctionnel

---

## VS-014 Interface des POI

Estimation : 3h

Comment faire :

- panneau HTML
- contenu descriptif

Critères :

- affichage d'informations

---

## VS-015 Comparaison Paris actuel

Estimation : 4h

Comment faire :

- photo
- carte
- vue associée

Critères :

- comparaison claire

---

## VS-016 Optimisation

Estimation : 2h

Comment faire :

- compression
- nettoyage

Critères :

- chargement fluide

---

## VS-017 Préparation démo

Estimation : 2h

Comment faire :

- tests complets
- correction bugs
- vérification parcours utilisateur

Critères :

- démonstration stable
