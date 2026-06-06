# Everything related to Three.js rendering.

Example:

```
renderer/
  Renderer.ts
```

```ts
export class Renderer {
  public renderer: THREE.WebGLRenderer;
}
```

## Responsibilities:

- WebGLRenderer
- resize handling
- pixel ratio
- shadows
- post-processing (later)
