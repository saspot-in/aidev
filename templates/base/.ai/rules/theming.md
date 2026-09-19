# Theming rules

Stack: shadcn/ui + Radix + Tailwind + Magic UI. `theme.css` at project root is the single token source.

- All colors, radii, fonts come from `theme.css` tokens (CSS variables + Tailwind `@theme`). No hardcoded hex or arbitrary px values in components.
- Change look project-wide by editing `theme.css` only.
- Use shadcn/Radix primitives for interactive UI (`npx shadcn@latest add <name>`). Do not re-implement dialogs, menus, popovers.
- Magic UI components install through the shadcn registry and consume the same tokens; do not fork tokens per component.
- Dark/light via token swap (`.dark` block in `theme.css`), never per-component conditionals.
- Merge classes with `cn()` from `@/lib/utils`.

TODO: record how Magic UI motion components interact with tokens once first one is used (add an Invariant).
