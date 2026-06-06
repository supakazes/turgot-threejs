# Backlog Vertical Slice

## Priorities

### P0 — Data & Pipeline

- VS-001 → VS-007

### P1 — Turgot Visual Identity

- VS-008 → VS-011

### P2 — Hero Zone

- VS-012 → VS-015

### P3 — Interaction

- VS-016 → VS-018

### P4 — Demo Polish

- VS-019

---

# VS-001 Initialize Vite + TypeScript + Three.js

**Estimate:** 2h

## Acceptance Criteria

- npm run dev works
- visible grid
- hot reload enabled

---

# VS-002 Define Project Architecture

**Estimate:** 1h

Structure:

```text
src/
  core/
  camera/
  scene/
  renderer/
  loaders/
  ui/
  poi/
  data/
  utils/
```

## Acceptance Criteria

- no business logic in main.ts

---

# VS-003 Document Production Pipeline

**Estimate:** 1h

Document:

```text
Turgot
↓
QGIS
↓
Vectorization
↓
Blender
↓
Geometry Nodes
↓
GLB
↓
Three.js
```

## Acceptance Criteria

- complete rebuild possible from documentation

---

# VS-004 Define Building Attribute Model

**Estimate:** 2h

## Why

All future procedural generation depends on this.

## Fields

```text
id
name
height
roof_type
building_type
landmark
poi_id
era_confidence
source
```

## Acceptance Criteria

- schema documented
- QGIS fields created

---

# VS-005 Georeference Plate 11

**Estimate:** 2h

## Acceptance Criteria

- acceptable alignment with modern Paris

---

# VS-006 Hero Area Definition

**Estimate:** 1h

Area:

- Notre-Dame
- Pont-Neuf
- Palais de Justice
- Place Dauphine
- Adjacent Seine

## Acceptance Criteria

- perimeter validated

---

# VS-007 Vectorization + Blender Validation

**Estimate:** 8h

Layers:

- buildings
- roads
- bridges
- quays
- islands
- Seine

Tasks:

- topology cleanup
- Blender GIS import
- Geometry Nodes validation

## Acceptance Criteria

- clean geometry
- successful Blender import
- successful GLB export

---

# VS-008 Import Complete Plate 11 in Three.js

**Estimate:** 3h

## Acceptance Criteria

- full plate visible
- correct scale

---

# VS-009 Performance Baseline

**Estimate:** 2h

Tasks:

- mesh merge
- Draco compression
- loading measurements

## Acceptance Criteria

- load time under 5 seconds

---

# VS-010 Turgot Materials

**Estimate:** 2h

Goal:

- paper appearance
- engraving palette
- coherent roof rendering

## Acceptance Criteria

- immediately evokes the original map

---

# VS-011 Turgot Rendering Style

**Estimate:** 5h

Investigate:

- outlines
- hatching
- post-processing
- paper overlay
- shadow treatment

## Acceptance Criteria

- "paper map becomes 3D" effect achieved

---

# VS-012 Notre-Dame

**Estimate:** 4h

## Acceptance Criteria

- hero quality asset

---

# VS-013 Pont-Neuf

**Estimate:** 3h

## Acceptance Criteria

- instantly recognizable

---

# VS-014 Palais de Justice

**Estimate:** 3h

## Acceptance Criteria

- recognizable silhouette

---

# VS-015 Place Dauphine + Seine + Boats

**Estimate:** 4h

## Acceptance Criteria

- lively environment
- coherent urban composition

---

# VS-016 POI System

**Estimate:** 3h

Features:

- raycasting
- hover
- selection

## Acceptance Criteria

- reliable interaction

---

# VS-017 POI Interface

**Estimate:** 3h

Content:

- title
- anecdote
- images
- sources

## Acceptance Criteria

- polished panel

---

# VS-018 Present-Day Paris Comparison

**Estimate:** 4h

Version 1:

- historical view
- current view

Possible overlays:

- metro stations
- metro lines
- modern landmarks

## Acceptance Criteria

- immediate understanding of location

---

# VS-019 Demo Preparation

**Estimate:** 2h

Demo sequence:

1. Global view
2. Turgot visual effect
3. Notre-Dame
4. Pont-Neuf
5. POIs
6. Modern Paris comparison

## Acceptance Criteria

- demo under 3 minutes
- no blocking bugs
- stable deployment
