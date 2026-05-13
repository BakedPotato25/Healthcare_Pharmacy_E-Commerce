---
name: Healthcare E-Commerce Design System
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#3e4943'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#6e7a73'
  outline-variant: '#bdcac1'
  surface-tint: '#006c4f'
  primary: '#00694d'
  on-primary: '#ffffff'
  primary-container: '#008562'
  on-primary-container: '#f5fff8'
  inverse-primary: '#71dab1'
  secondary: '#366664'
  on-secondary: '#ffffff'
  secondary-container: '#baece9'
  on-secondary-container: '#3d6c6a'
  tertiary: '#0058be'
  on-tertiary: '#ffffff'
  tertiary-container: '#2170e4'
  on-tertiary-container: '#fefcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#8df7cc'
  primary-fixed-dim: '#71dab1'
  on-primary-fixed: '#002116'
  on-primary-fixed-variant: '#00513b'
  secondary-fixed: '#baece9'
  secondary-fixed-dim: '#9ed0cd'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#1c4e4c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The visual identity of this design system is rooted in **Clinical Modernism**. It prioritizes high-trust signals, absolute clarity, and an uncompromising focus on accessibility. The goal is to evoke a sense of professional reliability—similar to a high-end modern clinic—while maintaining the friction-less convenience of premium e-commerce.

The style leverages a "Corporate Modern" approach:
- **Cleanliness:** Generous use of white space to reduce cognitive load, essential for users navigating medical information.
- **Trust:** A structured, stable layout that feels systematic and institutional without being cold.
- **Humanity:** Subtle use of soft blue accents and rounded geometry to soften the clinical edge, making the experience feel approachable and caring.

## Colors

The palette is designed to reinforce medical authority and cleanliness.

- **Primary (Medical Green):** Used for primary actions, branding, and positive reinforcement. It represents health and vitality.
- **Secondary (Teal):** A deep, grounding color used for navigation, footers, and heavy headers to provide a sense of stability.
- **Accent (Soft Blue):** Reserved for information cues, links, and secondary interactive elements to distinguish them from primary health actions.
- **Neutrals:** A range of grays built on a cool base to keep the interface feeling sterile and professional.
- **Semantic Colors:** Standardized Red, Amber, and Green used strictly for prescription status, stock alerts, and health warnings.

## Typography

This design system utilizes a dual-font strategy to balance character with utility.

- **Headlines:** **Manrope** is used for titles and headers. Its refined, modern geometric structure offers a "clean-tech" feel that remains highly legible.
- **Body & UI:** **Inter** is the workhorse for all functional text, product descriptions, and labels. It is chosen for its exceptional readability at small sizes and its neutral, trustworthy tone.

**Hierarchy Rules:**
- Use high-contrast weights (SemiBold vs Regular) rather than large size jumps to indicate importance.
- Ensure all body text maintains a minimum line height of 1.5x for accessibility, especially for medical instructions.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px max-width container for desktop viewing to prevent line lengths from becoming unreadable.

- **Grid:** A standard 12-column grid for desktop (24px gutters) and a 4-column grid for mobile (16px gutters).
- **Rhythm:** A 4px baseline grid ensures vertical consistency.
- **Spacing Philosophy:** "Breathe to Trust." Use generous padding (`xl`) between major sections to prevent the UI from feeling cluttered or "salesy." Pharmacy products require space to allow users to focus on critical data points like dosage and warnings.

## Elevation & Depth

Depth is used sparingly and purposefully to indicate interactivity and importance. 

- **Subtle Shadows:** Use "Ambient Shadows"—large blur radius (16px–24px) with very low opacity (4–8%)—tinted slightly with the Secondary Teal color to avoid a "dirty" gray look.
- **Tonal Layers:** The primary background is White (#FFFFFF), with the Light Gray (#F3F4F6) used for the background of the page itself. This creates a "Card-on-Surface" effect where the white cards appear slightly elevated without needing heavy shadows.
- **Interactive States:** On hover, cards should transition from a subtle shadow to a slightly more pronounced one to signal clickability.

## Shapes

The shape language is defined by "Approachable Precision."

- **Rounded Corners:** A standard **12px (0.75rem)** radius is applied to all primary cards and input fields. This is soft enough to feel modern but structured enough to remain professional.
- **Pills:** Status badges, tags, and some secondary buttons use a fully rounded (pill) shape. This distinguishes them from primary structural elements.
- **Icons:** Use a consistent 2px stroke weight with rounded terminals to match the typography and corner radii.

## Components

### Buttons
- **Primary:** Medical Green (#2D9D78) with white text. 12px radius. High-contrast for "Add to Cart" or "Refill."
- **Secondary:** Outlined in Teal (#1B4D4B) or Soft Blue (#3B82F6).
- **Size:** Minimum touch target of 44px height for mobile accessibility.

### Cards
- **Product Cards:** White background, 12px corner radius, 1px Light Gray border, and a subtle ambient shadow. 
- **Content:** Information is strictly tiered—Title, Strength/Dosage, Price, then Action.

### Input Fields
- **Style:** Light Gray fill with a bottom-heavy focus state using Medical Green.
- **Validation:** Clear error states using #EF4444 with accompanying icons for accessibility (don't rely on color alone).

### Status Badges (Pills)
- Used for "In Stock," "Prescription Required," or "Order Shipped."
- **Layout:** Small text (Label-md), 999px radius, low-saturation background tints with high-saturation text for readability.

### Pharmacy-Specific Components
- **Dosage Toggles:** Clear, segmented controls for selecting quantity or strength.
- **Trust Badges:** Small, non-intrusive icons near checkout (e.g., "Verified Pharmacist," "Secure Data") using the Teal palette.