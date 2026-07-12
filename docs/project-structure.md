# MSME Arogya360 — Project Structure

## Purpose

This file documents the current repository structure for the MSME Arogya360 app. It is intended to help developers and AI agents place new work consistently.

## Root Structure

```txt
.
├── app/                 Next.js App Router pages, layouts, and API routes
├── components/          Feature workspaces, foundation, states, and UI primitives
├── context/docs/        Product specifications, implementation context, and tracker
├── docs/                Repository-level engineering and UI guidance
├── lib/                 Mock adapters, API helpers, and constants
├── public/              Static assets
├── tests/               Node API contract tests
├── components.json      shadcn-compatible component configuration
├── package.json         Scripts and dependencies
└── tsconfig.json        TypeScript configuration
```

## App Routes

```txt
app/
├── page.tsx                         Public landing page
├── signin/, signup/, forgot-password/  Demo authentication surfaces
├── sign-in/, sign-up/               Clerk-managed authentication routes
├── app/
│   ├── page.tsx                     Secure workspace overview
│   ├── onboarding/                  MSME KYB onboarding workspaces
│   ├── applications/[id]/           Application-specific views
│   ├── financial-health/            Track 03 placeholder
│   ├── default-risk/                Track 04 placeholder
│   ├── documents/, reports/, settings/  Product placeholders
│   └── ...                          Foundation feature routes
└── api/v1/                          Versioned mock API handlers
```

## Component Structure

```txt
components/
├── ui/                 shadcn-compatible Button, Card, Badge, Alert, form, Progress, Skeleton, Avatar, Separator
├── foundation/         BrandGradient, PageHeader, SectionHeader, StatusBadge, TrackCard, FeatureCard
├── states/             Loading, empty, error, and coming-soon states
├── *-workspace.tsx     Feature-specific, data-backed onboarding workspaces
└── *-dashboard.tsx     Product foundation dashboards
```

## shadcn/ui Components

The repository’s local `components/ui` primitives provide the current shadcn-compatible UI layer. Reuse these before adding new UI code:

- Button, Card, Badge, Alert, Input, Label, Checkbox
- Progress, Skeleton, Separator, Avatar

The `components.json` configuration reserves the standard shadcn aliases. Add additional primitives only when a current route needs them.

## Constants and Utilities

```txt
lib/
├── constants/brand.ts       IDBI-inspired colors and gradient
├── constants/navigation.ts  Canonical workspace navigation
├── constants/product.ts     Product copy and Track descriptions
├── problem-statement-fit.ts Shared API error, trace, actor, and RBAC helpers
└── *.ts                     Synthetic domain adapters and audit-event stores
```

## Documentation Structure

- `context/docs/` contains product specifications and `progress-tracker.md`.
- `docs/project-structure.md` documents the repository layout.
- `docs/ui-implementation-rules.md` defines UI implementation conventions.

## Implementation Notes

- The app uses shadcn-compatible primitives for interface consistency.
- IDBI-inspired brand tokens are centralized in `lib/constants/brand.ts` and `app/globals.css`.
- Future business modules should use the foundation and state components before introducing one-off layouts.
- Do not duplicate components that already exist in `components/ui`.
- Track 03 scoring and Track 04 ML prediction are not implemented in this repository state.
