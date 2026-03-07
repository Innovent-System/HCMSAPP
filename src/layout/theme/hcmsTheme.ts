import { createTheme, alpha } from '@mui/material/styles';

// HCMS Professional Theme - Modern, Attractive, and Enterprise-Ready
// Color Philosophy: Trust, Professionalism, Innovation

// Primary Color Palette - Deep Ocean Blue (Trust & Stability)
const primaryMain = '#0A4D8C';
const primaryLight = '#1E6FBA';
const primaryDark = '#063259';

// Secondary Color Palette - Emerald Teal (Growth & Innovation)
const secondaryMain = '#00A67D';
const secondaryLight = '#00D9A5';
const secondaryDark = '#007A5C';

// Accent Colors for Status & Highlights
const accentGold = '#D4A843';
const accentRose = '#E85A7C';
const accentViolet = '#7C5CDB';

// Background & Surface Colors (Dark Mode)
const backgroundDefault = '#0F1419';
const backgroundPaper = '#161B22';
const backgroundElevated = '#1C2128';
const backgroundHover = '#22272E';

// Text Colors
const textPrimary = '#F0F6FC';
const textSecondary = '#8B949E';
const textDisabled = '#484F58';

// Border & Divider
const borderColor = '#30363D';
const dividerColor = '#21262D';

export const hcmsTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F85149',
      light: '#FF7B72',
      dark: '#DA3633',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: accentGold,
      light: '#E8B95F',
      dark: '#B8912E',
      contrastText: '#0F1419',
    },
    success: {
      main: secondaryMain,
      light: secondaryLight,
      dark: secondaryDark,
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#58A6FF',
      light: '#79B8FF',
      dark: '#1F6FEB',
      contrastText: '#FFFFFF',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: textDisabled,
    },
    divider: dividerColor,
    // Custom gradient palette
    gradients: {
      primary: `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 50%, ${primaryDark} 100%)`,
      secondary: `linear-gradient(135deg, ${secondaryLight} 0%, ${secondaryMain} 100%)`,
      accent: `linear-gradient(135deg, ${accentViolet} 0%, ${accentRose} 100%)`,
      gold: `linear-gradient(135deg, ${accentGold} 0%, #F0C858 100%)`,
      hero: `linear-gradient(135deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
      card: `linear-gradient(180deg, ${backgroundElevated} 0%, ${backgroundPaper} 100%)`,
      header: `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 50%, ${secondaryDark} 100%)`,
      subtle: `linear-gradient(180deg, transparent 0%, ${alpha(backgroundElevated, 0.5)} 100%)`,
    },
    // Custom shadows
    customShadows: {
      glow: `0 0 20px ${alpha(primaryMain, 0.4)}`,
      glowSecondary: `0 0 20px ${alpha(secondaryMain, 0.4)}`,
      card: `0 8px 32px ${alpha('#000000', 0.3)}`,
      elevated: `0 12px 48px ${alpha('#000000', 0.4)}`,
    },
  },

  typography: {
    fontFamily: [
      '"Inter"',
      '"SF Pro Display"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 14,
    htmlFontSize: 16,
    // Custom font weights for hierarchy
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    // Heading styles
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: textPrimary,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      color: textPrimary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
      color: textPrimary,
    },
    h4: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
      color: textPrimary,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.45,
      color: textPrimary,
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: textPrimary,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: textPrimary,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: textSecondary,
    },
    body1: {
      fontSize: '0.9375rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: textPrimary,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: textSecondary,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: textSecondary,
    },
    overline: {
      fontSize: '0.6875rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: secondaryMain,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    `0 1px 2px ${alpha('#000000', 0.1)}`,
    `0 2px 8px ${alpha('#000000', 0.15)}`,
    `0 4px 12px ${alpha('#000000', 0.2)}`,
    `0 6px 16px ${alpha('#000000', 0.25)}`,
    `0 8px 24px ${alpha('#000000', 0.3)}`,
    `0 10px 32px ${alpha('#000000', 0.35)}`,
    `0 12px 40px ${alpha('#000000', 0.4)}`,
    `0 16px 48px ${alpha('#000000', 0.45)}`,
    `0 20px 56px ${alpha('#000000', 0.5)}`,
    `0 24px 64px ${alpha('#000000', 0.55)}`,
    `0 28px 72px ${alpha('#000000', 0.6)}`,
    `0 32px 80px ${alpha('#000000', 0.65)}`,
    `0 36px 88px ${alpha('#000000', 0.7)}`,
    `0 40px 96px ${alpha('#000000', 0.75)}`,
    `0 44px 104px ${alpha('#000000', 0.8)}`,
    `0 48px 112px ${alpha('#000000', 0.85)}`,
    `0 52px 120px ${alpha('#000000', 0.9)}`,
    `0 56px 128px ${alpha('#000000', 0.95)}`,
    `0 60px 136px ${alpha('#000000', 1)}`,
    `0 64px 144px ${alpha('#000000', 1)}`,
    `0 68px 152px ${alpha('#000000', 1)}`,
    `0 72px 160px ${alpha('#000000', 1)}`,
    `0 76px 168px ${alpha('#000000', 1)}`,
    `0 80px 176px ${alpha('#000000', 1)}`,
  ],

  components: {
    // ============================================
    // BUTTON COMPONENTS
    // ============================================
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 12px ${alpha(primaryMain, 0.3)}`,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
            boxShadow: `0 6px 20px ${alpha(primaryMain, 0.4)}`,
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${secondaryLight} 0%, ${secondaryMain} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${secondaryMain} 0%, ${secondaryDark} 100%)`,
            boxShadow: `0 6px 20px ${alpha(secondaryMain, 0.4)}`,
          },
        },
        outlined: {
          borderWidth: 1.5,
          borderColor: alpha(primaryMain, 0.5),
          '&:hover': {
            borderWidth: 1.5,
            borderColor: primaryMain,
            backgroundColor: alpha(primaryMain, 0.1),
          },
        },
        outlinedSecondary: {
          borderWidth: 1.5,
          borderColor: alpha(secondaryMain, 0.5),
          '&:hover': {
            borderWidth: 1.5,
            borderColor: secondaryMain,
            backgroundColor: alpha(secondaryMain, 0.1),
          },
        },
        text: {
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.1),
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '& .MuiButton-root': {
            borderRadius: 10,
          },
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
          boxShadow: `0 8px 24px ${alpha(primaryMain, 0.4)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryDark} 100%)`,
            boxShadow: `0 12px 32px ${alpha(primaryMain, 0.5)}`,
          },
        },
      },
      defaultProps: {
        size: 'medium',
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.15),
            transform: 'scale(1.05)',
          },
        },
      },
      defaultProps: {
        size: 'medium',
      },
    },

    // ============================================
    // CARD COMPONENTS
    // ============================================
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: `linear-gradient(180deg, ${backgroundElevated} 0%, ${backgroundPaper} 100%)`,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 8px 32px ${alpha('#000000', 0.2)}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            borderColor: alpha(primaryMain, 0.3),
            boxShadow: `0 12px 48px ${alpha('#000000', 0.3)}, 0 0 0 1px ${alpha(primaryMain, 0.1)}`,
          },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
        subheader: {
          fontSize: '0.875rem',
          color: textSecondary,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },

    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderTop: `1px solid ${dividerColor}`,
        },
      },
    },

    // ============================================
    // INPUT COMPONENTS
    // ============================================
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: backgroundElevated,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: backgroundHover,
            },
            '&.Mui-focused': {
              backgroundColor: backgroundElevated,
              boxShadow: `0 0 0 2px ${alpha(primaryMain, 0.2)}`,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor,
            transition: 'border-color 0.2s ease-in-out',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(primaryMain, 0.5),
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryMain,
            borderWidth: 2,
          },
          '& .MuiInputLabel-root': {
            color: textSecondary,
            fontWeight: 500,
            '&.Mui-focused': {
              color: primaryMain,
            },
          },
          '& .MuiInputBase-input': {
            color: textPrimary,
            '&::placeholder': {
              color: textSecondary,
              opacity: 0.7,
            },
          },
        },
      },
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: backgroundElevated,
          '&:hover': {
            backgroundColor: backgroundHover,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(primaryMain, 0.2)}`,
          },
        },
        notchedOutline: {
          borderColor: borderColor,
          transition: 'border-color 0.2s ease-in-out',
        },
      },
      defaultProps: {
        notched: true,
      },
    },

    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px 10px 0 0',
          backgroundColor: backgroundElevated,
          '&:hover': {
            backgroundColor: backgroundHover,
          },
          '&.Mui-focused': {
            backgroundColor: backgroundElevated,
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          color: textPrimary,
        },
        input: {
          padding: '12px 16px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: textSecondary,
          fontWeight: 500,
          fontSize: '0.875rem',
          '&.Mui-focused': {
            color: primaryMain,
          },
        },
        outlined: {
          transform: 'translate(16px, 12px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.85)',
          },
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          marginTop: 6,
          marginLeft: 12,
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: 8,
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },

    // ============================================
    // SELECT & AUTOCOMPLETE
    // ============================================
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        select: {
          padding: '12px 16px',
          '&:focus': {
            backgroundColor: 'transparent',
          },
        },
        icon: {
          color: textSecondary,
          right: 12,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.1),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(primaryMain, 0.15),
            '&:hover': {
              backgroundColor: alpha(primaryMain, 0.2),
            },
          },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            padding: '4px 8px',
          },
        },
        option: {
          padding: '12px 16px',
          borderRadius: 8,
          margin: '2px 8px',
          '&[data-focus="true"]': {
            backgroundColor: alpha(primaryMain, 0.1),
          },
        },
        paper: {
          borderRadius: 12,
          marginTop: 8,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 8px 32px ${alpha('#000000', 0.3)}`,
        },
      },
    },

    // ============================================
    // NAVIGATION COMPONENTS
    // ============================================
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 50%, ${secondaryDark} 100%)`,
          boxShadow: `0 4px 20px ${alpha('#000000', 0.3)}`,
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        },
      },
      defaultProps: {
        position: 'static',
        elevation: 0,
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 64,
          '@media (min-width:600px)': {
            minHeight: 64,
          },
        },
      },
      defaultProps: {
        variant: 'regular',
      },
    },

    MuiDrawer: {
      styleOverrides: {
        root: {
          '& .MuiDrawer-paper': {
            backgroundColor: backgroundPaper,
            borderRight: `1px solid ${borderColor}`,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderBottom: `1px solid ${dividerColor}`,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: `linear-gradient(90deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          padding: '12px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.1),
          },
          '&.Mui-selected': {
            fontWeight: 600,
            color: primaryLight,
          },
        },
      },
    },

    // ============================================
    // DATA DISPLAY COMPONENTS
    // ============================================
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${borderColor}`,
        },
      },
      defaultProps: {
        size: 'medium',
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          background: `linear-gradient(180deg, ${backgroundElevated} 0%, ${backgroundHover} 100%)`,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.05),
          },
          '&:nth-of-type(even)': {
            backgroundColor: alpha(backgroundElevated, 0.3),
          },
        },
        head: {
          backgroundColor: backgroundElevated,
          '& .MuiTableCell-root': {
            fontWeight: 600,
            color: textPrimary,
            borderBottom: `1px solid ${borderColor}`,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          borderBottom: `1px solid ${dividerColor}`,
          borderColor: borderColor,
        },
        head: {
          fontWeight: 600,
          fontSize: '0.8125rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: textSecondary,
        },
        body: {
          fontSize: '0.9375rem',
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${borderColor}`,
          backgroundColor: backgroundElevated,
        },
        toolbar: {
          padding: '0 16px',
        },
        select: {
          borderRadius: 8,
        },
        actions: {
          '& .MuiIconButton-root': {
            borderRadius: 8,
          },
        },
      },
    },

    // ============================================
    // FEEDBACK COMPONENTS
    // ============================================
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '14px 20px',
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: alpha(secondaryMain, 0.15),
          borderColor: alpha(secondaryMain, 0.3),
          color: secondaryLight,
          '& .MuiAlert-icon': {
            color: secondaryLight,
          },
        },
        standardError: {
          backgroundColor: alpha('#F85149', 0.15),
          borderColor: alpha('#F85149', 0.3),
          color: '#FF7B72',
          '& .MuiAlert-icon': {
            color: '#FF7B72',
          },
        },
        standardWarning: {
          backgroundColor: alpha(accentGold, 0.15),
          borderColor: alpha(accentGold, 0.3),
          color: '#E8B95F',
          '& .MuiAlert-icon': {
            color: '#E8B95F',
          },
        },
        standardInfo: {
          backgroundColor: alpha('#58A6FF', 0.15),
          borderColor: alpha('#58A6FF', 0.3),
          color: '#79B8FF',
          '& .MuiAlert-icon': {
            color: '#79B8FF',
          },
        },
      },
    },

    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            backgroundColor: backgroundElevated,
            border: `1px solid ${borderColor}`,
            boxShadow: `0 8px 32px ${alpha('#000000', 0.4)}`,
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000000', 0.7),
            backdropFilter: 'blur(4px)',
          },
        },
        paper: {
          borderRadius: 20,
          background: `linear-gradient(180deg, ${backgroundElevated} 0%, ${backgroundPaper} 100%)`,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 24px 80px ${alpha('#000000', 0.5)}`,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '24px 24px 16px',
          color: textPrimary,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          color: textSecondary,
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          gap: 12,
        },
      },
    },

    // ============================================
    // PROGRESS COMPONENTS
    // ============================================
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 8,
          backgroundColor: alpha(primaryMain, 0.2),
        },
        bar: {
          borderRadius: 6,
          background: `linear-gradient(90deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: primaryMain,
        },
      },
    },

    // ============================================
    // AVATAR & BADGE
    // ============================================
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(primaryMain, 0.2),
          color: primaryLight,
          fontWeight: 600,
          border: `2px solid ${alpha(primaryMain, 0.3)}`,
        },
      },
    },

    MuiAvatarGroup: {
      styleOverrides: {
        root: {
          '& .MuiAvatar-root': {
            border: `2px solid ${backgroundPaper}`,
          },
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.6875rem',
        },
        colorPrimary: {
          background: `linear-gradient(135deg, ${primaryLight} 0%, ${primaryMain} 100%)`,
        },
        colorSecondary: {
          background: `linear-gradient(135deg, ${secondaryLight} 0%, ${secondaryMain} 100%)`,
        },
        colorError: {
          background: `linear-gradient(135deg, #FF7B72 0%, #F85149 100%)`,
        },
      },
    },

    // ============================================
    // CHIP & TAGS
    // ============================================
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          padding: '0 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        filled: {
          backgroundColor: alpha(primaryMain, 0.15),
          color: primaryLight,
          border: `1px solid ${alpha(primaryMain, 0.3)}`,
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.25),
          },
        },
        outlined: {
          borderColor: alpha(primaryMain, 0.5),
          color: primaryLight,
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.1),
            borderColor: primaryMain,
          },
        },
        avatar: {
          width: 24,
          height: 24,
          fontSize: '0.75rem',
        },
        deleteIcon: {
          color: alpha(textSecondary, 0.7),
          '&:hover': {
            color: '#F85149',
          },
        },
      },
    },

    // ============================================
    // TOOLTIP
    // ============================================
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: backgroundElevated,
          color: textPrimary,
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.8125rem',
          border: `1px solid ${borderColor}`,
          boxShadow: `0 4px 16px ${alpha('#000000', 0.3)}`,
        },
        arrow: {
          color: backgroundElevated,
          '&::before': {
            border: `1px solid ${borderColor}`,
          },
        },
      },
      defaultProps: {
        arrow: true,
        placement: 'top',
      },
    },

    // ============================================
    // DIVIDER
    // ============================================
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: dividerColor,
        },
      },
    },

    // ============================================
    // LIST COMPONENTS
    // ============================================
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px 0',
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '10px 16px',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(primaryMain, 0.15),
            '&:hover': {
              backgroundColor: alpha(primaryMain, 0.2),
            },
          },
        },
      },
      defaultProps: {
        disablePadding: false,
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '10px 16px',
          transition: 'all 0.15s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.08),
          },
          '&.Mui-selected': {
            backgroundColor: alpha(primaryMain, 0.15),
            '&:hover': {
              backgroundColor: alpha(primaryMain, 0.2),
            },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: textSecondary,
          '& .Mui-selected &': {
            color: primaryLight,
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: textPrimary,
        },
        secondary: {
          fontSize: '0.8125rem',
          color: textSecondary,
        },
      },
    },

    // ============================================
    // ACCORDION
    // ============================================
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: backgroundElevated,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
          '&:not(:last-child)': {
            borderBottom: `1px solid ${borderColor}`,
          },
        },
        expanded: {
          margin: 0,
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: '0 20px',
          minHeight: 56,
          '&.Mui-expanded': {
            minHeight: 56,
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
        expandIconWrapper: {
          color: textSecondary,
        },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 20px 20px',
          borderTop: `1px solid ${dividerColor}`,
        },
      },
    },

    // ============================================
    // SWITCH & CHECKBOX
    // ============================================
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 28,
          padding: 0,
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: primaryMain,
              opacity: 1,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
          boxShadow: 'none',
        },
        track: {
          borderRadius: 14,
          backgroundColor: borderColor,
          opacity: 1,
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: textSecondary,
          '&.Mui-checked': {
            color: primaryMain,
          },
          '&:hover': {
            backgroundColor: alpha(primaryMain, 0.1),
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: textSecondary,
          '&.Mui-checked': {
            color: primaryMain,
          },
        },
      },
    },

    // ============================================
    // SLIDER
    // ============================================
    MuiSlider: {
      styleOverrides: {
        root: {
          color: primaryMain,
          height: 6,
          padding: '15px 0',
        },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: '#FFFFFF',
          boxShadow: `0 2px 8px ${alpha('#000000', 0.3)}, 0 0 0 2px ${alpha(primaryMain, 0.2)}`,
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha('#000000', 0.4)}, 0 0 0 4px ${alpha(primaryMain, 0.2)}`,
          },
        },
        track: {
          background: `linear-gradient(90deg, ${primaryMain} 0%, ${secondaryMain} 100%)`,
          borderRadius: 3,
        },
        rail: {
          backgroundColor: alpha(primaryMain, 0.2),
          borderRadius: 3,
        },
      },
    },

    // ============================================
    // TYPOGRAPHY
    // ============================================
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.gradient-text': {
            background: `linear-gradient(135deg, ${primaryLight} 0%, ${secondaryLight} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          },
        },
      },
    },

    // ============================================
    // PAPER & CONTAINER
    // ============================================
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: backgroundPaper,
          border: `1px solid ${borderColor}`,
        },
        elevation1: {
          boxShadow: `0 4px 16px ${alpha('#000000', 0.2)}`,
        },
        elevation2: {
          boxShadow: `0 8px 24px ${alpha('#000000', 0.25)}`,
        },
        elevation3: {
          boxShadow: `0 12px 32px ${alpha('#000000', 0.3)}`,
        },
      },
    },

    // ============================================
    // STEPPER
    // ============================================
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: borderColor,
        },
      },
    },

    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: textSecondary,
          '&.Mui-active': {
            color: primaryLight,
            fontWeight: 600,
          },
          '&.Mui-completed': {
            color: secondaryMain,
          },
        },
        iconContainer: {
          '& .MuiStepIcon-root': {
            color: borderColor,
            '&.Mui-active': {
              color: primaryMain,
            },
            '&.Mui-completed': {
              color: secondaryMain,
            },
          },
        },
      },
    },

    // ============================================
    // BREADCRUMBS
    // ============================================
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          '& .MuiBreadcrumbItem-root': {
            color: textSecondary,
          },
          '& .MuiBreadcrumbItem-root.MuiBreadcrumbItem-active': {
            color: textPrimary,
          },
          '& .MuiBreadcrumbs-separator': {
            color: textDisabled,
          },
        },
      },
    },

    // ============================================
    // SKELETON
    // ============================================
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: alpha('#FFFFFF', 0.05),
        },
      },
    },
  },
});

// Export custom CSS classes for additional styling
export const hcmsCustomClasses = {
  // Glass morphism effect
  glassEffect: {
    background: alpha(backgroundElevated, 0.7),
    backdropFilter: 'blur(12px)',
    border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
  },
  // Glow effects
  primaryGlow: {
    boxShadow: `0 0 40px ${alpha(primaryMain, 0.3)}`,
  },
  secondaryGlow: {
    boxShadow: `0 0 40px ${alpha(secondaryMain, 0.3)}`,
  },
  // Gradient text
  gradientText: {
    background: `linear-gradient(135deg, ${primaryLight} 0%, ${secondaryLight} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  // Hover card effect
  hoverCard: {
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 16px 48px ${alpha('#000000', 0.4)}`,
    },
  },
};

// Export color constants for direct use
export const hcmsColors = {
  primary: {
    main: primaryMain,
    light: primaryLight,
    dark: primaryDark,
  },
  secondary: {
    main: secondaryMain,
    light: secondaryLight,
    dark: secondaryDark,
  },
  accent: {
    gold: accentGold,
    rose: accentRose,
    violet: accentViolet,
  },
  background: {
    default: backgroundDefault,
    paper: backgroundPaper,
    elevated: backgroundElevated,
    hover: backgroundHover,
  },
  text: {
    primary: textPrimary,
    secondary: textSecondary,
    disabled: textDisabled,
  },
  border: borderColor,
  divider: dividerColor,
};

export default hcmsTheme;
