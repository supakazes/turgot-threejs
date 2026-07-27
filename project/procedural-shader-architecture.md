# Procedural Shader Architecture

<img src="./images/shaders/place-dauphine-close-up-on-doors-and-windows.png" width="700" alt="Close-up of Place Dauphine from the Turgot map">

## Goals

Avoid raster textures whenever possible.

Objectives:

- preserve the engraving style of the Plan Turgot
- minimize download size
- procedural, infinitely sharp rendering
- reusable shader library
- complete artistic control

The renderer should reproduce the **rules** of the engraving rather than copy pixels.

---

# Design Principles

- geometry comes from Blender
- shaders decorate geometry
- no PBR
- no baked textures
- no texture atlases
- **facades are composed, not monolithic**
- **imperfections are always the final step**

The city is rendered as if engraved on a **single sheet of paper**.

---

# Composition

This is the core requirement. A facade is not one shader — it is a **stack of small, reusable GLSL functions**, each drawing one architectural element onto the running color.

```
surfaceLayers()
├─ placeDauphineDoors()   ← door arcade
├─ facadeFloorLines()     ← floor division bands
├─ window grid            ← SDF rectangles
└─ facadeHatching()       ← shading strokes
```

Rules:

- each element is its **own function + its own uniforms + its own GLSL module** (`floorLines.glsl`, `hatching.glsl`, `placeDauphineDoor.glsl`, ...), so it can be reused across different facades and buildings
- new elements are built by **composing existing SDF primitives** (`sdBox`, `sdCircle`) — see the door, which is a union of leaf + arch + sill + pilaster + tympanum
- each function takes the current `color` and returns the color with its element drawn on top, so layers stack in a fixed order
- a new facade type = a new ordering / subset of these functions, not a rewrite

**Imperfections run last, always.** `warpShape()` roughs the coordinate *before* any element is drawn; `applyImperfections()` (ink breakup, transparency, grain) runs *after every element* on the finished ink-on-paper color. No surface draws shapes after imperfections. Because both live in the shared paper base, every composed facade inherits them for free.

---

# Rendering Pipeline

Every procedural material is built by `createPaperMaterial()` and follows the same layered structure. Paper is common to every material; each surface stacks its own ink layers on top, and a shared imperfection pass finishes the result.

```
Paper
↓
Surface (architectural details)
↓
Hatching
↓
Imperfections (ink breakup / grain)
```

The layers are concatenated GLSL modules, in order:

```
paper.glsl          paperColor(uv)          shared paper base texture
distortion.glsl     warpShape(p)            pre-shape coordinate wobble
imperfections.glsl  applyImperfections()    post-shape ink/grain pass
paperBase.frag      main()                  paper-space uv + surface + imperfections
<surface shader>    surfaceLayers(...)      this surface's own ink layers
```

`main()` computes the paper-space `uv`, calls `paperColor()` for the base, hands it to `surfaceLayers()` to draw shapes, then runs `applyImperfections()` on the finished color.

---

# Paper Projection

<img src="./images/shaders/paper-example.png" width="700">

The paper is generated procedurally by `paper.glsl`.

It is **not** mapped using mesh UVs.

Instead, every shader samples the paper using the same camera projection.

```
paperPos = uPaperMatrix * worldPosition
paperUV  = paperPos.xy * uPaperScale
```

`uPaperMatrix` contains only the camera rotation (position zeroed). A shader **registry** collects every paper material and refreshes this uniform each frame.

Result:

- pan → paper follows the city
- rotate → paper rotates with the camera
- zoom → paper scales naturally
- one continuous paper across the entire scene

The base tone itself is aged procedurally: a warm cream base, large + medium **stains** (domain-warped fbm so blotches read organic, not grid-like), and two layers of round **foxing specks**.

---

# Procedural Primitives

Complex elements are built from simple reusable functions.

Implemented:

- `sdBox`, `sdCircle` (SDF primitives, `sdf.glsl`)
- arch / door (composed from the SDFs, `placeDauphineDoor.glsl`)
- window grid, floor lines, hatch lines
- `fbm` noise → paper grain, stains, wobble

Reference:

https://iquilezles.org/articles/distfunctions/

---

# Surface Types

Shaders render surface types, not individual buildings. Buildings provide geometry only; shaders generate the appearance.

Implemented:

- **Facade** — door arcade, floor lines, window grid, vertical hatching
- **Paper** — the bare aged-sheet fallback for any un-specialised mesh

Planned:

- Roof (currently paper-only, see `roof.frag` TODO)
- Chimney
- Stone
- Water
- Vegetation

---

# Blender Pipeline

Blender materials are semantic tags.

```
Facade
Roof
Chimney
```

Their appearance is ignored. `replaceMaterial()` maps a mesh material **by name** to its procedural shader; unknown names fall back to bare paper.

`applyPaperShader(root, composed)` walks a model and swaps every mesh material:

- `composed = false` (default) → every mesh gets **bare paper only**
- `composed = true` (detailed buildings, e.g. Place Dauphine) → surfaces get their full facade/roof layers

---

# Facade Surface

Drawn in `surfaceLayers()`, bottom to top:

1. **Place Dauphine door arcade** — arch-topped openings in the ground zone
2. **Floor division lines** — a double band (thin + thick) at each floor boundary
3. **Window grid** — SDF rectangles, one per pitch/floor cell
4. **Vertical hatching** — the engraver's shading strokes

Two coordinate paths: if the model supplies per-wall UV + size (`aWallSize` attribute), the grid is even and centered; otherwise a world-space metric fallback (run along the wall + height, in meters) keeps even spacing without model data.

## Vertical hatching & fake light

<img src="./images/shaders/hotel-de-condé.png" width="700" alt="Vertical hatching on the Hôtel de Condé facades">

Vertical strokes fake shading from a **camera-independent** light. A shared `uLightDir` (set from azimuth + elevation) is compared against each wall's world normal: the more a facade turns away from the light, the **denser and thicker** its strokes. A fully lit wall keeps only a faint, sparse baseline. Rotating the scene never changes the shading, because it is driven by the world normal, not the view direction.

---

# UV Strategy

Mesh UVs are reserved for local architectural details:

- windows
- doors
- roof tiles
- ornaments

Paper projection never depends on mesh UVs.

---

# Imperfections & Distortion

Small procedural imperfections preserve the engraved appearance. Two shared passes keep the geometry from looking like clean vector art, and both inherit for free in every material via the shared paper base:

- **`warpShape()`** (before shapes): nudges the shape coordinate by an fbm field so every edge — windows, doors, floor lines — comes out hand-drawn wavy instead of ruler-straight.
- **`applyImperfections()`** (after shapes): ink transparency (paper bleeds through ink), ink breakup (dry/broken strokes), and fine paper grain.

Set any strength to `0` (via lil-gui) to disable that effect.

---

# Parameters

Shared uniforms:

```
uPaperMatrix
uPaperScale
```

Every other knob is also a uniform, shared across all materials of a kind and live-editable from lil-gui:

```
paper          base color, stain scale/strength, warp, speck layers
facade         window pitch/size, floor height, ground height, floor count, inkColor
door           pitch, width, arch geometry, pilaster, tympanum
hatching       density, min/max thickness, strength, uLightDir
imperfections  ink breakup, ink transparency, paper grain
distortion     strength, scale
```

`fakeLightDirection` (`uLightDir`) drives the orientation-based hatching; it is independent of the camera.

> Not yet implemented: `buildingSeed` for deterministic per-building variation while preserving visual consistency.

---

# Visual Style

<img src="./images/shaders/place-dauphine.png" width="700">

Small procedural imperfections preserve the engraved appearance:

- line wobble
- variable hatch density
- paper grain
- ink defects

---

# Philosophy

The renderer should describe a visual language rather than reproduce every engraved line.

Geometry defines the forms.

Shaders generate the engraving.

---

# Renderer Vocabulary

| Blender    | Three.js                          |
| ---------- | --------------------------------- |
| Facade     | facade surface layers ✅          |
| Roof       | roof material (paper-only, TODO)  |
| Chimney    | planned                           |
| Water      | planned                           |
| Vegetation | planned                           |

Blender materials identify surface types.

Procedural shaders generate their appearance.
