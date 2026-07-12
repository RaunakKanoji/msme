# UI Implementation Rules

## Primary UI System

This app uses shadcn-compatible components as the primary interface system. Do not create random custom components when an existing component solves the need.

## Component Priority

1. Existing business-specific components
2. Existing foundation components
3. Existing `components/ui` primitives
4. New small wrapper components
5. New custom UI only when absolutely necessary

## Brand Rules

Use the IDBI-inspired color system:

- Charcoal: `#111827`
- Orange: `#FF4D01`
- Green: `#02684F`
- Gradient: `linear-gradient(90deg, #111827 0%, #FF4D01 45%, #02684F 55%, #111827 100%)`

## Layout Rules

- Use clean card-based layouts and consistent spacing.
- Keep forms simple, readable, and fully labeled.
- Avoid clutter, excessive gradients, random colors, and inconsistent shadows.
- Use `StatusBadge` or `Badge` for text-based status; color must not be the only indicator.

## Route Rules

Every route must have a clear title, description, loading state where applicable, error state where applicable, and an empty or coming-soon state when incomplete.

## Accessibility Rules

- Every input must have a label.
- Icon-only controls need accessible labels.
- Keyboard focus must be visible.
- Error messages must be readable.
- Color must not be the only way to communicate status.
