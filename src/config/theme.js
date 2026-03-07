import { createTheme, alpha } from '@mui/material/styles';

/* ═══════════════════════════════════════════════════════════════════════════
   HMCS · "Velocity" Theme  —  ClickUp-Inspired
   ───────────────────────────────────────────────────────────────────────────
   Inspired by  : ClickUp — dark charcoal shell + cornflower violet accent
   Font         : Plus Jakarta Sans (modern, readable, character wala)
   Philosophy   : Dark sidebar shell + clean white content — confident hierarchy
   ───────────────────────────────────────────────────────────────────────────
   index.html mein add karo (body se pehle):
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
   ═══════════════════════════════════════════════════════════════════════════ */

const tk = {
  // ── Shell (sidebar + header) — ClickUp #292D34 inspired ────────────────
  shell:      '#22252d',   // main dark bg
  shellHov:   '#2c3039',   // hover state
  shellAct:   '#353a45',   // active/selected
  shellBrd:   'rgba(255,255,255,0.06)',  // subtle border

  // ── Content area ────────────────────────────────────────────────────────
  contentBg:  '#f5f6fa',   // off-white, easy on eyes
  cardBg:     '#ffffff',

  // ── Primary — Cornflower Violet (#7B68EE ClickUp inspired) ─────────────
  p600:  '#5b4fe0',
  p500:  '#7c6ff7',   // main accent
  p400:  '#9d94f9',
  p300:  '#c4bdfb',
  p100:  'rgba(124,111,247,0.10)',
  p50:   'rgba(124,111,247,0.05)',
  pGlow: 'rgba(124,111,247,0.28)',

  // ── ClickUp vibrant accent pops ─────────────────────────────────────────
  pink:    '#fd71af',   // hot pink — badges, highlights
  cyan:    '#49ccf9',   // malibu — info
  yellow:  '#ffc800',   // supernova — warning pop

  // ── Semantic ─────────────────────────────────────────────────────────────
  green:     '#22c55e',
  greenBg:   'rgba(34,197,94,0.09)',
  greenBrd:  'rgba(34,197,94,0.20)',
  amber:     '#f59e0b',
  amberBg:   'rgba(245,158,11,0.09)',
  amberBrd:  'rgba(245,158,11,0.20)',
  red:       '#ef4444',
  redBg:     'rgba(239,68,68,0.09)',
  redBrd:    'rgba(239,68,68,0.20)',
  blue:      '#3b82f6',
  blueBg:    'rgba(59,130,246,0.09)',
  blueBrd:   'rgba(59,130,246,0.20)',

  // ── Content text (light bg) ───────────────────────────────────────────
  t900: '#0f1117',
  t700: '#2b2f3e',
  t500: '#5c6070',
  t300: '#9ca0b0',
  t100: '#d4d7e3',

  // ── Shell text (dark bg) ──────────────────────────────────────────────
  st900: '#ffffff',
  st700: 'rgba(255,255,255,0.82)',
  st500: 'rgba(255,255,255,0.50)',
  st300: 'rgba(255,255,255,0.28)',

  // ── Borders (content area) ────────────────────────────────────────────
  b100: '#e9ebf4',
  b200: '#d4d7e8',
  bg2:  '#eef0f8',

  // ── Shadows ───────────────────────────────────────────────────────────
  s1:   '0 1px 3px rgba(15,17,23,0.05), 0 1px 2px rgba(15,17,23,0.04)',
  s2:   '0 2px 8px rgba(15,17,23,0.07), 0 1px 3px rgba(15,17,23,0.05)',
  s3:   '0 4px 16px rgba(15,17,23,0.09), 0 2px 6px rgba(15,17,23,0.05)',
  s4:   '0 8px 28px rgba(15,17,23,0.12), 0 3px 10px rgba(15,17,23,0.07)',
  s5:   '0 20px 48px rgba(15,17,23,0.20), 0 8px 16px rgba(15,17,23,0.10)',
  sBtn: '0 2px 8px rgba(124,111,247,0.32)',
  sBtnH:'0 4px 16px rgba(124,111,247,0.44)',
};

const font = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";

export const tokens = tk;

export const theme = createTheme({

  palette: {
    mode: 'light',
    background: { default: tk.contentBg, paper: tk.cardBg },
    primary:   { main: tk.p500, light: tk.p400, dark: tk.p600, contrastText: '#fff' },
    secondary: { main: tk.shell, light: tk.shellHov, dark: '#1a1d24', contrastText: '#fff' },
    success:   { main: tk.green, contrastText: '#fff' },
    warning:   { main: tk.amber, contrastText: '#fff' },
    error:     { main: tk.red,   contrastText: '#fff' },
    info:      { main: tk.blue,  contrastText: '#fff' },
    text:      { primary: tk.t900, secondary: tk.t500, disabled: tk.t100 },
    divider:   tk.b100,
    action: {
      hover:    alpha(tk.t900, 0.04),
      selected: alpha(tk.p500, 0.07),
    },
    custom: {
      // Shell tokens — sidebar/header mein use karo
      shell: tk.shell, shellHov: tk.shellHov, shellAct: tk.shellAct, shellBrd: tk.shellBrd,
      st900: tk.st900, st700: tk.st700, st500: tk.st500, st300: tk.st300,
      // Content tokens
      bg2: tk.bg2, b100: tk.b100, b200: tk.b200,
      p100: tk.p100, p50: tk.p50, pGlow: tk.pGlow,
      t900: tk.t900, t700: tk.t700, t500: tk.t500, t300: tk.t300, t100: tk.t100,
      // Semantic
      greenBg: tk.greenBg, greenBrd: tk.greenBrd,
      amberBg: tk.amberBg, amberBrd: tk.amberBrd,
      redBg:   tk.redBg,   redBrd:   tk.redBrd,
      blueBg:  tk.blueBg,  blueBrd:  tk.blueBrd,
      // Accents
      pink: tk.pink, cyan: tk.cyan, yellow: tk.yellow,
    },
    gradients: {
      primary: `linear-gradient(135deg, ${tk.p600} 0%, ${tk.p500} 100%)`,
      shell:   `linear-gradient(180deg, ${tk.shell} 0%, #1c1f27 100%)`,
    },
  },

  shadows: [
    'none', tk.s1, tk.s2, tk.s3, tk.s4, tk.s5,
    `0 0 0 3px ${tk.pGlow}`,
    `0 0 0 3px ${alpha(tk.green, 0.18)}`,
    `0 0 0 3px ${alpha(tk.red,   0.18)}`,
    tk.sBtn, tk.sBtnH,
    ...Array(14).fill('none'),
  ],

  typography: {
    fontFamily: font,
    h1: { fontFamily: font, fontWeight: 800, fontSize: '2rem',      letterSpacing: '-0.8px' },
    h2: { fontFamily: font, fontWeight: 700, fontSize: '1.5rem',    letterSpacing: '-0.5px' },
    h3: { fontFamily: font, fontWeight: 700, fontSize: '1.25rem',   letterSpacing: '-0.3px' },
    h4: { fontFamily: font, fontWeight: 600, fontSize: '1.0625rem', letterSpacing: '-0.2px' },
    h5: { fontFamily: font, fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.1px' },
    h6: { fontFamily: font, fontWeight: 600, fontSize: '0.875rem',  letterSpacing: '-0.1px' },
    subtitle1: { fontFamily: font, fontWeight: 500, fontSize: '0.9375rem' },
    subtitle2: { fontFamily: font, fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: tk.t300 },
    body1:   { fontFamily: font, fontWeight: 400, fontSize: '0.875rem',  lineHeight: 1.6,  color: tk.t700 },
    body2:   { fontFamily: font, fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.55, color: tk.t500 },
    caption: { fontFamily: font, fontWeight: 400, fontSize: '0.75rem',   color: tk.t300 },
    button:  { fontFamily: font, fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em', textTransform: 'none' },
    overline:{ fontFamily: font, fontWeight: 700, fontSize: '0.625rem',  letterSpacing: '0.10em',  textTransform: 'uppercase' },
  },

  shape: { borderRadius: 8 },

  components: {

    MuiCssBaseline: {
      styleOverrides: `
        * { box-sizing: border-box; }
        body { background: ${tk.contentBg}; font-family: ${font}; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${tk.b200}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${tk.t300}; }
        ::selection { background: ${tk.p100}; color: ${tk.p500}; }
      `,
    },

    // ── AppBar ─────────────────────────────────────────────────────────────
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'secondary' },
      styleOverrides: {
        root: {
          // Sirf structural — koi background nahi yahan
        },
        // color="secondary" → dark shell (default — ClickUp style)
        colorSecondary: {
          background: tk.shell,
          borderBottom: `1px solid ${tk.shellBrd}`,
          color: tk.st900,
          boxShadow: 'none',
          '& .MuiIconButton-root': {
            color: tk.st500,
            border: `1px solid ${tk.shellBrd}`,
            borderRadius: 8,
            '&:hover': { background: tk.shellHov, borderColor: 'rgba(255,255,255,0.10)', color: tk.st900 },
          },
          '& .MuiTypography-root': { color: tk.st700 },
          '& .MuiBadge-badge': { border: `1.5px solid ${tk.shell}` },
        },
        // color="primary" → violet gradient
        colorPrimary: {
          background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
          borderBottom: `1px solid rgba(255,255,255,0.10)`,
          color: '#ffffff',
          boxShadow: `0 2px 16px ${tk.pGlow}`,
          '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.75)' },
          '& .MuiTypography-root': { color: '#ffffff' },
          '& .MuiBadge-badge': { border: `1.5px solid ${tk.p600}` },
        },
        // color="default" → frosted white
        colorDefault: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${tk.b100}`,
          color: tk.t900,
          '& .MuiIconButton-root': { color: tk.t500 },
        },
      },
    },

    MuiToolbar: {
      defaultProps: { variant: 'dense' },
      styleOverrides: { root: { minHeight: '52px !important', padding: '0 16px' } },
    },

    // ── Drawer ─────────────────────────────────────────────────────────────
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: tk.shell,
          borderRight: `1px solid ${tk.shellBrd}`,
          boxShadow: `4px 0 24px rgba(0,0,0,0.35)`,
          color: tk.st700,
        },
      },
    },

    // ── Paper ──────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: `1px solid ${tk.b100}` },
        elevation1: { boxShadow: tk.s1 },
        elevation2: { boxShadow: tk.s2 },
        elevation3: { boxShadow: tk.s3 },
        elevation4: { boxShadow: tk.s4 },
        elevation8: { boxShadow: tk.s5 },
      },
    },

    // ── Card ───────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${tk.b100}`,
          boxShadow: tk.s1,
          borderRadius: 10,
          transition: 'box-shadow 0.18s, border-color 0.18s',
          '&:hover': { borderColor: tk.b200, boxShadow: tk.s3 },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: { padding: '14px 18px', borderBottom: `1px solid ${tk.b100}` },
        title: { fontFamily: font, fontWeight: 700, fontSize: '0.9375rem' },
        subheader: { fontFamily: font, fontSize: '0.75rem', color: tk.t500 },
      },
    },

    MuiCardContent: {
      styleOverrides: { root: { padding: '16px 18px', '&:last-child': { paddingBottom: 16 } } },
    },

    // ── Button ─────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontFamily: font, fontWeight: 600, borderRadius: 8,
          textTransform: 'none', transition: 'all 0.15s', letterSpacing: '0.01em',
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
          boxShadow: tk.sBtn,
          '&:hover': {
            background: `linear-gradient(135deg, ${tk.p600}, ${tk.p600})`,
            boxShadow: tk.sBtnH,
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: tk.shell,
          '&:hover': { background: tk.shellHov },
        },
        outlined: {
          borderColor: tk.b200, color: tk.t700,
          '&:hover': { borderColor: tk.p500, color: tk.p500, background: tk.p50 },
        },
        outlinedPrimary: {
          borderColor: tk.p300, color: tk.p500,
          '&:hover': { background: tk.p50, borderColor: tk.p500 },
        },
        text: { color: tk.t500, '&:hover': { background: alpha(tk.t900, 0.04) } },
        textPrimary: { color: tk.p500, '&:hover': { background: tk.p50 } },
        sizeLarge:  { padding: '9px 22px',  fontSize: '0.9375rem' },
        sizeMedium: { padding: '7px 16px',  fontSize: '0.8125rem' },
        sizeSmall:  { padding: '4px 12px',  fontSize: '0.75rem'   },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s',
          '&:hover': { background: alpha(tk.t900, 0.05) },
        },
      },
    },

    // ── Input ──────────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8, fontFamily: font, fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: tk.b200, transition: 'all 0.15s' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tk.t300 },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tk.p500, borderWidth: '1.5px',
            boxShadow: `0 0 0 3px ${tk.p100}`,
          },
        },
        input: { padding: '8px 12px' },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: font, fontSize: '0.875rem', color: tk.t500,
          '&.Mui-focused': { color: tk.p500 },
        },
      },
    },

    // ── Table ──────────────────────────────────────────────────────────────
    MuiTable: {
      defaultProps: { size: 'small' },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: tk.contentBg, color: tk.t300,
            fontFamily: font, fontWeight: 700,
            fontSize: '0.6875rem', letterSpacing: '0.07em', textTransform: 'uppercase',
            borderBottom: `1px solid ${tk.b200}`, padding: '10px 14px',
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background 0.12s',
          '&:nth-of-type(even)': { background: '#fafbfd' },
          '&:hover': { background: tk.p50 },
          '&:last-child td': { border: 0 },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: font, fontSize: '0.8125rem', color: tk.t700,
          borderBottom: `1px solid ${tk.b100}`, padding: '10px 14px',
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: font, fontWeight: 600, fontSize: '0.6875rem',
          height: 22, borderRadius: 6,
        },
        colorSuccess: { background: tk.greenBg, color: tk.green, border: `1px solid ${tk.greenBrd}` },
        colorWarning: { background: tk.amberBg, color: tk.amber, border: `1px solid ${tk.amberBrd}` },
        colorError:   { background: tk.redBg,   color: tk.red,   border: `1px solid ${tk.redBrd}`   },
        colorPrimary: { background: tk.p100,    color: tk.p500,  border: `1px solid rgba(124,111,247,0.25)` },
        colorInfo:    { background: tk.blueBg,  color: tk.blue,  border: `1px solid ${tk.blueBrd}`  },
      },
    },

    // ── Badge ──────────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontFamily: font, fontWeight: 700, fontSize: 9,
          minWidth: 16, height: 16, padding: '0 4px',
        },
        colorError: { background: tk.pink }, // ClickUp Hot Pink
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${tk.b100}`, minHeight: 42 },
        indicator: {
          height: 2, borderRadius: '2px 2px 0 0',
          background: `linear-gradient(90deg, ${tk.p600}, ${tk.p400})`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: font, fontWeight: 500, fontSize: '0.8125rem',
          textTransform: 'none', minHeight: 42, padding: '0 14px', color: tk.t500,
          '&.Mui-selected': { color: tk.p500, fontWeight: 700 },
        },
      },
    },

    // ── Switch ─────────────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        track: {
          background: tk.b200, borderRadius: 12,
          opacity: '1 !important', transition: 'background 0.2s',
        },
        thumb: { background: '#fff', boxShadow: tk.s1 },
        switchBase: {
          '&.Mui-checked + .MuiSwitch-track': {
            background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
            opacity: '1 !important',
          },
        },
      },
    },

    // ── Dialog ─────────────────────────────────────────────────────────────
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, boxShadow: tk.s5, border: `1px solid ${tk.b100}` },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: font, fontWeight: 700, fontSize: '1rem',
          padding: '16px 22px', borderBottom: `1px solid ${tk.b100}`,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: { root: { padding: '18px 22px' } },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: { padding: '12px 22px', borderTop: `1px solid ${tk.b100}`, gap: 8 },
      },
    },

    // ── Menu ───────────────────────────────────────────────────────────────
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 10, boxShadow: tk.s4, border: `1px solid ${tk.b100}`, padding: '4px 0' },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: font, fontSize: '0.8125rem', color: tk.t700,
          padding: '7px 14px', margin: '1px 6px', borderRadius: 6,
          '&:hover': { background: tk.p50, color: tk.p500 },
          '&.Mui-selected': { background: tk.p100, color: tk.p500, fontWeight: 600 },
        },
      },
    },

    // ── Tooltip ────────────────────────────────────────────────────────────
    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 300 },
      styleOverrides: {
        tooltip: {
          fontFamily: font, fontSize: '0.6875rem', fontWeight: 500,
          background: tk.shell, color: tk.st700,
          borderRadius: 6, padding: '5px 10px', boxShadow: tk.s3,
        },
        arrow: { color: tk.shell },
      },
    },

    // ── Alert ──────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { fontFamily: font, fontSize: '0.8125rem', borderRadius: 8, border: '1px solid' },
        standardSuccess: { background: tk.greenBg, color: tk.green, borderColor: tk.greenBrd },
        standardWarning: { background: tk.amberBg, color: tk.amber, borderColor: tk.amberBrd },
        standardError:   { background: tk.redBg,   color: tk.red,   borderColor: tk.redBrd   },
        standardInfo:    { background: tk.blueBg,  color: tk.blue,  borderColor: tk.blueBrd  },
      },
    },

    // ── Pagination ─────────────────────────────────────────────────────────
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily: font, fontWeight: 600, color: tk.t500, borderRadius: 7,
          '&.Mui-selected': {
            background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
            color: '#fff', boxShadow: tk.sBtn,
          },
        },
      },
    },

    // ── Autocomplete ────────────────────────────────────────────────────────
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: 10, boxShadow: tk.s4, border: `1px solid ${tk.b100}` },
        option: {
          fontFamily: font, fontSize: '0.8125rem', borderRadius: 6, margin: '1px 6px',
          '&[aria-selected="true"]': { background: `${tk.p100} !important`, color: tk.p500 },
          '&.Mui-focused': { background: tk.p50 },
        },
      },
    },

    // ── Linear Progress ────────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 4, borderRadius: 4, background: tk.b100 },
        bar: { borderRadius: 4, background: `linear-gradient(90deg, ${tk.p600}, ${tk.p400})` },
      },
    },

    // ── Checkbox ───────────────────────────────────────────────────────────
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: tk.b200,
          '&.Mui-checked': { color: tk.p500 },
          '&:hover': { background: tk.p50 },
        },
      },
    },

    // ── Divider ────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: { root: { borderColor: tk.b100 } },
    },

    // ── List (sidebar nav) ─────────────────────────────────────────────────
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontFamily: font, borderRadius: 8,
          margin: '1px 8px', padding: '7px 10px',
          color: tk.st500, transition: 'all 0.13s',
          '&:hover': { background: tk.shellHov, color: tk.st700 },
          '&.Mui-selected': {
            background: tk.shellAct, color: tk.p400, fontWeight: 600,
            '&:hover': { background: tk.shellAct },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 34, color: 'inherit', '& svg': { fontSize: 18 } },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: { fontFamily: font, fontSize: '0.8125rem', fontWeight: 500 },
      },
    },

    // ── Select ─────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: { icon: { color: tk.t300 } },
    },
  },
});

export default theme;