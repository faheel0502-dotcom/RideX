:root {
  /* ==========================================
     COLOR PALETTE - DARK MODE (DEFAULT)
     ========================================== */
  --color-canvas: #0a0a0a;
  --color-surface-raised: #141414;
  --color-surface-card: #1f1f1f;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
  --color-border: #2d2d2d;
  
  /* Accent Color (Vibrant Moto Orange) */
  --color-orange-accent: #ff5a00;
  --color-orange-hover: #e04f00;
  --color-orange-glow: rgba(255, 90, 0, 0.15);

  /* ==========================================
     TYPOGRAPHY
     ========================================== */
  /* Font Families */
  --font-display: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Type Scale */
  --text-caption: 11px;
  --leading-caption: 1.2;
  
  --text-body: 14px;
  --leading-body: 1.5;
  
  --text-subheading: 18px;
  --leading-subheading: 1.35;
  
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.25;
  
  --text-heading: 32px;
  --leading-heading: 1.2;
  
  --text-heading-lg: 48px;
  --leading-heading-lg: 1.1;
  
  --text-display: 64px;
  --leading-display: 1.05;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ==========================================
     SPACING & LAYOUT
     ========================================== */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-96: 96px;

  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;

  /* ==========================================
     SHAPES & ELEVATION
     ========================================== */
  /* Border Radii */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-cards: 16px;
  --radius-buttons-rounded: 12px;
  --radius-buttons-pill: 9999px;
  --radius-inputs: 8px;

  /* Shadows */
  --shadow-soft: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 15px var(--color-orange-glow);

  /* Glassmorphism */
  --glass-bg: rgba(20, 20, 20, 0.7);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(12px);
}

/* ==========================================
   COLOR PALETTE - LIGHT MODE OVERRIDES
   ========================================== */
[data-theme="light"] {
  --color-canvas: #ffffff;
  --color-surface-raised: #f5f5f5;
  --color-surface-card: #eaeaea;
  --color-text-primary: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a3a3a3;
  --color-border: #e5e5e5;
  
  /* Shadows */
  --shadow-soft: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
  
  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.08);
}