# RideX — Style Reference
> High-performance motorcycle lifestyle — raw carbon and mechanical precision floating in clean, high-end studio lighting.

**Theme:** Dual-Theme (Dark Mode Default / Light Mode Optional)

RideX operates on a premium, high-octane dark studio aesthetic: a near-black canvas (`#0a0a0a`), carbon-textured card elements, crisp white typography, and a striking **vibrant orange** (`#ff5a00`) accent that represents performance, speed, and safety indicators. The light mode shifts to a pure white canvas (`#ffffff`) with subtle light-gray surfaces, maintaining the signature orange accents.

---

## Tokens — Colors

| Name | Dark Value | Light Value | Token | Role |
|------|------------|-------------|-------|------|
| Canvas | `#0a0a0a` | `#ffffff` | `--color-canvas` | Primary page background. Pure/near-black in dark mode for maximum contrast and lifestyle depth. |
| Raised Surface | `#141414` | `#f5f5f5` | `--color-surface-raised` | Background for navigation, sidebars, and elevated containers. |
| Card Surface | `#1f1f1f` | `#eaeaea` | `--color-surface-card` | Background for product cards, reviews, and interactive tiles. |
| Primary Text | `#ffffff` | `#0a0a0a` | `--color-text-primary` | All bold headlines, titles, and active labels. |
| Secondary Text | `#a3a3a3` | `#525252` | `--color-text-secondary` | Body text, descriptions, and metadata. |
| Muted Text | `#737373` | `#a3a3a3` | `--color-text-muted` | Captions, placeholders, and disabled states. |
| Orange Accent | `#ff5a00` | `#ff5a00` | `--color-orange-accent` | Primary brand accent for CTAs, active states, ratings, and focus rings. |
| Border | `#2d2d2d` | `#e5e5e5` | `--color-border` | Subtle structural lines, separators, and card borders. |

---

## Tokens — Typography

### Plus Jakarta Sans — Display Headlines
*   **Role**: Premium display font used for hero headlines, product names, and section titles.
*   **Weights**: `500` (Medium), `600` (Semibold), `700` (Bold).
*   **Scale**: `24px` (sm) up to `64px` (display).
*   **Line Heights**: Tight at large sizes (`1.05` to `1.2`) to emphasize strength and structure.

### Inter — Body & UI Copy
*   **Role**: Highly readable sans-serif for body descriptions, buttons, forms, and shopping cart items.
*   **Weights**: `400` (Regular), `500` (Medium).
*   **Scale**: `11px` (caption) to `18px` (subheading).
*   **Line Heights**: Comfortable (`1.35` to `1.5`) for optimal readability.

---

## Tokens — Spacing & Shapes

### Spacing Scale
*   `--spacing-4`: `4px`
*   `--spacing-8`: `8px`
*   `--spacing-12`: `12px`
*   `--spacing-16`: `16px` (Standard layout gap)
*   `--spacing-24`: `24px` (Card padding)
*   `--spacing-32`: `32px`
*   `--spacing-48`: `48px`
*   `--spacing-64`: `64px`
*   `--spacing-96`: `96px` (Section gap)

### Border Radius
*   `--radius-sm`: `4px` (small badges, tags)
*   `--radius-md`: `8px` (inputs, button rounded)
*   `--radius-cards`: `16px` (Rounded product and category cards)
*   `--radius-buttons-pill`: `9999px` (Pill buttons)

---

## Components

### Primary Orange Pill Button
*   **Role**: Primary Call-To-Action (Add to Cart, Checkout).
*   **Specs**: Background `#ff5a00`, text `#ffffff`, border transparent, border-radius `9999px`. 
*   **Hover**: Background shifts to `#e04f00` with a subtle orange glow shadow (`0 0 15px rgba(255, 90, 0, 0.25)`).

### Ghost Outlined Button
*   **Role**: Secondary actions (Compare, Wishlist, View Details).
*   **Specs**: Background transparent, text `var(--color-text-primary)`, border `1px solid var(--color-border)`, border-radius `12px`.
*   **Hover**: Border shifts to `var(--color-orange-accent)`, text becomes `var(--color-orange-accent)`.

### Glassmorphic Navigation Bar
*   **Role**: Sticky top navigation across all client pages.
*   **Specs**: Background `rgba(20, 20, 20, 0.7)` with `backdrop-filter: blur(12px)`. Bottom border `1px solid rgba(255, 255, 255, 0.08)`.
*   **Interaction**: Nav items reveal an orange indicator line underneath on hover.

### Product Card
*   **Role**: Showcasing helmets, jackets, and accessories in grids.
*   **Specs**: Background `var(--color-surface-card)`, border `1px solid var(--color-border)`, border-radius `16px`, padding `24px`.
*   **Visuals**: Clean product image centered. Price and category tags styled with orange accents. Hovering triggers a subtle scale up (`scale(1.02)`) and a soft shadow projection.

---

## Do's and Don'ts

### Do
*   Use `--color-canvas` as the universal background to preserve the premium studio depth.
*   Use `--color-orange-accent` sparingly for high-impact interactions (CTAs, ratings, badges, focus states).
*   Apply soft shadows and glassmorphism to floating menus, carts, and dropdowns.
*   Keep layouts asymmetric and clean, utilizing ample whitespace (`--spacing-48` and `--spacing-96`).

### Don't
*   Do not use generic blue, green, or red colors for success/warning states unless modified to fit the palette (e.g., muted red for errors).
*   Do not mix border radii; keep cards at `16px` and interactive inputs/buttons at `8px` or `12px`.
*   Do not clutter the page with decorative patterns; let the products (e.g., carbon-weave helmets, leather jackets) carry the visual texture.
*   Do not use harsh, heavy drop shadows; use the soft `--shadow-soft` token.
