# Design System Document

## 1. Overview & Creative North Star: "The Lacquer & Silk Archive"

This design system is built to transform a traditional noodle shop experience in Ben Tre into a high-end digital editorial. Our Creative North Star is **"The Lacquer & Silk Archive."** 

We are moving away from the "template" look of standard food apps. Instead of rigid grids and clinical whites, we treat the UI as a curated collection of heritage artifacts. The design breaks the standard container-bound layout through **intentional asymmetry**, where images of steaming bowls of Hủ Tiếu might overlap their containers, and **tonal depth**, mimicking the layered application of traditional Vietnamese lacquerware. This is a "modern-mobile" experience that breathes with the weight of history and the fluidity of premium silk.

---

## 2. Colors: Tonal Depth & Signature Textures

The palette is rooted in the "Old-World" aesthetic: oxblood reds, burnished ochre, and deep forest greens, balanced against soft parchment neutrals.

### The Palette
- **Primary (#7e000a):** The "Heart." Use this for brand-critical moments and primary actions. To provide "soul," apply a subtle radial gradient transitioning from `primary` to `primary_container` (#a11d1d) for large hero backgrounds.
- **Secondary (#855300):** The "Glow." This burnished gold/ochre represents the heritage of the noodle craft. Reserved for highlights and high-contrast labels.
- **Tertiary (#214325):** The "Jade." Extracted from the lush landscapes of Ben Tre, use this for success states or nature-inspired accents.
- **Neutral Surface Hierarchy:** From `surface_container_lowest` (#ffffff) to `surface_dim` (#d9d8ea), these tones create our physical "layers."

### The "No-Line" Rule
Prohibit the use of 1px solid borders for sectioning content. Boundaries must be defined solely through background color shifts. For example, a `surface_container_low` card should sit on a `surface` background. This creates a sophisticated, seamless flow that feels architectural rather than "boxed in."

### Glassmorphism & Silk
For floating elements (like a navigation bar or a "Quick Add" modal), use semi-transparent `surface` colors with a `backdrop-blur` of 12px-20px. This mimics the translucency of silk and ensures the rich "Lacquer" backgrounds bleed through, softening the interface.

---

## 3. Typography: The Editorial Voice

We utilize a high-contrast pairing to evoke a "Classic Heritage" feel while maintaining mobile legibility.

- **Display & Headlines (Noto Serif):** Our "Voice of Authority." The serifs should feel sharp and classic. Use `display-lg` for hero titles with tighter letter-spacing (-0.02em) to create a premium, printed-matter aesthetic.
- **Body & Titles (Work Sans):** Our "Functional Modernist." Work Sans provides the necessary clarity for menu descriptions and prices. It acts as a clean counterpoint to the decorative nature of the serif headlines.
- **Labeling:** All `label-md` and `label-sm` elements should be in `workSans` with a slight uppercase transformation and 0.05em letter spacing to denote "metadata" or "status" clearly.

---

## 4. Elevation & Depth: Tonal Layering

In this design system, depth is not a shadow; it is a **physical stack.**

### The Layering Principle
Achieve hierarchy by stacking surface-container tiers. 
1. **The Table (Base):** Use `surface_dim` or `surface_container_low`.
2. **The Parchment (Content):** Use `surface_container_lowest` for primary content cards.
3. **The Highlight (Interaction):** Use `surface_bright` for active or focused elements.

### Ambient Shadows
When a "floating" effect is required (e.g., a checkout button), shadows must be extra-diffused.
- **Blur:** 24px - 40px.
- **Opacity:** 4% - 6%.
- **Color:** Use a tinted version of `on_surface` (a deep navy/charcoal) rather than pure black to keep the lighting feel natural and ambient.

### The "Ghost Border" Fallback
If accessibility requires a border, use a "Ghost Border": the `outline_variant` token at **15% opacity**. This provides a hint of structure without interrupting the visual flow of the lacquer-inspired surfaces.

---

## 5. Components

### Buttons
- **Primary:** Background `primary` with a subtle top-to-bottom gradient to `primary_container`. Text is `on_primary`. Roundedness: `md` (0.375rem) to feel hand-carved but modern.
- **Secondary:** `surface_container_highest` background with `primary` text. No border.
- **Tertiary:** Text-only in `secondary` (Gold/Ochre), used for "View All" or "Cancel" actions.

### Cards & Lists
- **The Rule:** Forbid divider lines. Separate list items using `spacing-4` (1rem) of vertical white space or a subtle shift from `surface` to `surface_container_low`.
- **Image Treatment:** Food photography should use the `xl` (0.75rem) roundedness scale and include a very subtle inner "glow" (a 1px inset shadow at 10% white) to make the dishes pop against deep wood backgrounds.

### Input Fields
- **Style:** Underline only. Use `outline_variant` as a "Ghost Border" at the bottom of the field. Labels should be `label-md` in `on_surface_variant`. Focus state transitions the underline to `primary` (#7e000a) with a 2px thickness.

### Signature Component: The "Heritage Scroll"
For category navigation (e.g., "Noodles," "Soups," "Drinks"), use a horizontal scrolling list where the active item is marked by a `secondary` (Gold) dot underneath, mimicking a traditional wax seal or mark of quality.

---

## 6. Do's and Don'ts

### Do:
- **Use "Asymmetric Breathing Room":** Allow images to break out of their grid containers by 10-15px to create a layered, editorial feel.
- **Embrace Warmth:** Ensure the `on_surface` text always sits on a warm-toned background (never #FFFFFF).
- **Prioritize Legibility:** While the vibe is "Old-World," ensure all body text (Work Sans) maintains a minimum size of `body-md` (0.875rem) for mobile accessibility.

### Don't:
- **No Harsh Shadows:** Never use the default "Drop Shadow" settings (e.g., 0px 4px 4px Black 25%). It breaks the "Silk & Lacquer" illusion.
- **No Default System Icons:** Use thin-stroke, custom-styled icons that feel more like ink drawings than generic UI glyphs.
- **No Pure White Sections:** Avoid large blocks of #FFFFFF. Use `surface` (#fbf8ff) to maintain the parchment/heritage aesthetic.