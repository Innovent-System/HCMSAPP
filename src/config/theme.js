import { createTheme } from '@mui/material/styles';

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
        },
        
    },
});
