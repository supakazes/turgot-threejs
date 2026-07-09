# Procedural Shader Architecture

<img src="./images/shaders/place-dauphine-close-up-on-doors-and-windows.png" width="700" alt="Close-up of Place Dauphine from the Turgot map">

## Goals

Avoid raster textures whenever possible.

Objectives:

- preserve the engraving style of the Plan Turgot
- minimize download size
- keep complete artistic control
- produce infinitely sharp rendering
- build a reusable procedural material library

The renderer should reproduce the **rules** of the engraving, not copy it pixel by pixel.

---

# Design Principles

- simple procedural shaders
- no PBR
- no baked textures
- no texture atlases
- geometry comes from Blender
- shaders decorate geometry

---

# Rendering Pipeline

Each surface is rendered in successive passes.

```
Wall
↓
Roof hatching
↓
Windows
↓
Doors
↓
Ink imperfections
```

Each stage modifies the current color.

---

# Procedural Primitives

Shaders are built from reusable drawing functions.

Examples:

- rectangle
- arch
- window
- door
- hatch lines
- paper grain

Complex elements are compositions of simple primitives.

Example:

```
Door

rectangle
+
half circle
```

Many primitives can be implemented with Signed Distance Functions (SDF).

Useful reference:

https://iquilezles.org/articles/distfunctions/

---

# Surface Types

Shaders render **surface types**, not individual buildings.

Typical surface types:

- Facade
- Roof
- Chimney
- Stone
- Water
- Vegetation

The same shader is reused across the entire project.

Buildings only provide geometry and parameters.

---

# Blender Pipeline

Blender defines:

- geometry
- semantic surface types

Each face is assigned a simple material such as:

```
Facade
Roof
Chimney
```

These materials act as semantic tags.

Their appearance is ignored by the renderer.

In Three.js they are replaced by procedural shaders.

---

# UV Strategy

Automatic UVs should be sufficient.

Walls:

```
U = horizontal
V = vertical
```

Roofs:

Projected from above.

All shaders work in normalized UV space (`0 → 1`), independently of the building size.

---

# Parameters

Shaders are driven by a small set of uniforms.

Examples:

```
paperColor
inkColor
buildingSeed
fakeLightDirection
```

A deterministic seed introduces subtle variations:

- hatch spacing
- line wobble
- paper imperfections
- ink density

Buildings keep the same visual identity while avoiding repetition.

---

# Building Styles

Buildings are compositions of reusable primitives.

Example:

```
Place Dauphine

Facade
+ repeated windows
+ doors
+ roof hatching
```

```
Notre-Dame

Facade
+ gothic windows
+ rose window
+ buttresses
+ roof hatching
```

The primitives remain the same.

Only their composition changes.

---

# Visual Style

The project uses an orthographic camera.

Small procedural imperfections are essential:

- slightly uneven lines
- subtle wobble
- variable hatch density
- paper grain

These imperfections preserve the hand-drawn appearance.

---

# Philosophy

The renderer should describe a visual language rather than reproduce every engraved line.

A small library of procedural shaders should be able to render most Parisian buildings while remaining lightweight, maintainable and stylistically consistent.

---

# Renderer Vocabulary

Blender materials are semantic tags.

| Blender    | Three.js                |
| ---------- | ----------------------- |
| Facade     | BuildingShader(FACADE)  |
| Roof       | BuildingShader(ROOF)    |
| Chimney    | BuildingShader(CHIMNEY) |
| Water      | WaterShader             |
| Vegetation | VegetationShader        |

Blender materials do not define appearance. They identify the type of surface so the renderer can assign the appropriate procedural shader.
