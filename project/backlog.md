# Backlog Vertical Slice

## Priorités

### P0 — Fondations (obligatoire)

- VS-001 à VS-006

### P1 — Effet Wow (très important)

- VS-007 à VS-012

### P2 — Interaction

- VS-013 à VS-015

### P3 — Finalisation

- VS-016 à VS-017

---

# VS-001 Initialiser le projet Vite + TypeScript + Three.js

**Estimation :** 2h

## Pourquoi

Créer une base propre et moderne.

## Comment faire

```bash
npm create vite@latest
npm install three
npm install -D @types/three
```

Créer :

```text
src/
  main.ts
  App.ts
  core/
```

## Critères d'acceptation

- npm run dev fonctionne
- écran non noir
- grille visible
- hot reload actif

---

# VS-002 Définir l'architecture du projet

**Estimation :** 1h

## Pourquoi

Éviter la dette technique.

## Comment faire

Créer :

```text
src/
  core/
  renderer/
  camera/
  scene/
  loaders/
  poi/
  ui/
  data/
  utils/
```

## Critères d'acceptation

- aucune logique métier dans main.ts
- structure documentée

---

# VS-003 Documentation du pipeline QGIS → Blender → GLB

**Estimation :** 1h

## Pourquoi

Documenter l'ensemble de la chaîne de production afin de pouvoir reconstruire les données à partir de zéro plusieurs mois plus tard.

## Comment faire

Documenter :

```text
Plan Turgot
 ↓
QGIS
 ↓
Vectorisation
 ↓
Nettoyage
 ↓
Blender GIS
 ↓
Extrusion
 ↓
GLB
 ↓
Three.js
```

Créer un document décrivant chaque étape, les outils utilisés et les formats d'échange.

## Critères d'acceptation

- pipeline documenté de bout en bout
- reconstruction possible sans mémoire externe

---

# VS-003A Géoréférencement de la planche 11

**Estimation :** 2h

## Pourquoi

Positionner correctement la planche Turgot dans le système de coordonnées moderne.

## Comment faire

- importer la planche dans QGIS
- choisir plusieurs points de contrôle
- aligner avec les données actuelles
- vérifier la précision visuellement

## Critères d'acceptation

- géoréférencement stable
- décalage visuel faible sur les repères principaux

---

# VS-003B Découpage de la zone héro

**Estimation :** 1h

## Pourquoi

Limiter le travail de vectorisation à la zone réellement utilisée dans la démo.

## Comment faire

Définir précisément :

- Notre-Dame
- Pont-Neuf
- Palais de Justice
- Place Dauphine
- Seine adjacente

Créer une couche représentant le périmètre de travail.

## Critères d'acceptation

- périmètre validé
- aucune zone inutile incluse

---

# VS-003C Vectorisation des zones

**Estimation :** 4h

## Pourquoi

Créer les données géométriques qui serviront à Blender.

## Comment faire

Créer des couches séparées :

- bâtiments
- voirie
- ponts
- quais
- îles
- Seine

Privilégier une vectorisation propre plutôt qu'exhaustive.

## Critères d'acceptation

- couches séparées
- géométries fermées
- pas de trous majeurs

---

# VS-003D Nettoyage topologique

**Estimation :** 2h

## Pourquoi

Éviter les problèmes lors de l'import dans Blender.

## Comment faire

- corriger les polygones invalides
- supprimer les doublons
- corriger les intersections
- vérifier les géométries

## Critères d'acceptation

- export GeoJSON sans erreur
- géométries valides

---

# VS-003E Préparation Blender GIS

**Estimation :** 2h

## Pourquoi

Valider le passage entre QGIS et Blender.

## Comment faire

- importer les couches dans Blender GIS
- vérifier les coordonnées
- vérifier les dimensions
- vérifier l'échelle

## Critères d'acceptation

- import sans erreur
- échelle cohérente
- données exploitables pour extrusion

---

# VS-004 Charger un GLB dans Three.js

**Estimation :** 2h

## Comment faire

Créer :

```text
GLBLoader.ts
```

Ajouter :

- chargement asynchrone
- gestion erreurs
- centrage modèle

## Critères d'acceptation

- GLB visible
- erreurs affichées proprement

---

# VS-005 Navigation caméra

**Estimation :** 2h

## Comment faire

Configurer OrbitControls :

- zoom min/max
- angle min/max
- focus sur cible

Ajouter :

- double clic → focus

## Critères d'acceptation

- impossible de passer sous le terrain
- navigation confortable

---

# VS-006 Import complet de la planche 11

**Estimation :** 3h

## Comment faire

Exporter :

- bâtiments
- rues
- quais
- ponts

dans un GLB unique.

## Critères d'acceptation

- géométrie visible
- échelle correcte

---

# VS-007 Notre-Dame (Zone Héro)

**Estimation :** 4h

## Pourquoi

Point focal principal de la démo.

## Comment faire

Améliorer :

- tours
- toiture
- contreforts

Créer un éclairage dédié.

## Critères d'acceptation

- capture promotionnelle possible

---

# VS-008 Pont-Neuf

**Estimation :** 3h

## Comment faire

Accent sur :

- arches
- silhouette
- visibilité

## Critères d'acceptation

- identifiable immédiatement

---

# VS-009 Palais de Justice

**Estimation :** 3h

## Critères d'acceptation

- visible depuis Notre-Dame
- identifiable

---

# VS-010 Place Dauphine

**Estimation :** 2h

## Critères d'acceptation

- cohérence urbaine
- lecture claire du quartier

---

# VS-011A Eau

**Estimation :** 2h

## Comment faire

Créer matériau eau simple.

## Critères d'acceptation

- Seine immédiatement identifiable

---

# VS-011B Embarcations

**Estimation :** 2h

## Comment faire

Ajouter quelques bateaux.

## Critères d'acceptation

- scène plus vivante

---

# VS-012 Style graphique Turgot

**Estimation :** 4h

## Comment faire

Travailler :

- couleurs
- éclairage
- ambiance
- matériaux

## Critères d'acceptation

- identité visuelle cohérente

---

# VS-013 Système de POI

**Estimation :** 3h

## Comment faire

Utiliser Raycaster.

États :

- hover
- selected

## Critères d'acceptation

- sélection visuelle fonctionnelle

---

# VS-014 Interface des POI

**Estimation :** 3h

## Comment faire

Structure :

```text
titre
description
image
sources
```

## Critères d'acceptation

- panneau HTML moderne
- fermeture intuitive

---

# VS-015 Comparaison Paris actuel

**Estimation :** 4h

## Comment faire

Version minimale :

- image historique
- image actuelle

## Critères d'acceptation

- effet avant/après compréhensible

---

# VS-016 Optimisation

**Estimation :** 2h

## Comment faire

- merge mesh
- compression Draco
- nettoyage textures

## Critères d'acceptation

- chargement < 5 secondes

---

# VS-017 Préparation démo

**Estimation :** 2h

## Comment faire

Parcours :

1. Vue générale
2. Notre-Dame
3. Pont-Neuf
4. Place Dauphine
5. POI
6. Comparaison actuelle

## Critères d'acceptation

- démo complète < 3 minutes
- aucun bug bloquant

```

```
