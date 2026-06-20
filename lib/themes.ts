export type ThemeId = 'dark-green' | 'dark-minimal' | 'light-clean' | 'light-blue'

export interface ThemePreset {
  id: ThemeId
  name: string
  cssVars: Record<string, string>
}

export const THEME_PRESETS: Record<ThemeId, ThemePreset> = {
  'dark-green': {
    id: 'dark-green',
    name: 'Dark Green',
    cssVars: {
      '--accent': '#39FF14',
      '--accent-glow': 'rgba(57,255,20,0.28)',
      '--accent-dim': 'rgba(57,255,20,0.1)',
      '--bg': '#050505',
      '--surface': 'rgba(15,15,15,0.8)',
      '--text': '#ffffff',
      '--text-muted': 'rgba(255,255,255,0.45)',
      '--text-dim': 'rgba(255,255,255,0.35)',
      '--card': '#f0ece4',
      '--card-text': '#111111',
      '--border': 'rgba(255,255,255,0.06)',
      '--border-strong': 'rgba(255,255,255,0.12)',
      '--radius': '12px',
      '--font': 'Inter',
    },
  },
  'dark-minimal': {
    id: 'dark-minimal',
    name: 'Dark Minimal',
    cssVars: {
      '--accent': '#ffffff',
      '--accent-glow': 'rgba(255,255,255,0.15)',
      '--accent-dim': 'rgba(255,255,255,0.06)',
      '--bg': '#0a0a0a',
      '--surface': 'rgba(20,20,20,0.8)',
      '--text': '#ffffff',
      '--text-muted': 'rgba(255,255,255,0.45)',
      '--text-dim': 'rgba(255,255,255,0.25)',
      '--card': '#141414',
      '--card-text': '#ffffff',
      '--border': 'rgba(255,255,255,0.06)',
      '--border-strong': 'rgba(255,255,255,0.1)',
      '--radius': '8px',
      '--font': 'Inter',
    },
  },
  'light-clean': {
    id: 'light-clean',
    name: 'Light Clean',
    cssVars: {
      '--accent': '#111111',
      '--accent-glow': 'rgba(0,0,0,0.08)',
      '--accent-dim': 'rgba(0,0,0,0.04)',
      '--bg': '#ffffff',
      '--surface': 'rgba(245,245,245,0.8)',
      '--text': '#0a0a0a',
      '--text-muted': 'rgba(0,0,0,0.45)',
      '--text-dim': 'rgba(0,0,0,0.3)',
      '--card': '#f9f9f9',
      '--card-text': '#0a0a0a',
      '--border': 'rgba(0,0,0,0.06)',
      '--border-strong': 'rgba(0,0,0,0.12)',
      '--radius': '14px',
      '--font': 'Inter',
    },
  },
  'light-blue': {
    id: 'light-blue',
    name: 'Light Blue',
    cssVars: {
      '--accent': '#2563eb',
      '--accent-glow': 'rgba(37,99,235,0.2)',
      '--accent-dim': 'rgba(37,99,235,0.06)',
      '--bg': '#ffffff',
      '--surface': 'rgba(248,250,255,0.8)',
      '--text': '#0f172a',
      '--text-muted': 'rgba(15,23,42,0.5)',
      '--text-dim': 'rgba(15,23,42,0.3)',
      '--card': '#f8fafc',
      '--card-text': '#0f172a',
      '--border': 'rgba(0,0,0,0.06)',
      '--border-strong': 'rgba(0,0,0,0.1)',
      '--radius': '16px',
      '--font': 'Inter',
    },
  },
}

/**
 * Resolve CSS custom property tokens from funnel settings.
 * Theme preset provides the baseline; per-field overrides (accentColor, bgColor,
 * textColor, font) override individual tokens when set to a non-empty value.
 */
export function resolveTokens(settings: {
  theme?: ThemeId
  accentColor?: string
  bgColor?: string
  textColor?: string
  font?: string
}): Record<string, string> {
  const preset = THEME_PRESETS[settings.theme ?? 'dark-green']
  const tokens = { ...preset.cssVars }

  if (settings.accentColor) {
    tokens['--accent'] = settings.accentColor
    // Derive glow from accent
    tokens['--accent-glow'] = hexToRgba(settings.accentColor, 0.28)
    tokens['--accent-dim'] = hexToRgba(settings.accentColor, 0.1)
  }
  if (settings.bgColor) tokens['--bg'] = settings.bgColor
  if (settings.textColor) tokens['--text'] = settings.textColor
  if (settings.font) tokens['--font'] = settings.font

  return tokens
}

/** Crude hex to rgba — handles 6-char hex only. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  if (h.length !== 6) return `rgba(0,0,0,${alpha})`
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/** CSS string to inject on a root element — `style` prop compatible. */
export function themeStyle(settings: Parameters<typeof resolveTokens>[0]): React.CSSProperties {
  const tokens = resolveTokens(settings)
  return tokens as unknown as React.CSSProperties
}
