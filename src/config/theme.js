import { createTheme, alpha } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#00a8e8',
      contrastText: '#fff',
    },
    secondary: {
      main: '#45484d',
      contrastText: '#fff',
    },
    gradients: {
      primary: 'linear-gradient(135deg, rgb(129, 251, 184) 10%, rgb(40, 199, 111) 100%)',
      secondary: 'linear-gradient(to bottom, #45484d 0%,#000000 100%)'
    }
  },

  typography: {
    fontSize: 13,
    fontFamily: ['"omnes-pro"', '"Segoe UI"', 'sans-serif'].join(','),
  },

  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: 1,
          '&.anchor-link': {
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none'
            }
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          '&[data-round="true"]': {
            minWidth: 150,
            borderRadius: 25
          }
        },
      },
    },
    MuiFilledInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF'
          },
          '& .MuiFormHelperText-sizeMedium': {
            fontSize: '1rem',
            marginLeft: 0,
          }
        },
      },
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiListItem: {
      defaultProps: {
        dense: true,
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'dense',
      },
    }

  },
});



/* ═══════════════════════════════════════════════════════════════════════════
   HMCS — Base Theme  (Velocity · ClickUp-Inspired)
   ───────────────────────────────────────────────────────────────────────────
   ARCHITECTURE:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │  theme.js  →  Global defaults + Design tokens                           │
   │      ↓                                                                  │
   │  sx prop   →  Page / component specific one-off overrides               │
   │      ↓                                                                  │
   │  styled()  →  Reusable styled components (HeaderBar, NavIconBtn etc.)   │
   └─────────────────────────────────────────────────────────────────────────┘

   FONT:  omnes-pro (existing) — kept as-is
   OVERRIDE GUIDE:
     • Ek page mein alag color chahiye?  → sx={{ bgcolor: 'primary.main' }}
     • Reusable styled component?        → styled(Paper)(({ theme }) => ...)
     • Global component behavior?        → theme.components mein add karo
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Design Tokens — Import karo jahan bhi raw values chahiye ───────────────
export const tk = {

  // ── Shell (Sidebar + Header) — Deep Teal + Navy ─────────────────────────
  shell: '#13293D',                          // navy sidebar bg (was #17212B)
  shellHov: '#1C3B54',                       // hover row
  shellAct: '#12805F',                       // active row fill (solid teal)
  shellBrd: 'rgba(255,255,255,0.08)',        // unchanged
  shellText: '#9FE1CB',                      // muted teal-tinted label (was #E5E7EB)

  // ── Primary — Teal ───────────────────────────────────────────────────────
  p600: '#085041',
  p500: '#0F6E56',
  p400: '#1D9E75',
  p300: '#5DCAA5',
  p100: 'rgba(15,110,86,0.10)',
  p50: 'rgba(15,110,86,0.05)',
  pGlow: 'rgba(15,110,86,0.28)',

  // ── Content Area ────────────────────────────────────────────────────────
  contentBg: '#F7F9FB',
  cardBg: '#FFFFFF',
  bg2: '#eef0f8',

  // ── Semantic ─────────────────────────────────────────────────────────────
  green: '#10B981', greenBg: 'rgba(34,197,94,0.09)', greenBrd: 'rgba(34,197,94,0.22)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.09)', amberBrd: 'rgba(245,158,11,0.22)',
  red: '#EF4444', redBg: 'rgba(239,68,68,0.09)', redBrd: 'rgba(239,68,68,0.22)',
  blue: '#3B82F6', blueBg: 'rgba(59,130,246,0.09)', blueBrd: 'rgba(59,130,246,0.22)',
  pink: '#fd71af',  // ClickUp Hot Pink — badges

  // ── Content Text ─────────────────────────────────────────────────────────
  t900: '#17212B',
  t700: '#E5E7EB',
  t500: '#64748B',
  // t300: '#9ca0b0',
  t300: '#17212B',
  t100: '#94A3B8',

  // ── Borders ──────────────────────────────────────────────────────────────
  b100: '#E2E8F0',
  b200: '#d4d7e8',

  // ── Shadows ──────────────────────────────────────────────────────────────
  s1: '0 1px 3px rgba(15,17,23,0.05), 0 1px 2px rgba(15,17,23,0.04)',
  s2: '0 2px 8px rgba(15,17,23,0.07), 0 1px 3px rgba(15,17,23,0.05)',
  s3: '0 4px 16px rgba(15,17,23,0.09), 0 2px 6px rgba(15,17,23,0.05)',
  s4: '0 8px 28px rgba(15,17,23,0.12), 0 3px 10px rgba(15,17,23,0.07)',
  s5: '0 20px 48px rgba(15,17,23,0.20), 0 8px 16px rgba(15,17,23,0.10)',
  sBtn: '0 2px 8px rgba(124,111,247,0.32)',
  sBtnH: '0 4px 16px rgba(124,111,247,0.44)',
};

const font = ['"omnes-pro"', '"Segoe UI"', 'sans-serif'].join(',');

// ─── Theme ───────────────────────────────────────────────────────────────────
export const theme1 = createTheme({

  // ── Palette ──────────────────────────────────────────────────────────────
  palette: {
    mode: 'light',

    background: {
      default: tk.contentBg,
      paper: tk.cardBg,
    },

    primary: {
      main: tk.p500,
      light: tk.p400,
      dark: tk.p600,
      contrastText: '#fff',
    },

    // secondary = shell color — AppBar color="secondary" → dark charcoal
    secondary: {
      main: tk.shell,
      light: tk.shellHov,
      dark: '#1a1d24',
      contrastText: '#ffffff',
    },

    sidebar: {
      background: '#17212B',
      surface: '#1F2D38',
      hover: '#263743',

      text: '#E5E7EB',
      textMuted: '#94A3B8',

      active: '#0F9D8A',
      activeSoft: 'rgba(15, 157, 138, 0.14)',

      divider: 'rgba(255,255,255,0.08)',
    },

    success: { main: tk.green, contrastText: '#fff' },
    warning: { main: tk.amber, contrastText: '#fff' },
    error: { main: tk.red, contrastText: '#fff' },
    info: { main: tk.blue, contrastText: '#fff' },

    text: {
      primary: tk.t900,
      secondary: tk.t500,
      disabled: tk.t100,
    },

    divider: tk.b100,

    action: {
      hover: alpha(tk.p500, 0.05),
      selected: alpha(tk.p500, 0.08),
    },

    // Custom tokens — theme.palette.custom.xxx se access karo
    custom: {
      // Shell
      shell: tk.shell, shellHov: tk.shellHov, shellAct: tk.shellAct,
      shellBrd: tk.shellBrd, shellText: tk.shellText,
      // Content
      contentBg: tk.contentBg, bg2: tk.bg2,
      b100: tk.b100, b200: tk.b200,
      // Primary tints
      p100: tk.p100, p50: tk.p50, pGlow: tk.pGlow,
      // Text
      t900: tk.t900, t700: tk.t700, t500: tk.t500, t300: tk.t300, t100: tk.t100,
      // Semantic
      greenBg: tk.greenBg, greenBrd: tk.greenBrd,
      amberBg: tk.amberBg, amberBrd: tk.amberBrd,
      redBg: tk.redBg, redBrd: tk.redBrd,
      blueBg: tk.blueBg, blueBrd: tk.blueBrd,
      // Accents
      pink: tk.pink,
    },

    // Gradients — theme.palette.gradients.xxx
    gradients: {
      primary: `linear-gradient(135deg, ${tk.p600} 0%, ${tk.p500} 100%)`,
      shell: `linear-gradient(180deg, ${tk.shell} 0%, #1c1f27 100%)`,
      // Legacy gradients (backward compat)
      secondary: `linear-gradient(to bottom, ${tk.shell} 0%, #000000 100%)`,
    },
  },

  // ── Shadows — MUI requires exactly 25 (index 0–24) ───────────────────────
  shadows: [
    'none',          // 0
    tk.s1,           // 1
    tk.s2,           // 2
    tk.s3,           // 3
    tk.s4,           // 4
    tk.s5,           // 5
    `0 0 0 3px ${tk.pGlow}`,                    // 6 — primary focus ring
    `0 0 0 3px ${alpha(tk.green, 0.20)}`,       // 7 — success focus
    `0 0 0 3px ${alpha(tk.red, 0.20)}`,       // 8 — error focus
    tk.sBtn,         // 9  — button shadow
    tk.sBtnH,        // 10 — button hover shadow
    ...Array(14).fill('none'),                   // 11–24 — MUI internals
  ],

  // ── Typography — omnes-pro (existing font preserved) ─────────────────────
  typography: {
    fontFamily: font,
    fontSize: 13,

    h1: { fontFamily: font, fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.5px' },
    h2: { fontFamily: font, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.4px' },
    h3: { fontFamily: font, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.3px' },
    h4: { fontFamily: font, fontWeight: 600, fontSize: '1.0625rem', letterSpacing: '-0.2px' },
    h5: { fontFamily: font, fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.1px' },
    h6: { fontFamily: font, fontWeight: 600, fontSize: '0.875rem' },

    subtitle1: { fontFamily: font, fontWeight: 500, fontSize: '0.9375rem' },
    subtitle2: { fontFamily: font, fontWeight: 700, fontSize: '0.6875rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: tk.t300 },

    body1: { fontFamily: font, fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.6, color: tk.t900 },
    body2: { fontFamily: font, fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.55, color: tk.t500 },

    caption: { fontFamily: font, fontWeight: 400, fontSize: '0.75rem', color: tk.t300 },
    overline: { fontFamily: font, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.10em', textTransform: 'uppercase' },
    button: { fontFamily: font, fontWeight: 600, fontSize: '0.8125rem', letterSpacing: '0.01em', textTransform: 'none' },
  },

  // ── Shape ────────────────────────────────────────────────────────────────
  shape: { borderRadius: 8 },

  // ── Component Overrides ───────────────────────────────────────────────────
  // RULE: Yahan sirf GLOBAL defaults rakhein.
  // Page-specific overrides → sx prop ya styled() use karo.
  components: {

    // ── Global CSS ─────────────────────────────────────────────────────────
    MuiCssBaseline: {
      styleOverrides: `
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: ${tk.contentBg};
          font-family: ${font};
          -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${tk.b200}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${tk.t300}; }
        ::selection { background: ${tk.p100}; color: ${tk.p500}; }
      `,
    },

    // ── AppBar ─────────────────────────────────────────────────────────────
    // color="secondary" → dark charcoal shell  (default)
    // color="primary"   → violet gradient
    // color="default"   → frosted white
    // className override karo specific pages pe
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'secondary' },
      styleOverrides: {
        root: {
          // Shared structural only — background yahan nahi
          transition: 'box-shadow 0.2s',
        },
        colorSecondary: {
          background: tk.shell,
          borderBottom: `1px solid ${tk.shellBrd}`,
          color: '#ffffff',
          '& .MuiIconButton-root': {
            color: 'rgba(255,255,255,0.70)',
            '&:hover': { background: tk.shellHov, color: '#fff' },
          },
          '& .MuiBadge-badge': { border: `1.5px solid ${tk.shell}` },
        },
        colorPrimary: {
          background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
          borderBottom: `1px solid rgba(255,255,255,0.10)`,
          color: '#ffffff',
          boxShadow: `0 2px 16px ${tk.pGlow}`,
          '& .MuiIconButton-root': { color: 'rgba(255,255,255,0.75)' },
          '& .MuiBadge-badge': { border: `1.5px solid ${tk.p600}` },
        },
        colorDefault: {
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${tk.b100}`,
          color: tk.t900,
        },
      },
    },

    // ── Toolbar ────────────────────────────────────────────────────────────
    MuiToolbar: {
      defaultProps: { variant: 'dense' },
      styleOverrides: {
        root: { minHeight: '52px !important', padding: '0 12px' },
        dense: { minHeight: '52px !important' },
      },
    },

    // ── Paper ──────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',  // gradient Paper nahi chahiye by default
        },
        elevation0: { boxShadow: 'none', border: `1px solid ${tk.b100}` },
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
        title: { fontWeight: 700, fontSize: '0.9375rem' },
        subheader: { fontSize: '0.75rem', color: tk.t500 },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: { padding: '16px 18px', '&:last-child': { paddingBottom: 16 } },
      },
    },

    // ── Button ─────────────────────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          fontFamily: font,
          fontWeight: 600,
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.15s',
          letterSpacing: '0.01em',
          // Legacy support
          '&[data-round="true"]': {
            minWidth: 150,
            borderRadius: 25,
          },
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
          borderColor: tk.b200,
          color: tk.t700,
          '&:hover': { borderColor: tk.p500, color: tk.p500, background: tk.p50 },
        },
        outlinedPrimary: {
          borderColor: tk.p300,
          color: tk.p500,
          '&:hover': { background: tk.p50, borderColor: tk.p500 },
        },
        text: { color: tk.t500, '&:hover': { background: alpha(tk.t900, 0.04) } },
        textPrimary: { color: tk.p500, '&:hover': { background: tk.p50 } },
        sizeLarge: { padding: '9px 22px', fontSize: '0.9375rem' },
        sizeMedium: { padding: '7px 16px', fontSize: '0.8125rem' },
        sizeSmall: { padding: '4px 12px', fontSize: '0.75rem' },
      },
    },

    // ── IconButton ─────────────────────────────────────────────────────────
    MuiIconButton: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s',
          '&:hover': { background: alpha(tk.t900, 0.05) },
        },
      },
    },

    // ── Drawer ─────────────────────────────────────────────────────────────
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          // sidebar drawer — dark shell
          background: tk.shell,
          borderRight: `1px solid ${tk.shellBrd}`,
          boxShadow: `4px 0 24px rgba(0,0,0,0.30)`,
          color: tk.shellText,
        },
      },
    },

    // ── FormControl ────────────────────────────────────────────────────────
    MuiFormControl: {
      defaultProps: { margin: 'dense' },
      styleOverrides: {
        root: {
          borderRadius: 4,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFF',
          },
          '& .MuiFormHelperText-sizeMedium': {
            fontSize: '1rem',
            marginLeft: 0,
          },
          '& .MuiTypography-root': {
            color: tk.t900
          }
        }
      },
    },

    // ── Inputs ─────────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      defaultProps: { margin: 'dense' },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tk.b200,
            transition: 'all 0.15s',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: tk.t300,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: tk.p500,
            borderWidth: '1.5px',
            boxShadow: `0 0 0 3px ${tk.p100}`,
          },
        },
        input: { padding: '8px 12px' },
      },
    },

    MuiInputLabel: {
      defaultProps: { margin: 'dense' },
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: tk.t500,
          '&.Mui-focused': { color: tk.p500 },
        },
      },
    },

    MuiFilledInput: { defaultProps: { margin: 'dense' } },
    MuiFormHelperText: { defaultProps: { margin: 'dense' } },
    MuiInputBase: { defaultProps: { margin: 'dense' } },
    MuiTextField: { defaultProps: { margin: 'dense' } },

    // ── Typography ─────────────────────────────────────────────────────────
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: 0.3,
          '&.anchor-link': {
            cursor: 'pointer',
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' },
          },
        },
      },
    },

    // ── Table ──────────────────────────────────────────────────────────────
    MuiTable: {
      defaultProps: { size: 'small' },
    },

    // MuiTableHead: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiTableCell-root': {
    //         background: tk.contentBg,
    //         color: tk.t300,
    //         fontWeight: 700,
    //         fontSize: '0.6875rem',
    //         letterSpacing: '0.07em',
    //         textTransform: 'uppercase',
    //         borderBottom: `1px solid ${tk.b200}`,
    //         padding: '10px 14px',
    //       },
    //     },
    //   },
    // },

    // MuiTableRow: {
    //   styleOverrides: {
    //     root: {
    //       transition: 'background 0.12s',
    //       '&:nth-of-type(even)': { background: '#fafbfd' },
    //       '&:hover': { background: tk.p50 },
    //       '&:last-child td': { border: 0 },
    //     },
    //   },
    // },

    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          color: tk.t900,
          borderBottom: `1px solid ${tk.b100}`,
          padding: '10px 14px',
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.6875rem',
          height: 22,
          borderRadius: 6,
        },
        colorSuccess: { background: tk.greenBg, color: tk.green, border: `1px solid ${tk.greenBrd}` },
        colorWarning: { background: tk.amberBg, color: tk.amber, border: `1px solid ${tk.amberBrd}` },
        colorError: { background: tk.redBg, color: tk.red, border: `1px solid ${tk.redBrd}` },
        colorPrimary: { background: tk.p100, color: tk.p500, border: `1px solid rgba(124,111,247,0.25)` },
        colorInfo: { background: tk.blueBg, color: tk.blue, border: `1px solid ${tk.blueBrd}` },
      },
    },

    // ── Badge ──────────────────────────────────────────────────────────────
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: 9,
          minWidth: 16,
          height: 16,
          padding: '0 4px',
        },
        // ClickUp-inspired hot pink for error badges
        colorError: { background: tk.pink },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${tk.b100}`, minHeight: 42 },
        indicator: {
          height: 2,
          borderRadius: '2px 2px 0 0',
          background: `linear-gradient(90deg, ${tk.p600}, ${tk.p400})`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.8125rem',
          textTransform: 'none',
          minHeight: 42,
          padding: '0 14px',
          color: tk.t500,
          '&.Mui-selected': { color: tk.p500, fontWeight: 700 },
        },
      },
    },

    // ── Switch ─────────────────────────────────────────────────────────────
    MuiSwitch: {
      styleOverrides: {
        track: {
          background: tk.b200,
          borderRadius: 12,
          opacity: '1 !important',
          transition: 'background 0.2s',
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
        paper: {
          borderRadius: 14,
          boxShadow: tk.s5,
          border: `1px solid ${tk.b100}`,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '1rem',
          padding: '16px 22px',
          borderBottom: `1px solid ${tk.b100}`,
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
        paper: {
          borderRadius: 10,
          boxShadow: tk.s4,
          border: `1px solid ${tk.b100}`,
          padding: '4px 0',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          color: tk.t900,
          padding: '7px 14px',
          margin: '1px 6px',
          borderRadius: 6,
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
          fontSize: '0.6875rem',
          fontWeight: 500,
          background: tk.shell,
          color: tk.shellText,
          borderRadius: 6,
          padding: '5px 10px',
          boxShadow: tk.s3,
        },
        arrow: { color: tk.shell },
      },
    },

    // ── Alert ──────────────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { fontSize: '0.8125rem', borderRadius: 8, border: '1px solid' },
        standardSuccess: { background: tk.greenBg, color: tk.green, borderColor: tk.greenBrd },
        standardWarning: { background: tk.amberBg, color: tk.amber, borderColor: tk.amberBrd },
        standardError: { background: tk.redBg, color: tk.red, borderColor: tk.redBrd },
        standardInfo: { background: tk.blueBg, color: tk.blue, borderColor: tk.blueBrd },
      },
    },

    // ── Pagination ─────────────────────────────────────────────────────────
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: tk.t500,
          borderRadius: 7,
          '&.Mui-selected': {
            background: `linear-gradient(135deg, ${tk.p600}, ${tk.p500})`,
            color: '#fff',
            boxShadow: tk.sBtn,
          },
        },
      },
    },

    // ── Divider ────────────────────────────────────────────────────────────
    MuiDivider: {
      styleOverrides: { root: { borderColor: tk.b100 } },
    },

    // ── LinearProgress ─────────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 3, borderRadius: 0, background: tk.b100 },
        bar: { background: `linear-gradient(90deg, ${tk.p600}, ${tk.p400})` },
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

    // ── Autocomplete ────────────────────────────────────────────────────────
    MuiAutocomplete: {
      styleOverrides: {
        paper: { borderRadius: 10, boxShadow: tk.s4, border: `1px solid ${tk.b100}`, overflowX: 'hidden' },
        listbox: {
          overflowX: 'hidden',         // agar listbox alag scrollable hai
          boxSizing: 'border-box',
        },

        option: {
          fontSize: '0.8125rem',
          color: tk.t900,              // ← ye line missing thi, add karein
          borderRadius: 2,
          margin: '1px 6px',
          '&[aria-selected="true"]': { background: `${tk.p100} !important`, color: tk.p500 },
          '&.Mui-focused': { background: tk.p50 },
        },
      },
    },

    // ── Select ─────────────────────────────────────────────────────────────
    MuiSelect: {
      styleOverrides: {
        icon: { color: tk.t300 },
        option: {
          color: tk.t900
        }

      },
    },

    // ── List (Sidebar nav) ──────────────────────────────────────────────────
    MuiListItem: {
      defaultProps: { dense: true },
    },

    MuiFab: {
      defaultProps: { size: 'small' },
    },
  },
});
