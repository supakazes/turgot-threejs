# Application bootstrap and orchestration.

Contains the classes that connect all subsystems together.

example:

```
core/
  App.ts
  Config.ts
```

```ts
const app = new App();
app.start();
```

Classes are useful when you need to keep state and expose behaviour.

## Responsibilities:

- create renderer
- create scene
- create camera
- initialize managers
- start render loop
