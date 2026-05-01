# Handoff: Sub Gourmet — Restaurant Single-Page Website

## Overview
A single-page marketing website for **Sub Gourmet**, a Mediterranean restaurant in Srebreno, Croatia (Dubrovnik Riviera). The site introduces the restaurant, presents the full bilingual (Croatian / English) menu, shows photography of the room and food, gives location/visit details, and lets guests request a reservation through an in-page modal.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that demonstrates the intended look, feel, and behavior. They are **not production code to copy directly**.

The goal is to **recreate these designs in your target codebase's existing environment** (e.g. Next.js, Astro, Nuxt, Remix, plain HTML/CSS, etc.) using its established patterns, component library, build tooling, image pipeline, and CMS conventions. If no environment exists yet, pick the framework that best fits the deployment target — for a marketing site, Astro or Next.js (App Router) are strong defaults.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all defined. Recreate pixel-perfectly using the target codebase's existing libraries and patterns. All values listed in *Design Tokens* below are the source of truth.

---

## Page Structure (single-page scroll)
The page is one long scroll with the following sections, in order. Each `<section>` has an `id` so the sticky nav can anchor-link to it.

1. `#top` — Hero
2. `#about` — About / Story
3. `#menu` — Tabbed menu (centerpiece)
4. `#gallery` — Masonry photo grid
5. `#visit` — Address / hours / stylized map
6. Footer (no id)

A reservation modal overlays everything when triggered.

---

## Sections

### 1. Sticky Nav
- **Position**: `position: fixed; top:0; left:0; right:0; z-index:100;`
- **Two states**:
  - **Over dark sections** (hero, gallery): transparent background, light text (`--ink`).
  - **Scrolled / over light sections**: backdrop-blurred dark surface (`rgba(20,17,14,0.85)`), light text. Triggered when `window.scrollY > 80`.
- **Logo (left)**: small caps wordmark `SUB · GOURMET` with a small bowl-glyph between the two words. Cormorant Garamond, 22px, letter-spacing 0.18em. The glyph is built in CSS:
  - 22×12px box, 1.5px solid border, no border-top, `border-radius: 0 0 22px 22px` (a half-bowl).
  - Three 4px circular dots on top (one centered with `::before`, two siblings via `box-shadow: -5px 0 0, 5px 0 0`) — represents three garnish dots in the bowl.
- **Links (center)**: About · Menu · Gallery · Visit. Inter 12px, uppercase, letter-spacing 0.14em, opacity 0.85 → 1 on hover.
- **CTA (right)**: "Reserve" — outlined button (1px border, 10px 20px padding, 11px uppercase). Triggers modal.
- **Mobile (≤960px)**: links hidden, CTA hidden, hamburger icon shown that scrolls to `#menu`.

### 2. Hero (`#top`)
- **Min-height**: 100vh, dark bg (`--charcoal` #14110E).
- **Background image**: full-bleed Unsplash photo of restaurant interior, with a 120° gradient overlay `rgba(20,18,16,0.78) → 0.45 → 0.78` for legibility. Plus a vertical gradient at top and bottom for nav fade and section transition.
- **Layout**: 1280px max-width container, 40px horizontal padding, 140px top / 80px bottom padding.
- **Content (top to bottom)**:
  - **Eyebrow**: gold (`--gold` #D4B370) text "Srebreno · Dubrovnik Riviera" preceded by a 36×1px gold line. Mono font, 11px, uppercase.
  - **H1**: "Sub / Gourmet" (with a small line break). Cormorant Garamond, 400 weight, `clamp(60px, 11vw, 168px)`, line-height 0.92, letter-spacing -0.02em. The single letter `e` in "Gourmet" is styled italic + light + gold as an accent.
  - **Tagline**: "Mediterranean flavors, Adriatic soul — where the coast meets the table, slowly, the way it should." Cormorant Garamond italic 300, `clamp(20px, 2.4vw, 28px)`, color `rgba(237,227,210,0.72)`, max-width 540px.
  - **CTAs**: "View Menu" (gold solid button, hover → outlined gold) and "Reserve a Table" (ghost outlined button, hover → solid light). 16×32 padding, 12px uppercase, animated arrow on hover (the line lengthens from 18px to 26px).
  - **Meta row**: 3 inline items separated by 48px gap, top border `1px solid rgba(237,227,210,0.16)`, 28px top padding.
    - "Today" → `● Open until 9 PM` (gold dot)
    - "Reviewed" → `★ 4.5 · 257 reviews`
    - "Per person" → `€10 – €15`
- **Bottom-right corner**: "Scroll" label + 1px×60px vertical line with a gold dot animating top→bottom every 2.4s (`@keyframes scrollDot`).

### 3. About (`#about`)
- **Background**: `--cream` (#2C2620, the dark warm brown — note: variable named `cream` for legacy reasons but the value is dark).
- **Padding**: 140px 0.
- **Layout**: 2-column grid `1fr 1.1fr`, 80px gap, vertically centered.
- **Left column** — **About image**:
  - Aspect ratio 4:5, full-bleed Unsplash photo of the terrace.
  - "Stamp" overlay bottom-left: gold solid block, padded 18×28, "Established / Since 2014" in Cormorant italic 24px with a small mono "ESTABLISHED" label above.
  - Box-shadow `0 20px 40px rgba(0,0,0,0.45)`.
- **Right column** — **Copy + stats**:
  - Eyebrow "Our Story" (gold mono).
  - H2: "A small kitchen with the *whole sea* beside it." `clamp(40px, 5.5vw, 76px)` Cormorant 400. Italic phrase in gold.
  - Lead paragraph: 28px Cormorant 500, line-height 1.4.
  - 2 follow-up paragraphs: 22px Cormorant, color `--ink-soft` (#C9BBA5).
  - **Stats grid** (3 columns, top border, 36px top padding, 48px top margin):
    - "12 / Years on the bay"
    - "94% / Locally sourced"
    - "4.5★ / 257 reviews"
    - Number in Cormorant 44px gold; label in Inter 11px uppercase letter-spacing 0.14em mute.
- **Mobile**: collapses to 1 column, image becomes 4:3.

### 4. Menu (`#menu`) — centerpiece
- **Background**: `--cream-2` (#221D18).
- **Padding**: 140px 0 160px.
- **Section head**: eyebrow "The Menu", H2: "Every plate tells a story *of the coast.*"
- **Tab bar**: full-width strip of 10 tabs in a flex row with 4px gap, padded 6px, background `--cream-3`, 1px rule. Tabs are 12×18 padding, 11px uppercase, letter-spacing 0.14em. Active tab: solid gold (`--gold`) bg, charcoal text. Inactive: `--ink-mute` (#8A7C68) text, hover → `--ink`.
- **10 categories** (see *Menu Data* below): Breakfast, Appetizers, Soups & Salads, Pasta, Main Courses, Pizza, Burgers, Gyros & Tortillas, Kids' Corner, Desserts.
- **Section meta row** (above items): bilingual section title `Doručak / Breakfast` (Croatian first in Cormorant 48px 400; English in italic 28px gold-deep with margin-left 12px). Right side: hours OR a one-line italic note. Bottom border `--rule`.
  - Breakfast specifically shows: `Hours · 09:00 – 11:30 · Monday to Sunday`.
- **Items grid**: 2-column grid (1fr 1fr), 80px column gap, 0 row gap.
- **Each menu item**:
  - Two columns: name+desc on left, price on right, both baseline-aligned.
  - **Name (HR)**: Cormorant 22px 500, line-height 1.2.
  - **Name (EN)**: Inter 13px italic, color `--ink-mute`, displayed as block under the HR name with 4px top margin.
  - **Description**: Inter 13px, color `--ink-soft`, max-width 360px, 8px top margin.
  - **Price**: Cormorant 22px 500, color `--gold`, with a 12×1px rule before it (signature dot-leader effect).
  - **Signature items** get a `★` 12px gold marker positioned at `left: -18px; top: 24px`. Toggle via `showSignatureStars` prop.
  - 22px vertical padding, 1px dashed bottom border in `--rule`.
- **Callout** (below grid, 64px top margin): solid `--charcoal` panel, 48px padding, 2-col grid (text + CTA button). Headline 32px Cormorant with italic gold phrase. Body 14px `--ink-soft`. CTA "Talk to us" → links to `#visit`.
- **Mobile**: tabs wrap, grid becomes 1-column, callout stacks.

### 5. Gallery (`#gallery`)
- **Background**: solid `--charcoal` (#14110E), text `--ink`.
- **Padding**: 140px 0.
- **Section head**: "The Room & The Plate" / H2 "Where the *Adriatic* meets the table."
- **Masonry-style grid**:
  - `grid-template-columns: repeat(4, 1fr); grid-auto-rows: 180px; gap: 12px;`
  - Modifier classes:
    - `.big` → row-span 2, col-span 2 (large hero tile)
    - `.tall` → row-span 2
    - `.wide` → col-span 2
  - Each `<img>` has `object-fit: cover`, slight desaturation/dim filter (`saturate(0.92) brightness(0.95)`), and on hover transitions to `scale(1.06)` + `saturate(1.05) brightness(1.02)` over 0.7s.
- **9 photos** of food + ambiance + coastline (see *Assets*).
- **Mobile**: 2-column grid at ≤960px (140px rows), 1-column at ≤520px.

### 6. Visit (`#visit`)
- **Background**: `--cream` (#2C2620).
- **Padding**: 140px 0 120px.
- **Section head**: "Find Us" / H2 "A short walk from the sea, *a long stay at the table.*"
- **Layout**: 2-col grid `1fr 1.2fr`, 80px gap.
- **Left** — info blocks (32px gap), each with:
  - Label (gold mono 11px uppercase 0.18em letter-spacing)
  - Value (Cormorant 24px) and optional smaller secondary value (18px, `--ink-soft`)
- **Five blocks**:
  1. **Address**: `Šetalište dr. Franje Tuđmana 2a / 20207 Srebreno, Croatia`. Secondary: "Located in K Centar Sub City"
  2. **Hours**: "Open daily · until 9 PM". Secondary: "Breakfast served 09:00 – 11:30"
  3. **Reservations**: `+385 20 642 111`
  4. **At the Table** — chip row of 4 tags: "Outdoor seating", "Great cocktails", "Vegetarian options", "Walk-ins welcome". Each tag: 6×12 padding, 12px Inter, 1px rule border, `--cream-3` bg.
  5. **Per Person**: €10 – €15
- **Right** — stylized map panel:
  - `--charcoal` bg, 40px padding, min-height 540px, 1px rule border.
  - **No real map / no coordinates.** This is a stylized SVG illustration of a coastline:
    - 600×600 SVG with a 40px grid pattern (`stroke: rgba(245,240,232,0.1)`).
    - A path representing a coastline (bay curve) filled with a translucent gold (`rgba(201,169,97,0.06)`) and 1px gold stroke.
    - A second path for terrain contour lines.
    - A dashed path representing a road.
  - **Map pin**: 16×16 gold dot at left:58% / top:48%, animated with `pinPulse` keyframes (concentric box-shadow rings expanding/contracting every 2.4s).
  - **Top overlay**: `● Srebreno Bay` mono label + Cormorant italic 28px line "Just off the promenade, *two minutes from the sea.*"
  - **Bottom overlay**: `K CENTAR · SUB CITY` and `SREBRENO · CROATIA` in mono 10px (no lat/long coordinates), and a gold "Open in Maps ↗" CTA linking to Google Maps with the address as a query.
- **Mobile**: stacks 1-column, map min-height 380px.

### 7. Footer
- **Background**: `--charcoal-2` (#0E0C0A).
- **Padding**: 80px 0 30px.
- **Top row**: 4-column grid `1.4fr 1fr 1fr 1fr`, 60px gap, 60px bottom padding, 1px bottom rule.
  - **Brand col**: "SUB · GOURMET" Cormorant 32px letter-spacing 0.16em + italic tagline.
  - **Visit col**: links to anchors.
  - **Contact col**: phone (`tel:` link), email (`mailto:hello@subgourmet.hr`), full address.
  - **Follow col**: gold "Follow" header, two 36px round social icon buttons (Instagram, Facebook — inline SVGs, 1.5 stroke), and "@subcaffegourmet" caption.
- **Bottom row** (30px top padding, flex-between): "© 2026 Sub Gourmet · Srebreno, Croatia" / "Designed with care on the Adriatic". 12px, 0.35 opacity.

### 8. Reservation Modal
- **Trigger**: nav "Reserve" button or hero "Reserve a Table" button.
- **Backdrop**: `rgba(20,18,16,0.7)` with 8px backdrop-blur. Opacity transition 0.3s.
- **Panel**: `--cream-3` (#3A322A) bg, max-width 540px, 48px padding, 1px rule border. Slides up 20px on open.
- **Two states**:
  - **Form state**: Title "Reserve *your table*" (Cormorant 40px, italic gold accent). Sub: "Let us know when, and we'll have the bread warm and the wine ready."
    - 2-column grid form (collapses to 1-col mobile):
      - Name (text, required)
      - Phone (tel, required)
      - Date (date, required)
      - Time (select; options 12:00, 13:00, 14:00, 18:00, 18:30, 19:00, 19:30, 20:00, 20:30)
      - Guests (select; 1–8+)
      - Seating (select; No preference / Outdoor terrace / Indoor)
      - Notes (textarea, full-width, 2 rows)
    - Submit button "Request table" (gold) + cancel link.
    - Inputs: 12×14 padding, 1px rule border, `--cream-2` bg, 15px Inter. Focus → border `--gold-deep`.
  - **Success state**: 64px round gold checkmark, "Hvala — *see you soon.*" + confirmation line interpolating selected guests/date/time. Single "Close" button.
- Click outside modal → closes. Submitting form → switches to success state. Closing → resets to form state after 400ms (for next open).

---

## Interactions & Behavior

### Sticky nav state
```js
window.scrollY > 80               // → scrolled (blurred dark bg)
overHero (y < window.innerHeight - 80)
overGallery (gallery rect top < 60 && bottom > 60)
overDark = overHero || overGallery
```
The "scrolled" and "overDark" booleans together drive nav background/color.

### Smooth scroll
`html { scroll-behavior: smooth; scroll-padding-top: 72px; }` — anchor links (e.g. `#menu`) glide and account for the sticky nav height.

### Scroll reveals
Every element with class `.reveal` starts at `opacity: 0; transform: translateY(30px);` and gets `.in` added when it enters the viewport (IntersectionObserver, threshold 0.12, rootMargin `0px 0px -60px 0px`). The transition is `opacity 0.9s, transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)`. Each element is unobserved after first reveal (one-shot).

### Menu tabs
Pure React state (`useState`). Click sets active tab; the content below re-renders for the selected category. No URL hash sync, no animation between tabs (just instant swap).

### Animated decorations
- Hero scroll dot: `scrollDot` 2.4s linear infinite, gold dot moves top→bottom inside a 60px vertical line.
- Map pin: `pinPulse` 2.4s ease-in-out infinite, expanding concentric ring shadows.
- Button arrow: line widens from 18px to 26px on hover (0.25s ease).
- Gallery hover: image scales to 1.06 and brightens slightly (0.7s ease).

### Modal flow
- Open: `modalOpen` state in `<App>`, controlled via prop. Backdrop adds `.open` class.
- Close: backdrop click OR cancel link OR close button on success state.
- On `open=false`, the step state resets to `'form'` after a 400ms delay so transitions complete cleanly.

### Responsive breakpoints
- `≤960px`: single-column layouts, hidden nav links/CTA, hamburger icon, smaller hero padding, single-column menu, 2-col gallery, stacked visit, modal becomes 1-col form.
- `≤520px`: 1-col footer, 1-col gallery, 64px hero h1, vertical hero meta.

---

## State Management

The prototype uses a single React component tree with these state hooks (consolidate or distribute as your framework prefers):

| Hook | In | Purpose |
|---|---|---|
| `tweaks` (object) | `App` | Design knobs — accent color, hero image, signature stars toggle, menu layout. Production app does **not** need this; remove the Tweaks panel entirely. |
| `modalOpen` (bool) | `App` | Reservation modal visibility. |
| `scrolled` (bool) | `App` | Has user scrolled past 80px. |
| `overDark` (bool) | `App` | Is the nav currently over a dark section. |
| `active` (string) | `MenuSection` | Currently selected menu category id. |
| `step` ('form' \| 'done') | `ReservationModal` | Modal sub-state. |
| `data` (object) | `ReservationModal` | Form fields. |

For production: replace the dummy form submission with a real POST to a reservation endpoint (or a service like Resend / SendGrid / a CMS form handler). Validate phone number format and date/time combination (e.g. require date >= today, time within service hours).

---

## Design Tokens

CSS custom properties (defined on `:root` in the prototype). The variable names retain `cream*` for legacy reasons but the **values are intentionally dark** — the design moved away from a light cream palette to a moodier warm-dark scheme. Rename freely when porting (suggested production names in parens).

```css
--cream:      #2C2620;   /* (surface)        — dominant page background, deep warm brown */
--cream-2:    #221D18;   /* (surface-2)      — slightly darker section (menu) */
--cream-3:    #3A322A;   /* (surface-3)      — card / contrast surface (modal, tags) */
--charcoal:   #14110E;   /* (surface-deepest)— darkest panel (gallery, callouts) */
--charcoal-2: #0E0C0A;   /* (surface-foot)   — footer */
--ink:        #EDE3D2;   /* (text)           — primary text on dark surfaces */
--ink-soft:   #C9BBA5;   /* (text-soft)      — secondary text */
--ink-mute:   #8A7C68;   /* (text-muted)     — labels, inactive tabs */
--gold:       #D4B370;   /* (accent)         — primary accent: prices, CTAs, highlights */
--gold-deep:  #C9A961;   /* (accent-deep)    — focus ring, italic accent */
--terracotta: #C26B4F;   /* (accent-warm)    — unused in current screens; reserved */
--olive:      #8A8E5E;   /* (accent-cool)    — unused; reserved */
--rule:       rgba(237,227,210,0.10);  /* hairline borders on dark */
--rule-light: rgba(237,227,210,0.18);
```

### Typography

| Family | Use | Weights loaded |
|---|---|---|
| **Cormorant Garamond** | Display, headlines, item names, section titles | 300, 400, 500, 600, 700, italic 400/500 |
| **Inter** | Body, descriptions, UI labels, form fields | 300, 400, 500, 600, 700 |
| **JetBrains Mono** | Eyebrows, small caps labels, map labels | 400, 500 |

Loaded via Google Fonts. Font sizes are mostly fluid using `clamp()`:
- H1 hero: `clamp(60px, 11vw, 168px)`, line-height 0.92, letter-spacing -0.02em
- Section H2: `clamp(40px, 5.5vw, 76px)`, line-height 1.02
- Tagline: `clamp(20px, 2.4vw, 28px)`
- Body: 16px / line-height 1.6
- Mono labels: 11px, letter-spacing 0.18em, uppercase

### Spacing
The design uses a loose multiple-of-4 / multiple-of-8 rhythm. Common values:
- Section padding: **140px** vertical (90px on mobile)
- Container max-width: **1240px**, **40px** horizontal padding (24px on mobile)
- Section-head bottom margin: **64px**
- Inter-block gap: 32px (visit info), 80px (about / visit columns), 12px (gallery), 8px / 80px (menu rows / cols)

### Borders & rules
- 1px solid `--rule` for borders on dark surfaces
- 1px dashed `--rule` for menu item separators
- No border radius on most surfaces — the design is intentionally **square / architectural** (no rounded cards). Exceptions:
  - Round social icons (50%), pulse dot (50%)
  - Bowl glyph in logo (`0 0 22px 22px`)

### Shadows
Used sparingly:
- Stamp on about image: `0 20px 40px rgba(0,0,0,0.45)`
- Map pin pulse: animated multi-layer `box-shadow`

### Buttons
| Class | Bg | Text | Border | Hover |
|---|---|---|---|---|
| `.btn-primary` | gold | charcoal | gold | bg→transparent, text→gold |
| `.btn-ghost` | transparent | ink | `rgba(237,227,210,0.4)` | bg→ink, text→charcoal |
| `.btn-dark` | gold | charcoal | gold | bg→transparent, text→gold |
| `.btn-outline-dark` | transparent | ink | ink | bg→ink, text→charcoal |

All buttons: 16×32 padding, 12px Inter, uppercase, letter-spacing 0.16em, 1px solid border, 0.25s transitions, animated arrow chevron child.

---

## Menu Data

The full bilingual menu is in **`menu-data.jsx`**. 10 categories, each with `id`, `hr` (Croatian name), `en` (English name), optional `hours`, optional `note`, and an `items` array. Each item has `hr`, `en`, `desc`, `price` (string EUR, no symbol), and optional `signature: true` flag.

**Signature items** (★ in the design):
- Sub Gourmet doručak — €12.90
- Tagliatelle s umakom od tartufa / Tagliatelle with Truffle Sauce — €15.30
- Sub Gourmet Pizza — €17.20
- Lignje na žaru / Grilled Squids — €19.60
- Sub Gourmet Burger — €14.80

In production you almost certainly want this in a CMS (Sanity / Contentful / Payload / a Markdown frontmatter file) so the kitchen can edit prices without a redeploy.

---

## Assets

All photography in the prototype is stock from **Unsplash** (placeholder use). Replace with real Sub Gourmet photography before launch.

URLs used (for reference / to know what was *intended* visually):

| Slot | URL |
|---|---|
| Hero — interior (default) | `https://images.unsplash.com/photo-1559339352-11d035aa65de` |
| Hero — pasta (alt) | `https://images.unsplash.com/photo-1473093295043-cdd812d0e601` |
| Hero — table (alt) | `https://images.unsplash.com/photo-1414235077428-338989a2e8c0` |
| Hero — coast (alt) | `https://images.unsplash.com/photo-1467003909585-2f8a72700288` |
| About — terrace | `https://images.unsplash.com/photo-1414235077428-338989a2e8c0` |
| Gallery — pizza (big) | `https://images.unsplash.com/photo-1565299624946-b28f40a0ae38` |
| Gallery — pasta (tall) | `https://images.unsplash.com/photo-1473093295043-cdd812d0e601` |
| Gallery — terrace | `https://images.unsplash.com/photo-1414235077428-338989a2e8c0` |
| Gallery — interior | `https://images.unsplash.com/photo-1559339352-11d035aa65de` |
| Gallery — burger (wide) | `https://images.unsplash.com/photo-1551782450-a2132b4ba21d` |
| Gallery — coast (tall) | `https://images.unsplash.com/photo-1467003909585-2f8a72700288` |
| Gallery — squid | `https://images.unsplash.com/photo-1559847844-5315695dadae` |
| Gallery — tiramisu | `https://images.unsplash.com/photo-1551183053-bf91a1d81141` |
| Gallery — grilled fish (wide) | `https://images.unsplash.com/photo-1514933651103-005eec06c04b` |

**Production checklist for assets**:
- Commission or shoot real food + interior photography. Match the moody warm direction (warm tungsten light, tight crops on signature dishes, terrace-at-dusk wide shots).
- Run images through your build pipeline (`next/image`, `astro:assets`, etc.) for AVIF/WebP, sizes, and lazy loading.
- All gallery images already have `loading="lazy"` and meaningful `alt` text — preserve in port.

### Logo
A small CSS-built bowl-glyph between "SUB" and "GOURMET". Original wordmark is just letterforms in Cormorant Garamond. **Do not** import or recreate the `pasted-1777657862818-0.png` reference logo verbatim — the design produced its own original treatment.

### Icons
- Instagram + Facebook: inline SVG, 1.5px stroke, 14×14, 24×24 viewBox.
- Arrow chevron on buttons: pure CSS (1px line + rotated border-square pseudo).
- Map decorations: inline SVG paths.
No icon library required.

---

## Files in this bundle

```
design_handoff_sub_gourmet/
├── README.md          ← this file
├── Sub Gourmet.html   ← root HTML, all CSS, mounts the React app
├── app.jsx            ← React components (Nav, Hero, About, MenuSection, Gallery, Visit, Footer, ReservationModal, App)
├── menu-data.jsx      ← bilingual menu data (10 categories, ~50 items)
└── tweaks-panel.jsx   ← design-time tweak controls; REMOVE in production
```

Open `Sub Gourmet.html` in a browser to see the prototype.

### What to drop
- `tweaks-panel.jsx` and the entire `<TweaksPanel>` block in `app.jsx` (look for `useTweaks(TWEAK_DEFAULTS)` and the `<TweaksPanel title="Tweaks">…</TweaksPanel>` block at the bottom of `App`). The `TWEAK_DEFAULTS` constant and any `tweaks.*` reads.
- The Babel-in-browser pipeline (`@babel/standalone`, `text/babel` script tags). Use your codebase's actual JSX compilation.
- `JetBrains Mono` is optional — swap for a system mono if you prefer fewer fonts.

### What to preserve carefully
- Color tokens — the warm dark palette is the soul of the design.
- Typographic ratios — Cormorant for warmth, Inter for legibility, mono for restraint.
- Section pacing (140px verticals) — the design depends on generous breathing room.
- The bilingual menu treatment (Croatian primary serif, English italic muted secondary).
- Gold accent **only** on prices, CTAs, single-letter accents, and small status dots — do not over-use.
