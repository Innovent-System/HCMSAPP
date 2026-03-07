// HCMS Theme Color Palettes
// Choose the palette that best fits your brand

export const colorPalettes = {
  // ═══════════════════════════════════════════════════════════════════════════
  // Velocity Theme — ClickUp Inspired (Light Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  velocity: {
    name: 'Velocity',
    description: 'ClickUp Inspired • Light Mode • Dark Shell + White Content',
    mode: 'light' as const,
    primary: {
      main: '#7c6ff7',    // Cornflower Violet
      light: '#9d94f9',
      dark: '#5b4fe0',
    },
    secondary: {
      main: '#22252d',    // Shell dark
      light: '#2c3039',
      dark: '#1a1d24',
    },
    accent: {
      pink: '#fd71af',    // Hot pink badges
      cyan: '#49ccf9',    // Info
      yellow: '#ffc800',  // Warning pop
      gold: '#f59e0b',
      rose: '#ef4444',
      violet: '#7c6ff7',
    },
    background: {
      default: '#f5f6fa', // Content area - off-white
      paper: '#ffffff',   // Cards
      elevated: '#ffffff',
      shell: '#22252d',   // Sidebar/Shell dark
      shellHov: '#2c3039',
      shellAct: '#353a45',
    },
    text: {
      primary: '#0f1117',
      secondary: '#5c6070',
      disabled: '#9ca0b0',
      shellPrimary: '#ffffff',
      shellSecondary: 'rgba(255,255,255,0.50)',
    },
    border: {
      light: '#e9ebf4',
      medium: '#d4d7e8',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#22c55e',
      greenBg: 'rgba(34,197,94,0.09)',
      greenBrd: 'rgba(34,197,94,0.20)',
      amber: '#f59e0b',
      amberBg: 'rgba(245,158,11,0.09)',
      amberBrd: 'rgba(245,158,11,0.20)',
      red: '#ef4444',
      redBg: 'rgba(239,68,68,0.09)',
      redBrd: 'rgba(239,68,68,0.20)',
      blue: '#3b82f6',
      blueBg: 'rgba(59,130,246,0.09)',
      blueBrd: 'rgba(59,130,246,0.20)',
    },
    shadows: {
      s1: '0 1px 3px rgba(15,17,23,0.05), 0 1px 2px rgba(15,17,23,0.04)',
      s2: '0 2px 8px rgba(15,17,23,0.07), 0 1px 3px rgba(15,17,23,0.05)',
      s3: '0 4px 16px rgba(15,17,23,0.09), 0 2px 6px rgba(15,17,23,0.05)',
      s4: '0 8px 28px rgba(15,17,23,0.12), 0 3px 10px rgba(15,17,23,0.07)',
      s5: '0 20px 48px rgba(15,17,23,0.20), 0 8px 16px rgba(15,17,23,0.10)',
      btn: '0 2px 8px rgba(124,111,247,0.32)',
      btnHover: '0 4px 16px rgba(124,111,247,0.44)',
      glow: 'rgba(124,111,247,0.28)',
    },
    font: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Ocean Blue Theme — Professional & Trust (Dark Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  oceanBlue: {
    name: 'Ocean Blue',
    description: 'Professional, Trust, Stability — Best for Enterprise',
    mode: 'dark' as const,
    primary: {
      main: '#0A4D8C',
      light: '#1E6FBA',
      dark: '#063259',
    },
    secondary: {
      main: '#00A67D',
      light: '#00D9A5',
      dark: '#007A5C',
    },
    accent: {
      gold: '#D4A843',
      rose: '#E85A7C',
      violet: '#7C5CDB',
      pink: '#E85A7C',
      cyan: '#00D9A5',
      yellow: '#D4A843',
    },
    background: {
      default: '#0F1419',
      paper: '#161B22',
      elevated: '#1C2128',
      shell: '#0F1419',
      shellHov: '#161B22',
      shellAct: '#1C2128',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
      shellPrimary: '#F0F6FC',
      shellSecondary: '#8B949E',
    },
    border: {
      light: '#30363D',
      medium: '#21262D',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#00A67D',
      greenBg: 'rgba(0,166,125,0.15)',
      greenBrd: 'rgba(0,166,125,0.30)',
      amber: '#D4A843',
      amberBg: 'rgba(212,168,67,0.15)',
      amberBrd: 'rgba(212,168,67,0.30)',
      red: '#F85149',
      redBg: 'rgba(248,81,73,0.15)',
      redBrd: 'rgba(248,81,73,0.30)',
      blue: '#58A6FF',
      blueBg: 'rgba(88,166,255,0.15)',
      blueBrd: 'rgba(88,166,255,0.30)',
    },
    shadows: {
      s1: '0 1px 2px rgba(0,0,0,0.1)',
      s2: '0 2px 8px rgba(0,0,0,0.15)',
      s3: '0 4px 12px rgba(0,0,0,0.2)',
      s4: '0 8px 24px rgba(0,0,0,0.3)',
      s5: '0 16px 48px rgba(0,0,0,0.4)',
      btn: '0 4px 12px rgba(10,77,140,0.3)',
      btnHover: '0 6px 20px rgba(10,77,140,0.4)',
      glow: 'rgba(10,77,140,0.4)',
    },
    font: "'Inter', 'SF Pro Display', sans-serif",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Royal Purple Theme — Modern & Creative (Dark Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  royalPurple: {
    name: 'Royal Purple',
    description: 'Creative, Modern, Innovation — Best for Tech Startups',
    mode: 'dark' as const,
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
    },
    accent: {
      gold: '#F59E0B',
      rose: '#EF4444',
      violet: '#8B5CF6',
      pink: '#EC4899',
      cyan: '#22D3EE',
      yellow: '#F59E0B',
    },
    background: {
      default: '#0C0A14',
      paper: '#13111C',
      elevated: '#1A1824',
      shell: '#0C0A14',
      shellHov: '#13111C',
      shellAct: '#1A1824',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
      shellPrimary: '#F0F6FC',
      shellSecondary: '#8B949E',
    },
    border: {
      light: '#2D2B3B',
      medium: '#1E1C2A',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#10B981',
      greenBg: 'rgba(16,185,129,0.15)',
      greenBrd: 'rgba(16,185,129,0.30)',
      amber: '#F59E0B',
      amberBg: 'rgba(245,158,11,0.15)',
      amberBrd: 'rgba(245,158,11,0.30)',
      red: '#EF4444',
      redBg: 'rgba(239,68,68,0.15)',
      redBrd: 'rgba(239,68,68,0.30)',
      blue: '#3B82F6',
      blueBg: 'rgba(59,130,246,0.15)',
      blueBrd: 'rgba(59,130,246,0.30)',
    },
    shadows: {
      s1: '0 1px 2px rgba(0,0,0,0.1)',
      s2: '0 2px 8px rgba(0,0,0,0.15)',
      s3: '0 4px 12px rgba(0,0,0,0.2)',
      s4: '0 8px 24px rgba(0,0,0,0.3)',
      s5: '0 16px 48px rgba(0,0,0,0.4)',
      btn: '0 4px 12px rgba(99,102,241,0.3)',
      btnHover: '0 6px 20px rgba(99,102,241,0.4)',
      glow: 'rgba(99,102,241,0.4)',
    },
    font: "'Inter', 'SF Pro Display', sans-serif",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Emerald Forest Theme — Natural & Fresh (Dark Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  emeraldForest: {
    name: 'Emerald Forest',
    description: 'Growth, Nature, Fresh — Best for HR & Wellness',
    mode: 'dark' as const,
    primary: {
      main: '#059669',
      light: '#10B981',
      dark: '#047857',
    },
    secondary: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    accent: {
      gold: '#EAB308',
      rose: '#F43F5E',
      violet: '#A855F7',
      pink: '#F43F5E',
      cyan: '#38BDF8',
      yellow: '#EAB308',
    },
    background: {
      default: '#0A0F0D',
      paper: '#111916',
      elevated: '#182420',
      shell: '#0A0F0D',
      shellHov: '#111916',
      shellAct: '#182420',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
      shellPrimary: '#F0F6FC',
      shellSecondary: '#8B949E',
    },
    border: {
      light: '#1E2D25',
      medium: '#152018',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#10B981',
      greenBg: 'rgba(16,185,129,0.15)',
      greenBrd: 'rgba(16,185,129,0.30)',
      amber: '#EAB308',
      amberBg: 'rgba(234,179,8,0.15)',
      amberBrd: 'rgba(234,179,8,0.30)',
      red: '#F43F5E',
      redBg: 'rgba(244,63,94,0.15)',
      redBrd: 'rgba(244,63,94,0.30)',
      blue: '#0EA5E9',
      blueBg: 'rgba(14,165,233,0.15)',
      blueBrd: 'rgba(14,165,233,0.30)',
    },
    shadows: {
      s1: '0 1px 2px rgba(0,0,0,0.1)',
      s2: '0 2px 8px rgba(0,0,0,0.15)',
      s3: '0 4px 12px rgba(0,0,0,0.2)',
      s4: '0 8px 24px rgba(0,0,0,0.3)',
      s5: '0 16px 48px rgba(0,0,0,0.4)',
      btn: '0 4px 12px rgba(5,150,105,0.3)',
      btnHover: '0 6px 20px rgba(5,150,105,0.4)',
      glow: 'rgba(5,150,105,0.4)',
    },
    font: "'Inter', 'SF Pro Display', sans-serif",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Sunset Orange Theme — Energetic & Bold (Dark Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  sunsetOrange: {
    name: 'Sunset Orange',
    description: 'Energy, Passion, Bold — Best for Dynamic Teams',
    mode: 'dark' as const,
    primary: {
      main: '#EA580C',
      light: '#F97316',
      dark: '#C2410C',
    },
    secondary: {
      main: '#0891B2',
      light: '#22D3EE',
      dark: '#0E7490',
    },
    accent: {
      gold: '#FBBF24',
      rose: '#E11D48',
      violet: '#7C3AED',
      pink: '#E11D48',
      cyan: '#22D3EE',
      yellow: '#FBBF24',
    },
    background: {
      default: '#0F0A0A',
      paper: '#171010',
      elevated: '#1F1714',
      shell: '#0F0A0A',
      shellHov: '#171010',
      shellAct: '#1F1714',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
      shellPrimary: '#F0F6FC',
      shellSecondary: '#8B949E',
    },
    border: {
      light: '#2D1F1F',
      medium: '#1F1515',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#22C55E',
      greenBg: 'rgba(34,197,94,0.15)',
      greenBrd: 'rgba(34,197,94,0.30)',
      amber: '#FBBF24',
      amberBg: 'rgba(251,191,36,0.15)',
      amberBrd: 'rgba(251,191,36,0.30)',
      red: '#E11D48',
      redBg: 'rgba(225,29,72,0.15)',
      redBrd: 'rgba(225,29,72,0.30)',
      blue: '#0891B2',
      blueBg: 'rgba(8,145,178,0.15)',
      blueBrd: 'rgba(8,145,178,0.30)',
    },
    shadows: {
      s1: '0 1px 2px rgba(0,0,0,0.1)',
      s2: '0 2px 8px rgba(0,0,0,0.15)',
      s3: '0 4px 12px rgba(0,0,0,0.2)',
      s4: '0 8px 24px rgba(0,0,0,0.3)',
      s5: '0 16px 48px rgba(0,0,0,0.4)',
      btn: '0 4px 12px rgba(234,88,12,0.3)',
      btnHover: '0 6px 20px rgba(234,88,12,0.4)',
      glow: 'rgba(234,88,12,0.4)',
    },
    font: "'Inter', 'SF Pro Display', sans-serif",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Cyber Neon Theme — Futuristic & Tech (Dark Mode)
  // ═══════════════════════════════════════════════════════════════════════════
  cyberNeon: {
    name: 'Cyber Neon',
    description: 'Futuristic, Tech-Forward, Bold — Best for Tech Companies',
    mode: 'dark' as const,
    primary: {
      main: '#00D9FF',
      light: '#5CE1FF',
      dark: '#00B8D9',
    },
    secondary: {
      main: '#FF00E5',
      light: '#FF4DFF',
      dark: '#CC00B8',
    },
    accent: {
      gold: '#FFD600',
      rose: '#FF3D71',
      violet: '#B266FF',
      pink: '#FF00E5',
      cyan: '#00D9FF',
      yellow: '#FFD600',
    },
    background: {
      default: '#000000',
      paper: '#0A0A0A',
      elevated: '#141414',
      shell: '#000000',
      shellHov: '#0A0A0A',
      shellAct: '#141414',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
      disabled: '#484F58',
      shellPrimary: '#F0F6FC',
      shellSecondary: '#8B949E',
    },
    border: {
      light: '#1F1F1F',
      medium: '#141414',
      shell: 'rgba(255,255,255,0.06)',
    },
    semantic: {
      green: '#00D9A5',
      greenBg: 'rgba(0,217,165,0.15)',
      greenBrd: 'rgba(0,217,165,0.30)',
      amber: '#FFD600',
      amberBg: 'rgba(255,214,0,0.15)',
      amberBrd: 'rgba(255,214,0,0.30)',
      red: '#FF3D71',
      redBg: 'rgba(255,61,113,0.15)',
      redBrd: 'rgba(255,61,113,0.30)',
      blue: '#00D9FF',
      blueBg: 'rgba(0,217,255,0.15)',
      blueBrd: 'rgba(0,217,255,0.30)',
    },
    shadows: {
      s1: '0 1px 2px rgba(0,0,0,0.3)',
      s2: '0 2px 8px rgba(0,0,0,0.4)',
      s3: '0 4px 12px rgba(0,0,0,0.5)',
      s4: '0 8px 24px rgba(0,0,0,0.6)',
      s5: '0 16px 48px rgba(0,0,0,0.7)',
      btn: '0 4px 12px rgba(0,217,255,0.3)',
      btnHover: '0 6px 20px rgba(0,217,255,0.4)',
      glow: 'rgba(0,217,255,0.4)',
    },
    font: "'Inter', 'SF Pro Display', sans-serif",
  },
};

export type PaletteKey = keyof typeof colorPalettes;