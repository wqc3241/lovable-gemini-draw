# Design System Strategy: Cinematic Intelligence

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Synthetic Auteur."** 

This system is designed to bridge the gap between cold machine logic and fluid human creativity. We are moving away from the "SaaS-standard" look—characterized by rigid grids and heavy borders—and moving toward a high-end editorial experience. The interface should feel like a premium editing suite: immersive, deep, and focused. 

By leveraging intentional asymmetry, overlapping "glass" panels, and a hierarchy defined by light and shadow rather than lines, we create an environment where the content (video and AI-generated assets) remains the protagonist.

---

## 2. Colors & Surface Philosophy
Our color palette is rooted in deep obsidian tones, punctuated by vibrant "energy sources" that signify AI activity.

### The "No-Line" Rule
To maintain a premium, seamless aesthetic, **1px solid borders are prohibited for sectioning.** Boundaries between content areas must be defined solely through background color shifts. 
- A sidebar uses `surface-container-low` (#1B1B1B).
- The main workspace uses `surface` (#131313).
- Floating panels use `surface-container-high` (#2A2A2A).
This creates a sophisticated, "molded" look rather than a fragmented one.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface-container` tiers to create depth:
- **Level 0 (Base):** `surface` (#131313) for the primary background.
- **Level 1 (Inland):** `surface-container-low` (#1B1B1B) for recessed areas like secondary sidebars.
- **Level 2 (Raised):** `surface-container-high` (#2A2A2A) for cards or primary interactive modules.
- **Level 3 (Floating):** `surface-container-highest` (#353535) for active states or elements closer to the user.

### Signature Textures
- **The "AI Pulse" Gradient:** For primary AI-driven CTAs, use a linear gradient transitioning from `primary` (#d0bcff) to `primary-container` (#a078ff) at a 135-degree angle. This provides a tactile "glow" that flat colors cannot achieve.
- **Glassmorphism:** For floating overlays (modals, dropdowns), use `surface-container-low` with 60% opacity and a `20px` backdrop-blur. This ensures the creative content behind the UI is never fully lost, maintaining immersion.

---

## 3. Typography: The Editorial Scale
We pair the technical precision of **Inter** with the architectural character of **Space Grotesk**.

- **Display & Headlines (Space Grotesk):** Used for large headers and "hero" moments. The wide apertures and geometric shapes of Space Grotesk convey high-tech sophistication.
- **Body & Labels (Inter):** Used for all functional text. Inter provides maximum legibility in high-density creative tools.

**Hierarchy as Identity:**
- **Display-LG (3.5rem):** Use with `primary` color and `-0.04em` letter-spacing for a bold, cinematic impact.
- **Headline-MD (1.75rem):** Use for section titles. Ensure generous top-margin (4x the spacing scale) to create "breathing room" typical of high-end magazines.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** and light simulation, never through harsh structural lines.

### Ambient Shadows
For floating elements (Tooltips, Popovers), use "Ambient Shadows":
- **Color:** A tinted version of `on-surface` at 5% opacity.
- **Blur:** Large diffusion (20px - 40px).
- **Purpose:** To mimic natural light hitting a matte surface, creating a soft, organic lift.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., in a high-density data grid), use a **Ghost Border**:
- Token: `outline-variant` (#494454).
- Opacity: **Reduced to 15%**.
- Result: A hint of a boundary that disappears into the background upon quick glance.

---

## 5. Component Guidelines

### Buttons (The "Tactile" Approach)
- **Primary (AI-Action):** Use the "AI Pulse" Gradient. Border radius: `md` (0.75rem). No border.
- **Secondary:** Surface-container-highest (#353535) background with `on-surface` text.
- **Tertiary:** Transparent background, `primary` text. Use for low-emphasis navigation.

### Cards & Creative Assets
- **Rule:** Forbid divider lines. Use `surface-container-low` to house cards on a `surface` background.
- **Radius:** All media containers must use `lg` (1rem) for a modern, handheld-device feel.

### Input Fields
- **Surface:** `surface-container-lowest` (#0E0E0E) to create a "hollowed-out" effect.
- **Active State:** A `1px` Ghost Border at 40% opacity using the `primary` color.
- **Typography:** Always use `body-md`.

### Chips (Meta-Tagging)
- For AI-generated tags, use `secondary-container` (#B50036) with 20% opacity and `secondary` (#FFB2B7) text. This high-contrast, low-saturation look signals "automated" content.

### Tooltips
- Background: `inverse-surface` (#E2E2E2).
- Text: `inverse-on-surface` (#303030).
- Shadow: Ambient Shadow (Large blur, 8% opacity).

---

## 6. Do’s and Don’ts

### Do
- **Do** use whitespace as a separator. If you think you need a line, try adding 24px of space instead.
- **Do** use `primary` (#d0bcff) sparingly. It should feel like a "power source" that lights up the dark interface.
- **Do** lean into asymmetry in landing page layouts—overlap an image over a text container using `z-index` to create editorial depth.

### Don’t
- **Don’t** use pure black (#000000) for large surfaces. Use `surface` (#131313) to allow for subtle shadow depth.
- **Don’t** use `none` or `sm` border radii unless for micro-icons. A premium feel requires the softness of `md` and `lg`.
- **Don’t** use high-contrast transitions. All state changes (hover, active) should have a minimum `200ms` ease-in-out transition to mimic the fluid nature of video.

---

## 7. Spacing & Rhythm
We follow an 8px base grid, but for a premium feel, we prioritize **"Extreme Margin"** for layout-level containers:
- **Section Padding:** 80px to 120px (Desktop).
- **Component Gap:** 16px (`DEFAULT` radius scale logic).
- **Internal Padding:** Always use `1.5rem` (`xl`) for card internals to ensure the content doesn't feel "choked."