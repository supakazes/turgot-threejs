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

The city is rendered as if engraved on a **single sheet of paper**.

---

# Rendering Pipeline

Every procedural material follows the same structure:

```
Paper
↓
Surface
↓
Architectural details
↓
Hatching
↓
AO / Shadows
```

Paper is common to every material.

---

# Paper Projection

<img src="./images/shaders/paper-example.png" width="700">

The paper is generated procedurally by `paper.glsl`.

It is **not** mapped using mesh UVs.

Instead, every shader samples the paper using the same camera projection.

```
paperPosition = uPaperMatrix * worldPosition
paperUV = paperPosition.xy
```

`uPaperMatrix` contains only the camera rotation.

Result:

- pan → paper follows the city
- rotate → paper rotates with the camera
- zoom → paper scales naturally
- one continuous paper across the entire scene

---

# Procedural Primitives

Complex elements are built from simple reusable functions.

Examples:

- rectangle
- arch
- window
- door
- hatch lines
- paper grain

Many can be implemented as Signed Distance Functions (SDF).

Reference:

https://iquilezles.org/articles/distfunctions/

---

# Surface Types

Shaders render surface types, not individual buildings.

Typical materials:

- Facade
- Roof
- Chimney
- Stone
- Water
- Vegetation

Buildings provide geometry only.

Shaders generate the appearance.

---

# Blender Pipeline

Blender materials are semantic tags.

```
Facade
Roof
Chimney
```

Their appearance is ignored.

Three.js replaces them with procedural shaders.

---

# UV Strategy

Mesh UVs are reserved for local architectural details:

- windows
- doors
- roof tiles
- ornaments

Paper projection never depends on mesh UVs.

---

# Parameters

Shared uniforms:

```
uPaperMatrix
uPaperScale
```

Typical shader parameters:

```
paperColor
inkColor
buildingSeed
fakeLightDirection
```

`buildingSeed` introduces deterministic variation while preserving visual consistency.

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

| Blender    | Three.js                |
| ---------- | ----------------------- |
| Facade     | BuildingShader(FACADE)  |
| Roof       | BuildingShader(ROOF)    |
| Chimney    | BuildingShader(CHIMNEY) |
| Water      | WaterShader             |
| Vegetation | VegetationShader        |

Blender materials identify surface types.

Procedural shaders generate their appearance.
