import { createTheme, alpha } from '@mui/material/styles';

/* ═══════════════════════════════════════════════════════════════════════════
   HMCS · "Pearl Cloud Elevated" — Production MUI Theme
   ───────────────────────────────────────────────────────────────────────────
   Philosophy : Clean authority. Every pixel earns its place.
   Palette    : Warm whites + Cool slate + Electric blue accent
   Typography : Bricolage Grotesque (display) + Instrument Sans (body)
   ───────────────────────────────────────────────────────────────────────────
   FONT SETUP — add to index.html <head>:
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Design Tokens ──────────────────────────────────────────────────────────
export const tk = {
    // Backgrounds — warm white layering system
    bg0: '#f7f7f5',
    bg1: '#ffffff',
    bg2: '#f2f2ef',
    bg3: '#eaeae6',
    bgOverlay: 'rgba(247,247,245,0.92)',

    // Primary — electric blue
    p500: '#1a56db',
    p400: '#3b7cf4',
    p300: '#6fa3f7',
    p100: 'rgba(26,86,219,0.07)',
    p50: 'rgba(26,86,219,0.04)',
    pGlow: 'rgba(26,86,219,0.18)',
    pGlow2: 'rgba(26,86,219,0.08)',

    // Semantic
    green: '#0d7f4f',
    greenLight: '#22c55e',
    greenBg: 'rgba(13,127,79,0.07)',
    greenBrd: 'rgba(13,127,79,0.18)',
    amber: '#b45309',
    amberLight: '#f59e0b',
    amberBg: 'rgba(180,83,9,0.07)',
    amberBrd: 'rgba(180,83,9,0.18)',
    red: '#c41d3a',
    redLight: '#ef4444',
    redBg: 'rgba(196,29,58,0.07)',
    redBrd: 'rgba(196,29,58,0.18)',
    blue: '#0284c7',
    blueBg: 'rgba(2,132,199,0.07)',
    blueBrd: 'rgba(2,132,199,0.18)',

    // Text — warm charcoal scale
    t900: '#141412',
    t700: '#3a3a36',
    t500: '#6b6b63',
    t300: '#a8a89e',
    t100: '#deded8',

    // Borders
    b100: '#eaeae6',
    b200: '#d8d8d2',
    b300: '#c4c4bc',
    bFocus: '#1a56db',

    // Shadows
    s0: 'none',
    s1: '0 1px 2px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.03)',
    s2: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    s3: '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
    s4: '0 8px 28px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.05)',
    s5: '0 16px 48px rgba(0,0,0,0.13), 0 8px 18px rgba(0,0,0,0.06)',
    sBtn: '0 1px 3px rgba(26,86,219,0.25), 0 4px 12px rgba(26,86,219,0.18)',
    sBtnH: '0 2px 6px rgba(26,86,219,0.30), 0 6px 18px rgba(26,86,219,0.22)',
};

const display = `'Bricolage Grotesque', 'Segoe UI', sans-serif`;
const body = `'Instrument Sans', 'Segoe UI', 'Helvetica Neue', sans-serif`;

// ─── Theme ───────────────────────────────────────────────────────────────────
export const theme = createTheme({

    // ── Palette ────────────────────────────────────────────────────────────────
    palette: {
        mode: 'light',
        background: { default: tk.bg0, paper: tk.bg1 },
        primary: { main: tk.p500, light: tk.p400, dark: '#1547c0', contrastText: '#fff' },
        secondary: { main: tk.t500, light: tk.t300, dark: tk.t700, contrastText: '#fff' },
        success: { main: tk.green, light: tk.greenLight, dark: '#065f46', contrastText: '#fff' },
        warning: { main: tk.amber, light: tk.amberLight, dark: '#92400e', contrastText: '#fff' },
        error: { main: tk.red, light: tk.redLight, dark: '#991b1b', contrastText: '#fff' },
        info: { main: tk.blue, light: '#38bdf8', dark: '#075985', contrastText: '#fff' },
        text: { primary: tk.t900, secondary: tk.t500, disabled: tk.t100 },
        divider: tk.b100,
        action: {
            hover: alpha(tk.t900, 0.04),
            selected: alpha(tk.p500, 0.06),
            disabled: tk.t100,
            disabledBackground: tk.bg2,
        },
        // Custom tokens — access via theme.palette.custom.*
        custom: {
            bg0: tk.bg0, bg1: tk.bg1, bg2: tk.bg2, bg3: tk.bg3, bgOverlay: tk.bgOverlay,
            p100: tk.p100, p50: tk.p50, pGlow: tk.pGlow, pGlow2: tk.pGlow2,
            greenBg: tk.greenBg, greenBrd: tk.greenBrd,
            amberBg: tk.amberBg, amberBrd: tk.amberBrd,
            redBg: tk.redBg, redBrd: tk.redBrd,
            blueBg: tk.blueBg, blueBrd: tk.blueBrd,
            t900: tk.t900, t700: tk.t700, t500: tk.t500, t300: tk.t300, t100: tk.t100,
            b100: tk.b100, b200: tk.b200, b300: tk.b300,
            s1: tk.s1, s2: tk.s2, s3: tk.s3, s4: tk.s4, s5: tk.s5,
            sBtn: tk.sBtn, sBtnH: tk.sBtnH,
        },
        gradients: {
            primary: `linear-gradient(135deg, ${tk.p500} 0%, ${tk.p400} 100%)`,
            primaryRev: `linear-gradient(135deg, #1547c0 0%, ${tk.p500} 100%)`,
            success: `linear-gradient(135deg, ${tk.green} 0%, ${tk.greenLight} 100%)`,
            warm: `linear-gradient(135deg, ${tk.bg0} 0%, ${tk.bg3} 100%)`,
        },
    },

    // ── Shape & Spacing ────────────────────────────────────────────────────────
    shape: { borderRadius: 9 },

    // ── Typography ─────────────────────────────────────────────────────────────
    typography: {
        fontFamily: body,
        fontSize: 13,
        h1: { fontFamily: display, fontWeight: 800, fontSize: '2rem', letterSpacing: '-1px', lineHeight: 1.15, color: tk.t900 },
        h2: { fontFamily: display, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.6px', lineHeight: 1.2, color: tk.t900 },
        h3: { fontFamily: display, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.4px', lineHeight: 1.25, color: tk.t900 },
        h4: { fontFamily: display, fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.3px', color: tk.t900 },
        h5: { fontFamily: display, fontWeight: 700, fontSize: '0.9375rem', color: tk.t900 },
        h6: { fontFamily: body, fontWeight: 700, fontSize: '0.875rem', color: tk.t900 },
        subtitle1: { fontSize: '0.8125rem', fontWeight: 500, color: tk.t500 },
        subtitle2: { fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: tk.t300 },
        body1: { fontSize: '0.8125rem', lineHeight: 1.65, color: tk.t700 },
        body2: { fontSize: '0.75rem', lineHeight: 1.6, color: tk.t500 },
        caption: { fontSize: '0.6875rem', lineHeight: 1.5, color: tk.t300 },
        overline: { fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: tk.t100 },
        button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em', fontFamily: body },
    },

    // ── Shadows ────────────────────────────────────────────────────────────────
    shadows: [
        'none', tk.s1, tk.s2, tk.s3, tk.s4, tk.s5,
        `0 0 0 3px ${tk.pGlow2}`,            // [6] focus ring
        `0 0 0 3px ${alpha(tk.green, 0.12)}`,// [7] success focus
        `0 0 0 3px ${alpha(tk.red, 0.12)}`,  // [8] error focus
        tk.sBtn, tk.sBtnH,                   // [9][10] button shadows
        ...Array(13).fill('none'),
    ],

    // ── Transitions ────────────────────────────────────────────────────────────
    transitions: {
        duration: { shortest: 100, shorter: 150, short: 180, standard: 220, complex: 300, enteringScreen: 220, leavingScreen: 180 },
        easing: { easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)', easeIn: 'cubic-bezier(0.4, 0, 1, 1)', sharp: 'cubic-bezier(0.4, 0, 0.6, 1)' },
    },

    // ── Components ─────────────────────────────────────────────────────────────
    components: {

        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${tk.bg0}; color: ${tk.t900}; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: ${alpha(tk.p500, 0.12)}; color: ${tk.p500}; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${tk.b200}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${tk.b300}; }
        * { scrollbar-width: thin; scrollbar-color: ${tk.b200} transparent; }
        a { color: ${tk.p500}; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `,
        },

        // ── AppBar ────────────────────────────────────────────────────────────────
        MuiAppBar: {
            defaultProps: { elevation: 0, color: 'default' },
            styleOverrides: {
                root: {
                    background: tk.bgOverlay,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${tk.b100}`,
                    color: tk.t900,
                    boxShadow: `0 1px 0 ${tk.b100}, 0 2px 8px rgba(0,0,0,0.04)`,
                },
            },
        },

        MuiToolbar: {
            defaultProps: { variant: 'dense' },
            styleOverrides: {
                dense: { minHeight: 56, padding: '0 18px' },
                regular: { minHeight: 64, padding: '0 20px' },
            },
        },

        // ── Drawer ────────────────────────────────────────────────────────────────
        MuiDrawer: {
            styleOverrides: {
                paper: { background: tk.bg1, borderRight: `1px solid ${tk.b100}`, boxShadow: 'none' },
                modal: { '& .MuiDrawer-paper': { boxShadow: tk.s5 } },
            },
        },

        // ── Paper & Card ──────────────────────────────────────────────────────────
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { background: tk.bg1, backgroundImage: 'none', border: `1px solid ${tk.b100}`, borderRadius: 12 },
                elevation0: { boxShadow: 'none', border: `1px solid ${tk.b100}` },
                elevation1: { boxShadow: tk.s1, border: `1px solid ${tk.b100}` },
                elevation2: { boxShadow: tk.s2, border: `1px solid ${tk.b100}` },
                elevation3: { boxShadow: tk.s3, border: `1px solid ${tk.b200}` },
                elevation4: { boxShadow: tk.s4, border: `1px solid ${tk.b200}` },
                elevation8: { boxShadow: tk.s5, border: `1px solid ${tk.b200}` },
            },
        },

        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    background: tk.bg1, border: `1px solid ${tk.b100}`, borderRadius: 14,
                    boxShadow: tk.s1, transition: 'border-color 0.18s, box-shadow 0.18s',
                    '&:hover': { borderColor: tk.b200, boxShadow: tk.s2 },
                },
            },
        },

        MuiCardHeader: {
            styleOverrides: {
                root: { padding: '18px 20px 10px', borderBottom: `1px solid ${tk.b100}` },
                title: { fontFamily: display, fontWeight: 700, fontSize: '0.9375rem', color: tk.t900, letterSpacing: '-0.2px' },
                subheader: { fontSize: '0.75rem', color: tk.t500, marginTop: 2 },
                action: { margin: 0, alignSelf: 'center' },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: { padding: '18px 20px', '&:last-child': { paddingBottom: 18 } },
            },
        },

        MuiCardActions: {
            styleOverrides: {
                root: { padding: '10px 20px 16px', borderTop: `1px solid ${tk.b100}`, gap: 8 },
            },
        },

        // ── Buttons ───────────────────────────────────────────────────────────────
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: {
                    textTransform: 'none', fontFamily: body, fontWeight: 600,
                    letterSpacing: '0.01em', borderRadius: 9,
                    transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                    '&[data-round="true"]': { minWidth: 140, borderRadius: 24 },
                    '&:focus-visible': { outline: `2px solid ${tk.p500}`, outlineOffset: 2 },
                },
                contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${tk.p500}, ${tk.p400})`,
                    color: '#fff', boxShadow: tk.sBtn,
                    '&:hover': { background: `linear-gradient(135deg, #1547c0, ${tk.p500})`, boxShadow: tk.sBtnH, transform: 'translateY(-1px)' },
                    '&:active': { transform: 'translateY(0)', boxShadow: tk.sBtn },
                    '&.Mui-disabled': { background: tk.bg2, color: tk.t300, boxShadow: 'none' },
                },
                containedSecondary: {
                    background: tk.bg2, color: tk.t700, border: `1px solid ${tk.b100}`, boxShadow: 'none',
                    '&:hover': { background: tk.bg3, borderColor: tk.b200, boxShadow: tk.s1 },
                },
                containedSuccess: {
                    background: `linear-gradient(135deg, ${tk.green}, ${tk.greenLight})`, color: '#fff',
                    boxShadow: `0 2px 8px ${alpha(tk.green, 0.25)}`,
                    '&:hover': { boxShadow: `0 4px 14px ${alpha(tk.green, 0.35)}`, transform: 'translateY(-1px)' },
                },
                containedError: {
                    background: `linear-gradient(135deg, ${tk.red}, ${tk.redLight})`, color: '#fff',
                    boxShadow: `0 2px 8px ${alpha(tk.red, 0.22)}`,
                    '&:hover': { boxShadow: `0 4px 14px ${alpha(tk.red, 0.32)}`, transform: 'translateY(-1px)' },
                },
                outlined: {
                    borderColor: tk.b200, color: tk.t700,
                    '&:hover': { borderColor: tk.b300, background: tk.bg2, color: tk.t900 },
                },
                outlinedPrimary: {
                    borderColor: alpha(tk.p500, 0.35), color: tk.p500,
                    '&:hover': { borderColor: tk.p500, background: tk.p100 },
                },
                outlinedError: {
                    borderColor: alpha(tk.red, 0.35), color: tk.red,
                    '&:hover': { borderColor: tk.red, background: tk.redBg },
                },
                text: { color: tk.t500, '&:hover': { background: tk.bg2, color: tk.t900 } },
                textPrimary: { color: tk.p500, '&:hover': { background: tk.p100 } },
                sizeLarge: { padding: '10px 22px', fontSize: '0.875rem' },
                sizeMedium: { padding: '7px 16px', fontSize: '0.8125rem' },
                sizeSmall: { padding: '4px 12px', fontSize: '0.75rem', borderRadius: 7 },
            },
        },

        MuiIconButton: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: {
                    borderRadius: 8, color: tk.t300, border: '1px solid transparent', transition: 'all 0.15s',
                    '&:hover': { background: tk.bg2, borderColor: tk.b100, color: tk.t700 },
                    '&.Mui-disabled': { color: tk.t100 },
                    '&:focus-visible': { outline: `2px solid ${tk.p500}`, outlineOffset: 2 },
                },
                colorPrimary: { color: tk.p500, '&:hover': { background: tk.p100, borderColor: alpha(tk.p500, 0.2) } },
                colorError: { color: tk.red, '&:hover': { background: tk.redBg, borderColor: alpha(tk.red, 0.2) } },
                sizeSmall: { padding: 6, '& .MuiSvgIcon-root': { fontSize: 16 } },
                sizeMedium: { padding: 8, '& .MuiSvgIcon-root': { fontSize: 20 } },
                sizeLarge: { padding: 10, '& .MuiSvgIcon-root': { fontSize: 24 } },
            },
        },

        MuiFab: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: {
                    background: `linear-gradient(135deg, ${tk.p500}, ${tk.p400})`,
                    color: '#fff', boxShadow: tk.sBtn,
                    '&:hover': { boxShadow: tk.sBtnH, transform: 'translateY(-2px) scale(1.02)' },
                    transition: 'all 0.18s',
                },
            },
        },

        // ── Form Controls ─────────────────────────────────────────────────────────
        MuiFormControl: {
            defaultProps: { margin: 'dense' },
            styleOverrides: { root: { '& .MuiFormHelperText-sizeMedium': { fontSize: '0.6875rem', marginLeft: 0, marginTop: 4 } } },
        },

        MuiFormLabel: {
            styleOverrides: {
                root: { fontFamily: body, fontSize: '0.8125rem', fontWeight: 500, color: tk.t500, '&.Mui-focused': { color: tk.p500 }, '&.Mui-error': { color: tk.red } },
            },
        },

        MuiInputLabel: {
            defaultProps: { margin: 'dense' },
            styleOverrides: {
                root: { fontFamily: body, fontSize: '0.8125rem', fontWeight: 500, color: tk.t500, '&.Mui-focused': { color: tk.p500 }, '&.Mui-error': { color: tk.red } },
                shrink: { fontWeight: 600 },
            },
        },

        MuiOutlinedInput: {
            defaultProps: { margin: 'dense' },
            styleOverrides: {
                root: {
                    fontFamily: body, background: tk.bg1, borderRadius: 9, fontSize: '0.8125rem', color: tk.t900,
                    transition: 'box-shadow 0.18s',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: tk.b100, borderWidth: '1.5px', transition: 'border-color 0.18s' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tk.b300 },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: tk.bFocus, borderWidth: '1.5px' },
                    '&.Mui-focused': { boxShadow: `0 0 0 3px ${tk.pGlow2}` },
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: tk.red },
                    '&.Mui-error.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(tk.red, 0.10)}` },
                    '&.Mui-disabled': { background: tk.bg2, '& .MuiOutlinedInput-notchedOutline': { borderColor: tk.b100 } },
                },
                input: { padding: '8px 12px', '&::placeholder': { color: tk.t300, opacity: 1 } },
                inputSizeSmall: { padding: '5px 10px' },
                multiline: { padding: 0 },
            },
        },

        MuiFilledInput: {
            defaultProps: { margin: 'dense', disableUnderline: true },
            styleOverrides: {
                root: {
                    fontFamily: body, background: tk.bg2, borderRadius: '9px 9px 0 0', fontSize: '0.8125rem',
                    borderBottom: `1.5px solid ${tk.b200}`, transition: 'background 0.18s, border-color 0.18s, box-shadow 0.18s',
                    '&:hover': { background: tk.bg3 },
                    '&.Mui-focused': { background: tk.bg1, borderBottomColor: tk.bFocus, boxShadow: `0 2px 0 0 ${tk.p500}` },
                    '&.Mui-error': { borderBottomColor: tk.red },
                },
                input: { padding: '10px 12px 6px', '&::placeholder': { color: tk.t300, opacity: 1 } },
            },
        },

        MuiInputBase: {
            defaultProps: { margin: 'dense' },
            styleOverrides: { root: { fontFamily: body, fontSize: '0.8125rem' } },
        },

        MuiFormHelperText: {
            defaultProps: { margin: 'dense' },
            styleOverrides: { root: { fontFamily: body, fontSize: '0.6875rem', marginLeft: 0, marginTop: 4, color: tk.t300, '&.Mui-error': { color: tk.red } } },
        },

        MuiTextField: { defaultProps: { margin: 'dense' } },

        MuiSelect: {
            styleOverrides: {
                select: { fontFamily: body, fontSize: '0.8125rem', '&:focus': { background: 'transparent' } },
                icon: { color: tk.t300 },
            },
        },

        MuiAutocomplete: {
            styleOverrides: {
                paper: { background: tk.bg1, border: `1px solid ${tk.b200}`, borderRadius: 12, boxShadow: tk.s4, marginTop: 4 },
                listbox: { padding: '6px 4px' },
                option: {
                    fontFamily: body, fontSize: '0.8125rem', borderRadius: 7, padding: '8px 12px', color: tk.t700,
                    '&[aria-selected="true"]': { background: tk.p100, color: tk.p500, fontWeight: 600 },
                    '&.Mui-focused': { background: tk.bg2 },
                },
                noOptions: { fontFamily: body, fontSize: '0.8125rem', color: tk.t300, padding: '12px 16px' },
                tag: { borderRadius: 7, height: 22, fontSize: '0.75rem' },
            },
        },

        // ── Checkbox / Radio / Switch ─────────────────────────────────────────────
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: tk.b300, padding: 6, borderRadius: 5, transition: 'all 0.15s',
                    '&.Mui-checked': { color: tk.p500 },
                    '&.MuiCheckbox-indeterminate': { color: tk.p500 },
                    '&:hover': { background: tk.p100, color: tk.p400 },
                    '& .MuiSvgIcon-root': { fontSize: 18 },
                },
            },
        },

        MuiRadio: {
            styleOverrides: {
                root: { color: tk.b300, padding: 6, '&.Mui-checked': { color: tk.p500 }, '&:hover': { background: tk.p100 }, '& .MuiSvgIcon-root': { fontSize: 18 } },
            },
        },

        MuiSwitch: {
            styleOverrides: {
                // ✅ Do NOT override root width/height/padding — MUI calculates
                //    thumb position from these. Custom values break the circle shape.
                track: {
                    background: tk.b200,
                    borderRadius: 12,
                    opacity: '1 !important',
                    border: `1px solid ${tk.b200}`,
                    transition: 'background 0.2s',
                },
                thumb: {
                    background: '#fff',
                    boxShadow: `0 1px 4px rgba(0,0,0,0.18)`,
                    // ✅ No custom width/height — let MUI set correct thumb size per variant
                },
                switchBase: {
                    '&.Mui-checked': {
                        // ✅ No custom transform — MUI calculates translateX from root width
                        '& + .MuiSwitch-track': {
                            background: `linear-gradient(135deg, ${tk.p500}, ${tk.p400})`,
                            borderColor: 'transparent',
                            opacity: '1 !important',
                        },
                    },
                },
            },
        },

        // ── Table ─────────────────────────────────────────────────────────────────
        MuiTable: {
            defaultProps: { size: 'small' },
            styleOverrides: { root: { background: tk.bg1 } },
        },

        MuiTableContainer: {
            styleOverrides: {
                root: { background: tk.bg1, border: `1px solid ${tk.b100}`, borderRadius: 14, overflow: 'hidden', boxShadow: tk.s2 },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    position: 'sticky', top: 0, zIndex: 5,
                    '& .MuiTableCell-head': {
                        background: tk.bg2, color: tk.t300, fontFamily: body, fontWeight: 700,
                        fontSize: '0.625rem', letterSpacing: '0.09em', textTransform: 'uppercase',
                        borderBottom: `1px solid ${tk.b100}`, padding: '10px 14px', whiteSpace: 'nowrap',
                    },
                },
            },
        },

        MuiTableBody: {
            styleOverrides: {
                root: {
                    '& .MuiTableRow-root': {
                        transition: 'background 0.12s',
                        '&:nth-of-type(even)': { background: tk.bg0 },
                        '&:hover': { background: `${tk.bg2} !important` },
                        '&.Mui-selected': {
                            background: `${tk.p50} !important`,
                            '&:hover': { background: `${alpha(tk.p500, 0.07)} !important` },
                        },
                    },
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: { fontFamily: body, borderBottom: `1px solid ${tk.b100}`, color: tk.t700, fontSize: '0.8125rem', padding: '11px 14px', verticalAlign: 'middle', lineHeight: 1.4 },
                head: { fontWeight: 700, color: tk.t300, fontSize: '0.625rem' },
                sizeSmall: { padding: '9px 14px' },
                paddingCheckbox: { padding: '0 0 0 14px', width: 44 },
            },
        },

        MuiTableRow: {
            styleOverrides: { root: { '&:last-child .MuiTableCell-body': { borderBottom: 'none' } } },
        },

        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    color: tk.t300, fontWeight: 700, fontSize: '0.625rem', letterSpacing: '0.09em', textTransform: 'uppercase', transition: 'color 0.15s',
                    '&:hover': { color: tk.t700 },
                    '&.Mui-active': { color: tk.p500, '& .MuiTableSortLabel-icon': { color: `${tk.p500} !important` } },
                },
                icon: { fontSize: 14, color: tk.t300 },
            },
        },

        MuiTablePagination: {
            styleOverrides: {
                root: {
                    fontFamily: body, color: tk.t500, fontSize: '0.75rem',
                    borderTop: `1px solid ${tk.b100}`, background: tk.bg1,
                    '& .MuiTablePagination-select': { fontFamily: body, fontSize: '0.75rem', color: tk.t700, fontWeight: 500 },
                    '& .MuiTablePagination-selectLabel': { fontSize: '0.75rem', color: tk.t300 },
                    '& .MuiTablePagination-displayedRows': { fontSize: '0.75rem', color: tk.t500, fontWeight: 500 },
                    '& .MuiIconButton-root': {
                        color: tk.t300, borderRadius: 8, border: `1px solid ${tk.b100}`, width: 30, height: 30, margin: '0 2px',
                        '&:hover': { background: tk.bg2, color: tk.t700 },
                        '&.Mui-disabled': { color: tk.t100, borderColor: tk.b100 },
                    },
                },
            },
        },

        // ── Chip ──────────────────────────────────────────────────────────────────
        MuiChip: {
            styleOverrides: {
                root: { fontFamily: body, borderRadius: 20, fontSize: '0.6875rem', fontWeight: 700, height: 24, letterSpacing: '0.01em', border: '1px solid', transition: 'all 0.15s' },
                filled: { background: tk.bg2, color: tk.t500, borderColor: tk.b100, '&:hover': { background: tk.bg3 } },
                outlined: { borderColor: tk.b200, color: tk.t500, '&:hover': { background: tk.bg2 } },
                colorPrimary: { background: tk.p100, color: tk.p500, borderColor: alpha(tk.p500, 0.22) },
                colorSuccess: { background: tk.greenBg, color: tk.green, borderColor: tk.greenBrd },
                colorWarning: { background: tk.amberBg, color: tk.amber, borderColor: tk.amberBrd },
                colorError: { background: tk.redBg, color: tk.red, borderColor: tk.redBrd },
                colorInfo: { background: tk.blueBg, color: tk.blue, borderColor: tk.blueBrd },
                deleteIcon: { color: 'inherit', opacity: 0.5, fontSize: 14, '&:hover': { opacity: 0.9 } },
                label: { padding: '0 10px' },
                labelSmall: { padding: '0 8px', fontSize: '0.625rem' },
            },
        },

        // ── List & Nav ────────────────────────────────────────────────────────────
        MuiList: {
            defaultProps: { dense: true },
            styleOverrides: { root: { padding: '4px 0' } },
        },

        MuiListItem: { defaultProps: { dense: true } },

        MuiListItemButton: {
            styleOverrides: {
                root: {
                    fontFamily: body, borderRadius: 9, margin: '1px 8px', padding: '8px 10px',
                    color: tk.t500, fontSize: '0.8125rem', transition: 'all 0.14s', border: '1px solid transparent',
                    '&:hover': { background: tk.bg2, color: tk.t900, borderColor: tk.b100 },
                    '&.Mui-selected': {
                        background: tk.p100, borderColor: alpha(tk.p500, 0.18), color: tk.p500, fontWeight: 600,
                        '&:hover': { background: alpha(tk.p500, 0.10) },
                        '& .MuiListItemIcon-root': { color: tk.p500 },
                    },
                },
            },
        },

        MuiListItemIcon: {
            styleOverrides: { root: { color: tk.t300, minWidth: 34, '& .MuiSvgIcon-root': { fontSize: 18 } } },
        },

        MuiListItemText: {
            styleOverrides: {
                primary: { fontFamily: body, fontSize: '0.8125rem', fontWeight: 500, color: 'inherit', lineHeight: 1.4 },
                secondary: { fontFamily: body, fontSize: '0.6875rem', color: tk.t300, lineHeight: 1.4 },
            },
        },

        MuiListSubheader: {
            styleOverrides: {
                root: { fontFamily: body, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tk.t100, lineHeight: 1, padding: '14px 18px 7px', background: 'transparent' },
            },
        },

        // ── Menu ──────────────────────────────────────────────────────────────────
        MuiMenu: {
            styleOverrides: {
                paper: { background: tk.bg1, border: `1px solid ${tk.b200}`, borderRadius: 12, boxShadow: tk.s4, minWidth: 170 },
                list: { padding: '6px 5px' },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontFamily: body, borderRadius: 7, padding: '7px 12px', fontSize: '0.8125rem', color: tk.t700, margin: '1px 0', minHeight: 'unset', transition: 'all 0.12s',
                    '&:hover': { background: tk.bg2, color: tk.t900 },
                    '&.Mui-selected': { background: tk.p100, color: tk.p500, fontWeight: 600, '&:hover': { background: alpha(tk.p500, 0.10) } },
                    '&.Mui-disabled': { color: tk.t100, opacity: 1 },
                },
            },
        },

        MuiPopover: {
            styleOverrides: { paper: { background: tk.bg1, border: `1px solid ${tk.b200}`, borderRadius: 12, boxShadow: tk.s4 } },
        },

        // ── Dialog ────────────────────────────────────────────────────────────────
        MuiDialog: {
            styleOverrides: {
                paper: { background: tk.bg1, border: `1px solid ${tk.b100}`, borderRadius: 16, boxShadow: tk.s5 },
            },
        },

        MuiDialogTitle: {
            styleOverrides: {
                root: { fontFamily: display, fontWeight: 800, fontSize: '1.0625rem', color: tk.t900, padding: '20px 24px 12px', letterSpacing: '-0.3px', borderBottom: `1px solid ${tk.b100}` },
            },
        },

        MuiDialogContent: {
            styleOverrides: { root: { padding: '18px 24px' } },
        },

        MuiDialogActions: {
            styleOverrides: { root: { padding: '12px 24px 20px', borderTop: `1px solid ${tk.b100}`, gap: 8 } },
        },

        MuiBackdrop: {
            styleOverrides: {
                root: { background: 'rgba(20,20,18,0.35)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' },
                invisible: { background: 'transparent', backdropFilter: 'none' },
            },
        },

        // ── Tabs ──────────────────────────────────────────────────────────────────
        MuiTabs: {
            styleOverrides: {
                root: { borderBottom: `1px solid ${tk.b100}`, minHeight: 44 },
                indicator: { background: `linear-gradient(90deg, ${tk.p500}, ${tk.p400})`, height: 2, borderRadius: '2px 2px 0 0' },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none', fontFamily: body, fontWeight: 500, fontSize: '0.8125rem',
                    color: tk.t500, padding: '10px 16px', minWidth: 0, minHeight: 44, transition: 'color 0.15s',
                    '&.Mui-selected': { color: tk.p500, fontWeight: 700 },
                    '&:hover': { color: tk.t900 },
                },
            },
        },

        // ── Accordion ─────────────────────────────────────────────────────────────
        MuiAccordion: {
            defaultProps: { disableGutters: true, elevation: 0 },
            styleOverrides: {
                root: {
                    background: tk.bg1, border: `1px solid ${tk.b100}`, borderRadius: '12px !important', marginBottom: 8,
                    transition: 'border-color 0.18s, box-shadow 0.18s',
                    '&::before': { display: 'none' },
                    '&.Mui-expanded': { borderColor: alpha(tk.p500, 0.25), boxShadow: tk.s1 },
                },
            },
        },

        MuiAccordionSummary: {
            styleOverrides: {
                root: { padding: '0 18px', minHeight: 48, color: tk.t900, fontFamily: body, fontWeight: 600, fontSize: '0.8125rem', '&.Mui-expanded': { minHeight: 48 } },
                content: { margin: '12px 0', '&.Mui-expanded': { margin: '12px 0' } },
                expandIconWrapper: { color: tk.t300, '&.Mui-expanded': { color: tk.p500 } },
            },
        },

        MuiAccordionDetails: {
            styleOverrides: { root: { padding: '8px 18px 16px', borderTop: `1px solid ${tk.b100}`, color: tk.t500, fontSize: '0.8125rem', lineHeight: 1.6 } },
        },

        // ── Alert ─────────────────────────────────────────────────────────────────
        MuiAlert: {
            styleOverrides: {
                root: { fontFamily: body, borderRadius: 10, fontSize: '0.8125rem', border: '1px solid', alignItems: 'flex-start', padding: '10px 14px' },
                standardSuccess: { background: tk.greenBg, borderColor: tk.greenBrd, color: '#064e3b', '& .MuiAlert-icon': { color: tk.green } },
                standardWarning: { background: tk.amberBg, borderColor: tk.amberBrd, color: '#78350f', '& .MuiAlert-icon': { color: tk.amber } },
                standardError: { background: tk.redBg, borderColor: tk.redBrd, color: '#7f1d1d', '& .MuiAlert-icon': { color: tk.red } },
                standardInfo: { background: tk.blueBg, borderColor: tk.blueBrd, color: '#0c4a6e', '& .MuiAlert-icon': { color: tk.blue } },
                icon: { padding: '1px 0 0', fontSize: 18 },
                message: { padding: 0 },
                action: { padding: '0 0 0 8px', alignItems: 'flex-start', paddingTop: 1 },
            },
        },

        MuiAlertTitle: {
            styleOverrides: { root: { fontFamily: body, fontWeight: 700, fontSize: '0.8125rem', marginBottom: 3 } },
        },

        // ── Tooltip ───────────────────────────────────────────────────────────────
        MuiTooltip: {
            defaultProps: { arrow: true, enterDelay: 400 },
            styleOverrides: {
                tooltip: { fontFamily: body, background: tk.t900, color: '#f7f7f5', fontSize: '0.6875rem', fontWeight: 500, borderRadius: 7, padding: '5px 10px', boxShadow: tk.s3, maxWidth: 240 },
                arrow: { color: tk.t900 },
            },
        },

        // ── Snackbar ──────────────────────────────────────────────────────────────
        MuiSnackbarContent: {
            styleOverrides: {
                root: { fontFamily: body, background: tk.t900, color: '#f7f7f5', borderRadius: 12, fontSize: '0.8125rem', boxShadow: tk.s4, padding: '10px 16px' },
                action: { color: tk.p300 },
            },
        },

        // ── Progress ──────────────────────────────────────────────────────────────
        MuiLinearProgress: {
            styleOverrides: {
                root: { borderRadius: 5, background: tk.bg3, height: 5 },
                bar: { background: `linear-gradient(90deg, ${tk.p500}, ${tk.p400})`, borderRadius: 5 },
            },
        },

        MuiCircularProgress: {
            defaultProps: { size: 24, thickness: 4 },
            styleOverrides: { circle: { strokeLinecap: 'round' } },
        },

        // ── Skeleton ──────────────────────────────────────────────────────────────
        MuiSkeleton: {
            defaultProps: { animation: 'wave' },
            styleOverrides: {
                root: { background: tk.bg3, borderRadius: 8, '&::after': { background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' } },
                text: { borderRadius: 6 },
                rectangular: { borderRadius: 10 },
            },
        },

        // ── Avatar ────────────────────────────────────────────────────────────────
        MuiAvatar: {
            styleOverrides: {
                root: { fontFamily: body, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '-0.3px', borderRadius: 9, background: tk.p100, color: tk.p500, border: `1.5px solid ${alpha(tk.p500, 0.18)}` },
                rounded: { borderRadius: 9 },
                circular: { borderRadius: '50%', border: 'none' },
                colorDefault: { background: tk.bg2, color: tk.t500, border: `1.5px solid ${tk.b200}` },
            },
        },

        MuiAvatarGroup: {
            styleOverrides: { avatar: { border: `2px solid ${tk.bg1}`, fontSize: '0.625rem', fontWeight: 700 } },
        },

        // ── Badge ─────────────────────────────────────────────────────────────────
        MuiBadge: {
            styleOverrides: {
                badge: { fontFamily: body, fontWeight: 700, fontSize: '0.625rem', minWidth: 18, height: 18, padding: '0 5px', lineHeight: '18px', border: `2px solid ${tk.bg1}` },
                colorError: { background: tk.red },
                colorPrimary: { background: tk.p500 },
                colorSuccess: { background: tk.green },
                colorWarning: { background: tk.amber },
                dot: { width: 8, height: 8, minWidth: 8, padding: 0 },
            },
        },

        // ── Breadcrumbs ───────────────────────────────────────────────────────────
        MuiBreadcrumbs: {
            styleOverrides: {
                root: { fontFamily: body, fontSize: '0.75rem' },
                separator: { color: tk.t100, margin: '0 4px' },
                li: {
                    '& .MuiTypography-root': { fontSize: '0.75rem', fontWeight: 500, color: tk.t300 },
                    '&:last-child .MuiTypography-root': { color: tk.t700, fontWeight: 600 },
                    '& a': { color: tk.t300, textDecoration: 'none', '&:hover': { color: tk.t700 } },
                },
            },
        },

        // ── Stepper ───────────────────────────────────────────────────────────────
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: tk.bg3, border: `1.5px solid ${tk.b200}`, borderRadius: '50%', width: 24, height: 24,
                    '&.Mui-active': { color: tk.p500, border: 'none', filter: `drop-shadow(0 0 5px ${alpha(tk.p500, 0.35)})` },
                    '&.Mui-completed': { color: tk.green, border: 'none' },
                },
                text: { fill: tk.t300, fontSize: '0.625rem', fontWeight: 700, fontFamily: body },
            },
        },

        MuiStepLabel: {
            styleOverrides: {
                label: { fontFamily: body, fontSize: '0.8125rem', color: tk.t300, '&.Mui-active': { color: tk.t900, fontWeight: 600 }, '&.Mui-completed': { color: tk.t500 } },
                iconContainer: { paddingRight: 10 },
            },
        },

        MuiStepConnector: {
            styleOverrides: { line: { borderColor: tk.b100 } },
        },

        // ── Divider ───────────────────────────────────────────────────────────────
        MuiDivider: {
            styleOverrides: {
                root: { borderColor: tk.b100 },
                withChildren: {
                    '&::before, &::after': { borderTopColor: tk.b100 },
                    '& .MuiDivider-wrapper': { fontFamily: body, fontSize: '0.6875rem', color: tk.t100, padding: '0 12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
                },
            },
        },

        // ── Typography ────────────────────────────────────────────────────────────
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.anchor-link': { cursor: 'pointer', color: tk.p500, textDecoration: 'underline', textDecorationColor: alpha(tk.p500, 0.3), textUnderlineOffset: '2px', transition: 'text-decoration-color 0.15s', '&:hover': { textDecorationColor: tk.p500 } },
                    '&.section-label': { fontFamily: body, fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: tk.t100 },
                    '&.stat-number': { fontFamily: display, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1, color: tk.t900 },
                },
            },
        },

        // ── Pagination ────────────────────────────────────────────────────────────
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    fontFamily: body, fontWeight: 600, fontSize: '0.75rem', borderRadius: 8, border: `1.5px solid ${tk.b100}`,
                    color: tk.t500, minWidth: 30, height: 30, transition: 'all 0.14s',
                    '&:hover': { background: tk.bg2, borderColor: tk.b200, color: tk.t900 },
                    '&.Mui-selected': { background: `linear-gradient(135deg, ${tk.p500}, ${tk.p400})`, borderColor: 'transparent', color: '#fff', boxShadow: tk.sBtn, '&:hover': { background: `linear-gradient(135deg, #1547c0, ${tk.p500})` } },
                    '&.Mui-disabled': { color: tk.t100, borderColor: tk.b100 },
                },
                ellipsis: { border: 'none', color: tk.t300 },
            },
        },

        // ── Slider ────────────────────────────────────────────────────────────────
        MuiSlider: {
            styleOverrides: {
                root: { color: tk.p500, height: 4, padding: '13px 0' },
                track: { background: `linear-gradient(90deg, ${tk.p500}, ${tk.p400})`, border: 'none', height: 4, borderRadius: 2 },
                rail: { background: tk.bg3, height: 4, borderRadius: 2 },
                thumb: { width: 16, height: 16, background: '#fff', border: `2px solid ${tk.p500}`, boxShadow: tk.s2, '&:hover': { boxShadow: `0 0 0 6px ${tk.pGlow2}` }, '&.Mui-active': { boxShadow: `0 0 0 8px ${tk.pGlow2}` } },
                valueLabel: { background: tk.t900, borderRadius: 7, fontSize: '0.6875rem', fontFamily: body, fontWeight: 600 },
            },
        },

    }, // end components
}); // end createTheme

// export const theme = createTheme({
//     palette: {
//         mode: "light",

//         primary: {
//             main: "#2563eb", // modern SaaS blue
//         },

//         secondary: {
//             main: "#64748b", // soft slate
//         },
//         gradients: {
//             primary: 'linear-gradient(135deg, rgb(129, 251, 184) 10%, rgb(40, 199, 111) 100%)',
//             secondary: 'linear-gradient(to bottom, #45484d 0%,#000000 100%)'
//         },
//         background: {
//             default: "#f1f5f9", // app background
//             paper: "#ffffff",   // cards
//         },

//         success: {
//             main: "#22c55e",
//         },

//         warning: {
//             main: "#f59e0b",
//         },

//         error: {
//             main: "#ef4444",
//         },

//         text: {
//             primary: "#0f172a",
//             secondary: "#64748b",
//         },
//     },

//     shape: {
//         borderRadius: 12,
//     },

//     typography: {
//         fontFamily: `"Inter", "Segoe UI", sans-serif`,
//         fontSize: 14,

//         h4: {
//             fontWeight: 600,
//         },

//         h5: {
//             fontWeight: 600,
//         },

//         button: {
//             textTransform: "none",
//             fontWeight: 500,
//         }
//     },

//     components: {

//         MuiCard: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 16,
//                     boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
//                 },
//             },
//         },

//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 10,
//                     padding: "8px 18px",
//                 },
//                 containedPrimary: {
//                     boxShadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
//                 }
//             }
//         },

//         MuiTable: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: "#ffffff",
//                 }
//             }
//         },

//         MuiTableRow: {
//             styleOverrides: {
//                 root: {
//                     transition: "all 0.2s ease",
//                     "&:hover": {
//                         backgroundColor: "#f8fafc",
//                     }
//                 }
//             }
//         },

//         MuiTableHead: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: "#f1f5f9",
//                 }
//             }
//         },

//         MuiChip: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 8,
//                     fontWeight: 500,
//                 }
//             }
//         },

//         MuiOutlinedInput: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 10,
//                     backgroundColor: "#ffffff",
//                 }
//             }
//         },

//         MuiPaper: {
//             styleOverrides: {
//                 root: {
//                     backgroundImage: "none",
//                 }
//             }
//         }
//     }

// });


// export const theme = createTheme({
//     palette: {
//         type: 'dark',
//         primary: {
//             main: '#00a8e8',
//             contrastText: '#fff',
//         },
//         secondary: {
//             main: '#45484d',
//             contrastText: '#fff',
//         },
//         gradients: {
//             primary: 'linear-gradient(135deg, rgb(129, 251, 184) 10%, rgb(40, 199, 111) 100%)',
//             secondary: 'linear-gradient(to bottom, #45484d 0%,#000000 100%)'
//         }
//     },

//     typography: {
//         fontSize: 13,
//         fontFamily: ['"omnes-pro"', '"Segoe UI"', 'sans-serif'].join(','),
//     },

//     components: {
//         MuiTypography: {
//             styleOverrides: {
//                 root: {
//                     letterSpacing: 1,
//                     '&.anchor-link': {
//                         cursor: 'pointer',
//                         textDecoration: 'underline',
//                         '&:hover': {
//                             textDecoration: 'none'
//                         }
//                     }
//                 },
//             },
//         },
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     textTransform: 'none',
//                     '&[data-round="true"]': {
//                         minWidth: 150,
//                         borderRadius: 25
//                     }
//                 },
//             },
//         },
//         MuiFilledInput: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiFormControl: {
//             styleOverrides: {
//                 root: {
//                     borderRadius: 4,
//                     '& .MuiOutlinedInput-root': {
//                         backgroundColor: '#FFF'
//                     },
//                     '& .MuiFormHelperText-sizeMedium': {
//                         fontSize: '1rem',
//                         marginLeft: 0,
//                     }
//                 },
//             },
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiFormHelperText: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiIconButton: {
//             defaultProps: {
//                 size: 'small',
//             },
//         },
//         MuiInputBase: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiInputLabel: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiListItem: {
//             defaultProps: {
//                 dense: true,
//             },
//         },
//         MuiOutlinedInput: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiFab: {
//             defaultProps: {
//                 size: 'small',
//             },
//         },
//         MuiTable: {
//             defaultProps: {
//                 size: 'small',
//             },
//         },
//         MuiTextField: {
//             defaultProps: {
//                 margin: 'dense',
//             },
//         },
//         MuiToolbar: {
//             defaultProps: {
//                 variant: 'dense',
//             },
//         }

//     },
// });