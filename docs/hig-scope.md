# Web HIG Scope

Canonical standard: https://github.com/frozonfreak/hig
Pinned version: **1.12.5** (sync from `main` @ `e92fd18`, tag `v1.12.5`)

This repository applies The Web HIG as a behavioral contract for a static content/marketing site. Visual design, brand voice, layout style, and implementation stack remain project-owned.

Vendored contract: [HIG.md](../HIG.md) (Layer 3). Prefer [HIG-QUICK.md](https://github.com/frozonfreak/hig/blob/main/HIG-QUICK.md) as the default agent context when editing this site.

## Route Archetypes

| Route | Archetype | Notes |
| --- | --- | --- |
| `/` / `index.html` | content | Marketing landing page with interactive estimator and contact form. |
| `/lab` / `lab.html` | content | Project showcase page with outbound demo links. |

## Applicable Behavior

- Navigation must expose visible focus, keyboard access, Escape close behavior on mobile, and clear current-page state where applicable.
- Theme switching must expose programmatic state and preserve user preference.
- Motion must respect `prefers-reduced-motion`; decorative motion must never hide content or block completion.
- Forms must include idle, validation, loading, success, and error states with recoverable copy.
- External links must use clear labels and preserve `rel="noopener noreferrer"` when opening a new tab.
- Security headers and CSP must remain intentional; avoid broad inline script allowances when hashes or external files can satisfy the need.

## Non-Applicable For This Site

- Application shell streaming states, authenticated dashboard navigation, destructive mutations, commerce checkout behavior, and role/permission UX are out of scope unless the site adds those features.