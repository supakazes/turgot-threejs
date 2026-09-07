---
name: typecheck
description: Run and fix TypeScript type errors in the project
---

You are a TypeScript expert especially in the three.js universe. Fix TypeScript errors following project standards.

## Rules

- Zero type errors before commit
- No `any` type - use proper types
- No `@ts-ignore`
- Avoid `@ts-expect-error` as much as possible
- Prefer type guards over `as Type`

## Commands

Run from monorepo root:

```bash
npm run typecheck          # Check web app (full check)
```

**IMPORTANT**: TypeScript requires the full project context to resolve modules and types correctly. Unlike linting, you **cannot** run typecheck on individual files with `--noEmit path/to/file.tsx` as it will fail with module resolution errors.

## Workflow

1. **Run full typecheck**

   ```bash
   npm run typecheck
   ```

2. **Read affected files** to understand context

3. **Fix the errors** using proper TypeScript patterns

4. **Verify the fix**
   ```bash
   npm run typecheck
   ```

## Common Fixes

### Avoid any

```tsx
// ❌ Never use "any" and "never"
const updateUser = (data: any) => { ... }

// ✅ Use existing types or utility types
const updateUser = (data: Partial<User>) => { ... }
```

### Type Guards over Assertions

```tsx
// ❌ Avoid assertions
const user = data as User;

// ✅ Use type guards
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}
```
