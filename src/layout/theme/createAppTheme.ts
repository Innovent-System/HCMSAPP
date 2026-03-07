import { createTheme, alpha } from '@mui/material/styles';
import { colorPalettes, PaletteKey } from './palettes';

export function createAppTheme(paletteKey: PaletteKey = 'velocity') {
  const p = colorPalettes[paletteKey];
  const isLight = p.mode === 'light';

  return createTheme({
    palette: {
      mode: p.mode,
      primary: {
        main: p.primary.main,
        light: p.primary.light,
        dark: p.primary.dark,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: p.secondary.main,
        light: p.secondary.light,
        dark: p.secondary.dark,
        contrastText: '#FFFFFF',
      },
      error: {
        main: p.semantic.red,
        light: alpha(p.semantic.red, 0.7),
        dark: p.semantic.red,
        contrastText: '#FFFFFF',
      },
      warning: {
        main: p.semantic.amber,
        light: alpha(p.semantic.amber, 0.7),
        dark: p.semantic.amber,
        contrastText: isLight ? '#0f1117' : '#FFFFFF',
      },
      success: {
        main: p.semantic.green,
        light: alpha(p.semantic.green, 0.7),
        dark: p.semantic.green,
        contrastText: '#FFFFFF',
      },
      info: {
        main: p.semantic.blue,
        light: alpha(p.semantic.blue, 0.7),
        dark: p.semantic.blue,
        contrastText: '#FFFFFF',
      },
      background: {
        default: p.background.default,
        paper: p.background.paper,
      },
      text: {
        primary: p.text.primary,
        secondary: p.text.secondary,
        disabled: p.text.disabled,
      },
      divider: p.border.light,
      action: {
        hover: alpha(p.text.primary, 0.04),
        selected: alpha(p.primary.main, 0.08),
        disabled: alpha(p.text.primary, 0.26),
        disabledBackground: alpha(p.text.primary, 0.12),
      },
      gradients: {
        primary: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.main} 100%)`,
        secondary: `linear-gradient(135deg, ${p.secondary.dark} 0%, ${p.secondary.main} 100%)`,
        accent: `linear-gradient(135deg, ${p.accent.violet || p.primary.main} 0%, ${p.accent.rose || p.secondary.main} 100%)`,
        shell: `linear-gradient(180deg, ${p.background.shell} 0%, ${p.background.dark || p.background.shell} 100%)`,
        gold: `linear-gradient(135deg, ${p.accent.gold} 0%, #F0C858 100%)`,
      },
      custom: {
        shell: p.background.shell,
        shellHov: p.background.shellHov,
        shellAct: p.background.shellAct,
        shellBrd: p.border.shell || p.border.light,
        st900: p.text.shellPrimary,
        st700: isLight ? 'rgba(255,255,255,0.82)' : p.text.primary,
        st500: p.text.shellSecondary,
        st300: isLight ? 'rgba(255,255,255,0.28)' : p.text.disabled,
        bg2: isLight ? '#eef0f8' : p.background.elevated,
        b100: p.border.light,
        b200: p.border.medium,
        p100: alpha(p.primary.main, 0.10),
        p50: alpha(p.primary.main, 0.05),
        pGlow: p.shadows.glow,
        t900: p.text.primary,
        t700: isLight ? '#2b2f3e' : p.text.primary,
        t500: p.text.secondary,
        t300: p.text.disabled,
        t100: isLight ? '#d4d7e3' : p.text.disabled,
        greenBg: p.semantic.greenBg,
        greenBrd: p.semantic.greenBrd,
        amberBg: p.semantic.amberBg,
        amberBrd: p.semantic.amberBrd,
        redBg: p.semantic.redBg,
        redBrd: p.semantic.redBrd,
        blueBg: p.semantic.blueBg,
        blueBrd: p.semantic.blueBrd,
        pink: p.accent.pink,
        cyan: p.accent.cyan,
        yellow: p.accent.yellow,
      },
    },

    typography: {
      fontFamily: p.font,
      fontSize: 14,
      h1: { fontFamily: p.font, fontWeight: isLight ? 800 : 700, fontSize: '2rem', letterSpacing: isLight ? '-0.8px' : '-0.02em' },
      h2: { fontFamily: p.font, fontWeight: isLight ? 700 : 700, fontSize: '1.5rem', letterSpacing: isLight ? '-0.5px' : '-0.015em' },
      h3: { fontFamily: p.font, fontWeight: isLight ? 700 : 600, fontSize: '1.25rem', letterSpacing: isLight ? '-0.3px' : '-0.01em' },
      h4: { fontFamily: p.font, fontWeight: 600, fontSize: '1.0625rem', letterSpacing: isLight ? '-0.2px' : '-0.005em' },
      h5: { fontFamily: p.font, fontWeight: 600, fontSize: '0.9375rem', letterSpacing: isLight ? '-0.1px' : 0 },
      h6: { fontFamily: p.font, fontWeight: 600, fontSize: '0.875rem', letterSpacing: isLight ? '-0.1px' : 0 },
      subtitle1: { fontFamily: p.font, fontWeight: 500, fontSize: '0.9375rem' },
      subtitle2: { fontFamily: p.font, fontWeight: isLight ? 700 : 500, fontSize: isLight ? '0.6875rem' : '0.875rem', letterSpacing: isLight ? '0.07em' : 0, textTransform: isLight ? 'uppercase' : 'none' },
      body1: { fontFamily: p.font, fontWeight: 400, fontSize: isLight ? '0.875rem' : '0.9375rem', lineHeight: 1.6 },
      body2: { fontFamily: p.font, fontWeight: 400, fontSize: isLight ? '0.8125rem' : '0.875rem', lineHeight: isLight ? 1.55 : 1.6 },
      button: { fontFamily: p.font, fontWeight: 600, fontSize: isLight ? '0.8125rem' : '0.875rem', letterSpacing: isLight ? '0.01em' : '0.02em', textTransform: 'none' },
      caption: { fontFamily: p.font, fontWeight: 400, fontSize: '0.75rem' },
      overline: { fontFamily: p.font, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.10em', textTransform: 'uppercase' },
    },

    shape: { borderRadius: isLight ? 8 : 12 },

    shadows: [
      'none', p.shadows.s1, p.shadows.s2, p.shadows.s3, p.shadows.s4, p.shadows.s5,
      `0 0 0 3px ${p.shadows.glow}`, `0 0 0 3px ${alpha(p.semantic.green, 0.18)}`,
      `0 0 0 3px ${alpha(p.semantic.red, 0.18)}`, p.shadows.btn, p.shadows.btnHover,
      ...Array(14).fill('none'),
    ],

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          * { box-sizing: border-box; }
          body { background: ${p.background.default}; font-family: ${p.font}; -webkit-font-smoothing: antialiased; }
          ::-webkit-scrollbar { width: ${isLight ? '5px' : '8px'}; height: ${isLight ? '5px' : '8px'}; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${isLight ? p.border.medium : alpha('#FFFFFF', 0.1)}; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: ${isLight ? p.text.disabled : alpha('#FFFFFF', 0.2)}; }
          ::selection { background: ${alpha(p.primary.main, 0.15)}; color: ${p.primary.main}; }
        `,
      },

      // ════════════════════════════════════════════════════════════════════
      // BUTTON - All color variants properly supported
      // ════════════════════════════════════════════════════════════════════
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            fontFamily: p.font,
            fontWeight: 600,
            borderRadius: isLight ? 8 : 10,
            textTransform: 'none',
            transition: 'all 0.15s',
            letterSpacing: '0.01em',
          },
          // Contained variants
          contained: {
            '&:hover': { transform: 'translateY(-1px)' },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.main} 100%)`,
            boxShadow: p.shadows.btn,
            color: '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.dark} 100%)`,
              boxShadow: p.shadows.btnHover,
            },
          },
          containedSecondary: {
            background: `linear-gradient(135deg, ${p.secondary.dark} 0%, ${p.secondary.main} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.secondary.main, 0.32)}`,
            color: '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${p.secondary.main} 0%, ${p.secondary.dark} 100%)`,
              boxShadow: `0 4px 16px ${alpha(p.secondary.main, 0.44)}`,
            },
          },
          containedSuccess: {
            background: `linear-gradient(135deg, ${p.semantic.green} 0%, ${alpha(p.semantic.green, 0.8)} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.semantic.green, 0.32)}`,
            color: '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(p.semantic.green, 0.9)} 0%, ${p.semantic.green} 100%)`,
            },
          },
          containedWarning: {
            background: `linear-gradient(135deg, ${p.semantic.amber} 0%, ${alpha(p.semantic.amber, 0.8)} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.semantic.amber, 0.32)}`,
            color: isLight ? '#0f1117' : '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(p.semantic.amber, 0.9)} 0%, ${p.semantic.amber} 100%)`,
            },
          },
          containedError: {
            background: `linear-gradient(135deg, ${p.semantic.red} 0%, ${alpha(p.semantic.red, 0.8)} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.semantic.red, 0.32)}`,
            color: '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(p.semantic.red, 0.9)} 0%, ${p.semantic.red} 100%)`,
            },
          },
          containedInfo: {
            background: `linear-gradient(135deg, ${p.semantic.blue} 0%, ${alpha(p.semantic.blue, 0.8)} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.semantic.blue, 0.32)}`,
            color: '#FFFFFF',
            '&:hover': {
              background: `linear-gradient(135deg, ${alpha(p.semantic.blue, 0.9)} 0%, ${p.semantic.blue} 100%)`,
            },
          },
          // Outlined variants
          outlined: {
            borderColor: p.border.medium,
            '&:hover': { borderColor: p.primary.main },
          },
          outlinedPrimary: {
            borderColor: alpha(p.primary.main, 0.5),
            color: p.primary.main,
            '&:hover': {
              background: alpha(p.primary.main, 0.08),
              borderColor: p.primary.main,
            },
          },
          outlinedSecondary: {
            borderColor: alpha(p.secondary.main, 0.5),
            color: p.secondary.main,
            '&:hover': {
              background: alpha(p.secondary.main, 0.08),
              borderColor: p.secondary.main,
            },
          },
          outlinedSuccess: {
            borderColor: alpha(p.semantic.green, 0.5),
            color: p.semantic.green,
            '&:hover': {
              background: p.semantic.greenBg,
              borderColor: p.semantic.green,
            },
          },
          outlinedWarning: {
            borderColor: alpha(p.semantic.amber, 0.5),
            color: p.semantic.amber,
            '&:hover': {
              background: p.semantic.amberBg,
              borderColor: p.semantic.amber,
            },
          },
          outlinedError: {
            borderColor: alpha(p.semantic.red, 0.5),
            color: p.semantic.red,
            '&:hover': {
              background: p.semantic.redBg,
              borderColor: p.semantic.red,
            },
          },
          outlinedInfo: {
            borderColor: alpha(p.semantic.blue, 0.5),
            color: p.semantic.blue,
            '&:hover': {
              background: p.semantic.blueBg,
              borderColor: p.semantic.blue,
            },
          },
          // Text variants
          textPrimary: {
            color: p.primary.main,
            '&:hover': { background: alpha(p.primary.main, 0.08) },
          },
          textSecondary: {
            color: p.secondary.main,
            '&:hover': { background: alpha(p.secondary.main, 0.08) },
          },
          textSuccess: {
            color: p.semantic.green,
            '&:hover': { background: p.semantic.greenBg },
          },
          textWarning: {
            color: p.semantic.amber,
            '&:hover': { background: p.semantic.amberBg },
          },
          textError: {
            color: p.semantic.red,
            '&:hover': { background: p.semantic.redBg },
          },
          textInfo: {
            color: p.semantic.blue,
            '&:hover': { background: p.semantic.blueBg },
          },
          // Sizes
          sizeLarge: { padding: '9px 22px', fontSize: '0.9375rem' },
          sizeMedium: { padding: '7px 16px', fontSize: '0.8125rem' },
          sizeSmall: { padding: '4px 12px', fontSize: '0.75rem' },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: isLight ? 8 : 10,
            transition: 'all 0.15s',
          },
          colorPrimary: {
            color: p.primary.main,
            '&:hover': { background: alpha(p.primary.main, 0.08) },
          },
          colorSecondary: {
            color: p.secondary.main,
            '&:hover': { background: alpha(p.secondary.main, 0.08) },
          },
          colorSuccess: {
            color: p.semantic.green,
            '&:hover': { background: p.semantic.greenBg },
          },
          colorWarning: {
            color: p.semantic.amber,
            '&:hover': { background: p.semantic.amberBg },
          },
          colorError: {
            color: p.semantic.red,
            '&:hover': { background: p.semantic.redBg },
          },
          colorInfo: {
            color: p.semantic.blue,
            '&:hover': { background: p.semantic.blueBg },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // CHIP - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: p.font,
            fontWeight: isLight ? 600 : 500,
            fontSize: isLight ? '0.6875rem' : '0.75rem',
            height: isLight ? 22 : 26,
            borderRadius: isLight ? 6 : 8,
          },
          colorPrimary: {
            background: alpha(p.primary.main, 0.15),
            color: p.primary.main,
            border: `1px solid ${alpha(p.primary.main, 0.3)}`,
            '&:hover': { background: alpha(p.primary.main, 0.25) },
          },
          colorSecondary: {
            background: alpha(p.secondary.main, 0.15),
            color: p.secondary.main,
            border: `1px solid ${alpha(p.secondary.main, 0.3)}`,
            '&:hover': { background: alpha(p.secondary.main, 0.25) },
          },
          colorSuccess: {
            background: p.semantic.greenBg,
            color: p.semantic.green,
            border: `1px solid ${p.semantic.greenBrd}`,
            '&:hover': { background: alpha(p.semantic.green, 0.15) },
          },
          colorWarning: {
            background: p.semantic.amberBg,
            color: p.semantic.amber,
            border: `1px solid ${p.semantic.amberBrd}`,
            '&:hover': { background: alpha(p.semantic.amber, 0.15) },
          },
          colorError: {
            background: p.semantic.redBg,
            color: p.semantic.red,
            border: `1px solid ${p.semantic.redBrd}`,
            '&:hover': { background: alpha(p.semantic.red, 0.15) },
          },
          colorInfo: {
            background: p.semantic.blueBg,
            color: p.semantic.blue,
            border: `1px solid ${p.semantic.blueBrd}`,
            '&:hover': { background: alpha(p.semantic.blue, 0.15) },
          },
          colorDefault: {
            background: alpha(p.text.primary, 0.08),
            color: p.text.secondary,
            border: `1px solid ${p.border.light}`,
            '&:hover': { background: alpha(p.text.primary, 0.12) },
          },
          // Outlined chips
          outlinedPrimary: {
            borderColor: alpha(p.primary.main, 0.5),
            color: p.primary.main,
            '&:hover': { background: alpha(p.primary.main, 0.08), borderColor: p.primary.main },
          },
          outlinedSecondary: {
            borderColor: alpha(p.secondary.main, 0.5),
            color: p.secondary.main,
            '&:hover': { background: alpha(p.secondary.main, 0.08), borderColor: p.secondary.main },
          },
          outlinedSuccess: {
            borderColor: alpha(p.semantic.green, 0.5),
            color: p.semantic.green,
            '&:hover': { background: p.semantic.greenBg, borderColor: p.semantic.green },
          },
          outlinedWarning: {
            borderColor: alpha(p.semantic.amber, 0.5),
            color: p.semantic.amber,
            '&:hover': { background: p.semantic.amberBg, borderColor: p.semantic.amber },
          },
          outlinedError: {
            borderColor: alpha(p.semantic.red, 0.5),
            color: p.semantic.red,
            '&:hover': { background: p.semantic.redBg, borderColor: p.semantic.red },
          },
          outlinedInfo: {
            borderColor: alpha(p.semantic.blue, 0.5),
            color: p.semantic.blue,
            '&:hover': { background: p.semantic.blueBg, borderColor: p.semantic.blue },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // ALERT - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiAlert: {
        styleOverrides: {
          root: {
            fontFamily: p.font,
            fontSize: isLight ? '0.8125rem' : '0.9375rem',
            borderRadius: isLight ? 8 : 12,
            border: '1px solid',
          },
          standardSuccess: {
            background: p.semantic.greenBg,
            color: p.semantic.green,
            borderColor: p.semantic.greenBrd,
            '& .MuiAlert-icon': { color: p.semantic.green },
          },
          standardWarning: {
            background: p.semantic.amberBg,
            color: p.semantic.amber,
            borderColor: p.semantic.amberBrd,
            '& .MuiAlert-icon': { color: p.semantic.amber },
          },
          standardError: {
            background: p.semantic.redBg,
            color: p.semantic.red,
            borderColor: p.semantic.redBrd,
            '& .MuiAlert-icon': { color: p.semantic.red },
          },
          standardInfo: {
            background: p.semantic.blueBg,
            color: p.semantic.blue,
            borderColor: p.semantic.blueBrd,
            '& .MuiAlert-icon': { color: p.semantic.blue },
          },
          standardPrimary: {
            background: alpha(p.primary.main, 0.1),
            color: p.primary.main,
            borderColor: alpha(p.primary.main, 0.3),
            '& .MuiAlert-icon': { color: p.primary.main },
          },
          standardSecondary: {
            background: alpha(p.secondary.main, 0.1),
            color: p.secondary.main,
            borderColor: alpha(p.secondary.main, 0.3),
            '& .MuiAlert-icon': { color: p.secondary.main },
          },
          // Filled variants
          filledSuccess: {
            background: p.semantic.green,
          },
          filledWarning: {
            background: p.semantic.amber,
            color: isLight ? '#0f1117' : '#FFFFFF',
          },
          filledError: {
            background: p.semantic.red,
          },
          filledInfo: {
            background: p.semantic.blue,
          },
          filledPrimary: {
            background: p.primary.main,
          },
          filledSecondary: {
            background: p.secondary.main,
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // AVATAR - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiAvatar: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
          colorDefault: {
            backgroundColor: alpha(p.text.primary, 0.12),
            color: p.text.primary,
          },
          colorPrimary: {
            backgroundColor: alpha(p.primary.main, 0.15),
            color: p.primary.main,
          },
          colorSecondary: {
            backgroundColor: alpha(p.secondary.main, 0.15),
            color: p.secondary.main,
          },
          colorSuccess: {
            backgroundColor: p.semantic.greenBg,
            color: p.semantic.green,
          },
          colorWarning: {
            backgroundColor: p.semantic.amberBg,
            color: p.semantic.amber,
          },
          colorError: {
            backgroundColor: p.semantic.redBg,
            color: p.semantic.red,
          },
          colorInfo: {
            backgroundColor: p.semantic.blueBg,
            color: p.semantic.blue,
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // BADGE - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontFamily: p.font,
            fontWeight: 700,
            fontSize: 9,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
          },
          colorPrimary: {
            background: p.primary.main,
          },
          colorSecondary: {
            background: p.secondary.main,
          },
          colorSuccess: {
            background: p.semantic.green,
          },
          colorWarning: {
            background: p.semantic.amber,
          },
          colorError: {
            background: isLight ? p.accent.pink : p.semantic.red,
          },
          colorInfo: {
            background: p.semantic.blue,
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // TOGGLE BUTTON - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiToggleButton: {
        styleOverrides: {
          root: {
            fontFamily: p.font,
            textTransform: 'none',
          },
          colorPrimary: {
            '&.Mui-selected': {
              background: alpha(p.primary.main, 0.15),
              color: p.primary.main,
              '&:hover': { background: alpha(p.primary.main, 0.25) },
            },
          },
          colorSecondary: {
            '&.Mui-selected': {
              background: alpha(p.secondary.main, 0.15),
              color: p.secondary.main,
              '&:hover': { background: alpha(p.secondary.main, 0.25) },
            },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // FAB - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiFab: {
        styleOverrides: {
          root: {
            fontFamily: p.font,
            fontWeight: 600,
          },
          colorPrimary: {
            background: `linear-gradient(135deg, ${p.primary.light} 0%, ${p.primary.main} 100%)`,
            boxShadow: p.shadows.btn,
            '&:hover': {
              background: `linear-gradient(135deg, ${p.primary.main} 0%, ${p.primary.dark} 100%)`,
              boxShadow: p.shadows.btnHover,
            },
          },
          colorSecondary: {
            background: `linear-gradient(135deg, ${p.secondary.light} 0%, ${p.secondary.main} 100%)`,
            boxShadow: `0 2px 8px ${alpha(p.secondary.main, 0.32)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${p.secondary.main} 0%, ${p.secondary.dark} 100%)`,
            },
          },
          colorSuccess: {
            background: p.semantic.green,
            '&:hover': { background: alpha(p.semantic.green, 0.9) },
          },
          colorWarning: {
            background: p.semantic.amber,
            '&:hover': { background: alpha(p.semantic.amber, 0.9) },
          },
          colorError: {
            background: p.semantic.red,
            '&:hover': { background: alpha(p.semantic.red, 0.9) },
          },
          colorInfo: {
            background: p.semantic.blue,
            '&:hover': { background: alpha(p.semantic.blue, 0.9) },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // PROGRESS - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            height: isLight ? 4 : 8,
            borderRadius: isLight ? 4 : 6,
            backgroundColor: alpha(p.text.primary, 0.12),
          },
          colorPrimary: {
            backgroundColor: alpha(p.primary.main, 0.2),
          },
          colorSecondary: {
            backgroundColor: alpha(p.secondary.main, 0.2),
          },
          colorSuccess: {
            backgroundColor: p.semantic.greenBg,
          },
          colorWarning: {
            backgroundColor: p.semantic.amberBg,
          },
          colorError: {
            backgroundColor: p.semantic.redBg,
          },
          colorInfo: {
            backgroundColor: p.semantic.blueBg,
          },
          bar: {
            borderRadius: isLight ? 4 : 6,
          },
          barColorPrimary: {
            background: `linear-gradient(90deg, ${p.primary.dark} 0%, ${p.primary.light} 100%)`,
          },
          barColorSecondary: {
            background: `linear-gradient(90deg, ${p.secondary.dark} 0%, ${p.secondary.light} 100%)`,
          },
          barColorSuccess: {
            background: p.semantic.green,
          },
          barColorWarning: {
            background: p.semantic.amber,
          },
          barColorError: {
            background: p.semantic.red,
          },
          barColorInfo: {
            background: p.semantic.blue,
          },
        },
      },

      MuiCircularProgress: {
        styleOverrides: {
          colorPrimary: { color: p.primary.main },
          colorSecondary: { color: p.secondary.main },
          colorSuccess: { color: p.semantic.green },
          colorWarning: { color: p.semantic.amber },
          colorError: { color: p.semantic.red },
          colorInfo: { color: p.semantic.blue },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // CHECKBOX, RADIO, SWITCH - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: p.border.medium,
            '&:hover': { background: alpha(p.primary.main, 0.04) },
          },
          colorPrimary: {
            '&.Mui-checked': { color: p.primary.main },
            '&.Mui-checked:hover': { background: alpha(p.primary.main, 0.04) },
          },
          colorSecondary: {
            '&.Mui-checked': { color: p.secondary.main },
            '&.Mui-checked:hover': { background: alpha(p.secondary.main, 0.04) },
          },
          colorSuccess: {
            '&.Mui-checked': { color: p.semantic.green },
          },
          colorWarning: {
            '&.Mui-checked': { color: p.semantic.amber },
          },
          colorError: {
            '&.Mui-checked': { color: p.semantic.red },
          },
          colorInfo: {
            '&.Mui-checked': { color: p.semantic.blue },
          },
        },
      },

      MuiRadio: {
        styleOverrides: {
          root: {
            color: p.border.medium,
          },
          colorPrimary: {
            '&.Mui-checked': { color: p.primary.main },
          },
          colorSecondary: {
            '&.Mui-checked': { color: p.secondary.main },
          },
          colorSuccess: {
            '&.Mui-checked': { color: p.semantic.green },
          },
          colorWarning: {
            '&.Mui-checked': { color: p.semantic.amber },
          },
          colorError: {
            '&.Mui-checked': { color: p.semantic.red },
          },
          colorInfo: {
            '&.Mui-checked': { color: p.semantic.blue },
          },
        },
      },

      MuiSwitch: {
        styleOverrides: {
          root: {
            width: isLight ? undefined : 48,
            height: isLight ? undefined : 28,
          },
          switchBase: {
            color: '#fff',
          },
          track: {
            background: alpha(p.text.primary, 0.2),
            borderRadius: isLight ? 12 : 14,
            opacity: '1 !important',
          },
          thumb: {
            background: '#fff',
            boxShadow: p.shadows.s1,
            width: isLight ? undefined : 24,
            height: isLight ? undefined : 24,
          },
          colorPrimary: {
            '& .MuiSwitch-track': { background: alpha(p.primary.main, 0.3) },
            '&.Mui-checked .MuiSwitch-track': {
              background: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.main} 100%)`,
            },
            '&.Mui-checked .MuiSwitch-thumb': { color: '#fff' },
          },
          colorSecondary: {
            '& .MuiSwitch-track': { background: alpha(p.secondary.main, 0.3) },
            '&.Mui-checked .MuiSwitch-track': {
              background: `linear-gradient(135deg, ${p.secondary.dark} 0%, ${p.secondary.main} 100%)`,
            },
          },
          colorSuccess: {
            '& .MuiSwitch-track': { background: p.semantic.greenBg },
            '&.Mui-checked .MuiSwitch-track': { background: p.semantic.green },
          },
          colorWarning: {
            '& .MuiSwitch-track': { background: p.semantic.amberBg },
            '&.Mui-checked .MuiSwitch-track': { background: p.semantic.amber },
          },
          colorError: {
            '& .MuiSwitch-track': { background: p.semantic.redBg },
            '&.Mui-checked .MuiSwitch-track': { background: p.semantic.red },
          },
          colorInfo: {
            '& .MuiSwitch-track': { background: p.semantic.blueBg },
            '&.Mui-checked .MuiSwitch-track': { background: p.semantic.blue },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // SLIDER - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiSlider: {
        styleOverrides: {
          colorPrimary: {
            color: p.primary.main,
            '&:hover': { color: p.primary.light },
          },
          colorSecondary: {
            color: p.secondary.main,
          },
          colorSuccess: {
            color: p.semantic.green,
          },
          colorWarning: {
            color: p.semantic.amber,
          },
          colorError: {
            color: p.semantic.red,
          },
          colorInfo: {
            color: p.semantic.blue,
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // TAB - All color variants
      // ════════════════════════════════════════════════════════════════════
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: isLight ? 42 : 48,
            borderBottom: `1px solid ${p.border.light}`,
          },
          indicator: {
            height: isLight ? 2 : 3,
            borderRadius: isLight ? '2px 2px 0 0' : '3px 3px 0 0',
            background: `linear-gradient(90deg, ${p.primary.dark} 0%, ${p.primary.light} 100%)`,
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: p.font,
            fontWeight: isLight ? 500 : 500,
            fontSize: isLight ? '0.8125rem' : '0.9375rem',
            textTransform: 'none',
            minHeight: isLight ? 42 : 48,
            padding: isLight ? '0 14px' : '12px 20px',
            color: p.text.secondary,
            transition: 'all 0.2s ease',
            '&:hover': { background: alpha(p.primary.main, 0.05), color: p.primary.main },
          },
          textColorPrimary: {
            color: p.text.secondary,
            '&.Mui-selected': { color: p.primary.main, fontWeight: isLight ? 700 : 600 },
          },
          textColorSecondary: {
            color: p.text.secondary,
            '&.Mui-selected': { color: p.secondary.main, fontWeight: isLight ? 700 : 600 },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════
      // Other components
      // ════════════════════════════════════════════════════════════════════
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          colorPrimary: {
            background: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.main} 100%)`,
            borderBottom: `1px solid rgba(255,255,255,0.10)`,
            color: '#ffffff',
            boxShadow: `0 2px 16px ${p.shadows.glow}`,
          },
          colorSecondary: {
            background: isLight ? p.background.shell : p.secondary.main,
            borderBottom: `1px solid ${isLight ? p.border.shell : alpha('#FFFFFF', 0.1)}`,
            color: isLight ? p.text.shellPrimary : '#FFFFFF',
          },
          colorDefault: {
            background: isLight ? 'rgba(255,255,255,0.95)' : p.background.paper,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${p.border.light}`,
            color: p.text.primary,
          },
        },
      },

      MuiToolbar: {
        defaultProps: { variant: isLight ? 'dense' : 'regular' },
        styleOverrides: {
          root: { minHeight: isLight ? '52px !important' : 64, padding: isLight ? '0 16px' : undefined },
        },
      },

      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isLight ? p.background.shell : p.background.paper,
            borderRight: `1px solid ${isLight ? p.border.shell : p.border.light}`,
            boxShadow: isLight ? '4px 0 24px rgba(0,0,0,0.35)' : 'none',
            color: isLight ? p.text.shellSecondary : p.text.secondary,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', border: `1px solid ${p.border.light}` },
          elevation1: { boxShadow: p.shadows.s1 },
          elevation2: { boxShadow: p.shadows.s2 },
          elevation3: { boxShadow: p.shadows.s3 },
          elevation4: { boxShadow: p.shadows.s4 },
          elevation8: { boxShadow: p.shadows.s5 },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${p.border.light}`,
            boxShadow: p.shadows.s1,
            borderRadius: isLight ? 10 : 16,
            background: isLight ? p.background.paper : `linear-gradient(180deg, ${p.background.elevated} 0%, ${p.background.paper} 100%)`,
            transition: 'box-shadow 0.18s, border-color 0.18s',
            '&:hover': {
              borderColor: isLight ? p.border.medium : alpha(p.primary.main, 0.3),
              boxShadow: isLight ? p.shadows.s3 : p.shadows.s4,
            },
          },
        },
      },

      MuiCardHeader: {
        styleOverrides: {
          root: { padding: isLight ? '14px 18px' : '20px 24px 12px', borderBottom: isLight ? `1px solid ${p.border.light}` : undefined },
          title: { fontFamily: p.font, fontWeight: isLight ? 700 : 600, fontSize: isLight ? '0.9375rem' : '1.125rem' },
          subheader: { fontFamily: p.font, fontSize: isLight ? '0.75rem' : '0.875rem', color: p.text.secondary },
        },
      },

      MuiCardContent: {
        styleOverrides: {
          root: { padding: isLight ? '16px 18px' : '16px 24px 24px', '&:last-child': { paddingBottom: isLight ? 16 : 24 } },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: isLight ? 8 : 10,
            fontFamily: p.font,
            fontSize: '0.875rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: p.border.medium, transition: 'all 0.15s' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isLight ? p.text.disabled : alpha(p.primary.main, 0.5) },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: p.primary.main, borderWidth: '1.5px', boxShadow: `0 0 0 3px ${alpha(p.primary.main, 0.15)}` },
          },
          input: { padding: isLight ? '8px 12px' : '12px 16px' },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: { fontFamily: p.font, fontSize: '0.875rem', color: p.text.secondary, '&.Mui-focused': { color: p.primary.main } },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined', size: isLight ? 'small' : 'medium' },
      },

      MuiTable: {
        defaultProps: { size: isLight ? 'small' : 'medium' },
        styleOverrides: {
          root: { borderRadius: isLight ? 0 : 12, overflow: 'hidden', border: isLight ? 'none' : `1px solid ${p.border.light}` },
        },
      },

      MuiTableHead: {
        styleOverrides: {
          root: {
            background: isLight ? p.background.default : `linear-gradient(180deg, ${p.background.elevated} 0%, ${alpha(p.background.elevated, 0.8)} 100%)`,
            '& .MuiTableCell-root': {
              fontFamily: p.font, fontWeight: isLight ? 700 : 600, fontSize: isLight ? '0.6875rem' : '0.8125rem',
              letterSpacing: isLight ? '0.07em' : '0.05em', textTransform: 'uppercase',
              color: isLight ? p.text.disabled : p.text.secondary, borderBottom: `1px solid ${isLight ? p.border.medium : p.border.light}`,
              padding: isLight ? '10px 14px' : '16px 20px',
            },
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background 0.12s',
            '&:nth-of-type(even)': { background: isLight ? '#fafbfd' : alpha(p.background.elevated, 0.3) },
            '&:hover': { background: alpha(p.primary.main, 0.05) },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          root: {
            fontFamily: p.font, fontSize: isLight ? '0.8125rem' : '0.9375rem',
            color: isLight ? p.text.secondary : p.text.primary, borderBottom: `1px solid ${p.border.light}`,
            padding: isLight ? '10px 14px' : '16px 20px',
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: isLight ? 14 : 20, boxShadow: p.shadows.s5, border: `1px solid ${p.border.light}`,
            background: isLight ? p.background.paper : `linear-gradient(180deg, ${p.background.elevated} 0%, ${p.background.paper} 100%)`,
          },
        },
      },

      MuiDialogTitle: {
        styleOverrides: {
          root: {
            fontFamily: p.font, fontWeight: isLight ? 700 : 600, fontSize: isLight ? '1rem' : '1.25rem',
            padding: isLight ? '16px 22px' : '24px 24px 16px', borderBottom: isLight ? `1px solid ${p.border.light}` : undefined,
            color: p.text.primary,
          },
        },
      },

      MuiDialogContent: {
        styleOverrides: { root: { padding: isLight ? '18px 22px' : '16px 24px', color: p.text.secondary } },
      },

      MuiDialogActions: {
        styleOverrides: { root: { padding: isLight ? '12px 22px' : '16px 24px 24px', borderTop: isLight ? `1px solid ${p.border.light}` : undefined, gap: isLight ? 8 : 12 } },
      },

      MuiMenu: {
        styleOverrides: {
          paper: { borderRadius: isLight ? 10 : 12, boxShadow: p.shadows.s4, border: `1px solid ${p.border.light}`, padding: isLight ? '4px 0' : undefined },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: p.font, fontSize: isLight ? '0.8125rem' : '0.9375rem', color: p.text.secondary,
            padding: isLight ? '7px 14px' : '12px 16px', margin: isLight ? '1px 6px' : '2px 8px', borderRadius: isLight ? 6 : 8,
            transition: 'all 0.15s ease',
            '&:hover': { background: alpha(p.primary.main, 0.05), color: p.primary.main },
            '&.Mui-selected': { background: alpha(p.primary.main, 0.1), color: p.primary.main, fontWeight: isLight ? 600 : 500 },
          },
        },
      },

      MuiTooltip: {
        defaultProps: { arrow: true, enterDelay: 300 },
        styleOverrides: {
          tooltip: {
            fontFamily: p.font, fontSize: isLight ? '0.6875rem' : '0.8125rem', fontWeight: isLight ? 500 : 400,
            background: isLight ? p.background.shell : p.background.elevated, color: isLight ? p.text.shellSecondary : p.text.primary,
            borderRadius: isLight ? 6 : 8, padding: isLight ? '5px 10px' : '8px 12px', boxShadow: p.shadows.s3,
            border: isLight ? 'none' : `1px solid ${p.border.light}`,
          },
          arrow: { color: isLight ? p.background.shell : p.background.elevated },
        },
      },

      MuiDivider: {
        styleOverrides: { root: { borderColor: p.border.light } },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            fontFamily: p.font, borderRadius: 8, margin: isLight ? '1px 8px' : '2px 8px', padding: isLight ? '7px 10px' : '10px 16px',
            color: isLight ? p.text.shellSecondary : p.text.secondary, transition: 'all 0.13s',
            '&:hover': { background: isLight ? p.background.shellHov : alpha(p.primary.main, 0.08), color: isLight ? p.text.shellPrimary : p.text.primary },
            '&.Mui-selected': {
              background: isLight ? p.background.shellAct : alpha(p.primary.main, 0.15), color: isLight ? p.primary.light : p.primary.light,
              fontWeight: isLight ? 600 : 500,
              '&:hover': { background: isLight ? p.background.shellAct : alpha(p.primary.main, 0.2) },
            },
          },
        },
      },

      MuiListItemIcon: {
        styleOverrides: { root: { minWidth: isLight ? 34 : 40, color: 'inherit', '& svg': { fontSize: isLight ? 18 : 20 } } },
      },

      MuiListItemText: {
        styleOverrides: { primary: { fontFamily: p.font, fontSize: isLight ? '0.8125rem' : '0.9375rem', fontWeight: 500 } },
      },

      MuiAutocomplete: {
        styleOverrides: {
          paper: { borderRadius: isLight ? 10 : 12, boxShadow: p.shadows.s4, border: `1px solid ${p.border.light}` },
          option: {
            fontFamily: p.font, fontSize: isLight ? '0.8125rem' : '0.9375rem', borderRadius: isLight ? 6 : 8, margin: isLight ? '1px 6px' : '2px 8px',
            '&[aria-selected="true"]': { background: `${alpha(p.primary.main, 0.1)} !important`, color: p.primary.main },
            '&.Mui-focused': { background: alpha(p.primary.main, 0.05) },
          },
        },
      },

      MuiPaginationItem: {
        styleOverrides: {
          root: {
            fontFamily: p.font, fontWeight: 600, color: p.text.secondary, borderRadius: isLight ? 7 : 8,
            '&.Mui-selected': { background: `linear-gradient(135deg, ${p.primary.dark} 0%, ${p.primary.main} 100%)`, color: '#fff', boxShadow: p.shadows.btn },
          },
        },
      },
    },
  });
}

export type HCMSTheme = ReturnType<typeof createAppTheme>;
