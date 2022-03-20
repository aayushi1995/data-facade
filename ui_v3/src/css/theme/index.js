import merge from 'lodash/merge';
import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {THEMES} from '../../data_manager/constants';
import {darkShadows, lightShadows} from './shadows';
import { borderRadius } from '@mui/system';

const { palette } = createTheme()

const baseOptions = {
    direction: 'ltr',
    components: {
        MuiAvatar: {
            styleOverrides: {
                fallback: {
                    height: '75%',
                    width: '75%'
                }
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                row: {
                    cursor: "pointer"
                },
                root: {
                    boxShadow: lightShadows[23]
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    height: "64px",
                    zIndex: "50!important"
                }}
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box'
                },
                html: {
                    MozOsxFontSmoothing: 'grayscale',
                    WebkitFontSmoothing: 'antialiased',
                    height: '100%',
                    width: '100%'
                },
                body: {
                    height: '100%'
                },
                '#root': {
                    height: '100%'
                },
                '#nprogress .bar': {
                    zIndex: '2000 !important'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: '#FFFFFF',
                    borderRadius: '10px'
                }
            }
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: {
                    variant: 'h6'
                }
            }
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 3,
                    overflow: 'hidden'
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 'auto',
                    marginRight: '16px'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                }
            }
        }
    },
    typography: {
        button: {
            fontWeight: 600
        },
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "SF Pro Text", "SF Pro Display"',
        h1: {
            fontWeight: 600,
            fontSize: '3.5rem'
        },
        h2: {
            fontWeight: 600,
            fontSize: '3rem'
        },
        h3: {
            fontWeight: 600,
            fontSize: '2.25rem'
        },
        h4: {
            fontWeight: 600,
            fontSize: '2rem'
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem'
        },
        h6: {
            fontWeight: 600,
            fontSize: '1.125rem'
        },
        overline: {
            fontWeight: 600
        },
        heroHeader: {
            fontFamily: "SF Pro Display",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "36px",
            lineHeight: "116.7%"
        },
        heroMeta: {
            fontFamily: "SF Pro Text",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "12px",
            lineHeight: "143%",
            letterSpacing: "0.15px",
            color: "rgba(66, 82, 110, 0.86)"
        },
        workflowActionCard: {
            fontFamily: 'SF Pro Text', 
            fontStyle: 'normal', 
            fontSize: '13.6054px', 
            lineHeight: '157%', 
            letterSpacing: '0.097px', 
            color: '#253858'
        },
        applicationActionCard: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "266%",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "rgba(66, 82, 110, 0.86)"
        }
    }
};

const themesOptions = {
    [THEMES.LIGHT]: {
        components: {
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        '&::placeholder': {
                            opacity: 0.86,
                            color: '#42526e'
                        }
                    }
                }
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        background: '#ffffff'
                    }
                }
            }
        },
        palette: {
            action: {
                active: '#6b778c'
            },
            background: {
                default: '#f4f5f7',
                paper: '#ffffff'
            },
            error: {
                contrastText: '#ffffff',
                main: '#f44336'
            },
            mode: 'light',
            primary: {
                contrastText: '#ffffff',
                main: '#5664d2'
            },
            success: {
                contrastText: '#ffffff',
                main: '#4caf50'
            },
            text: {
                primary: '#172b4d',
                secondary: '#6b778c'
            },
            warning: {
                contrastText: '#ffffff',
                main: '#ff9800'
            },
            lightBrown: palette.augmentColor({
                color: {
                    main: '#B0757C'
                }
            }),
            lightBlueDF: palette.augmentColor({
                color: {
                    main: '#A4CAF0'
                }
            })
        },
        shadows: lightShadows
    },
    [THEMES.DARK]: {
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
                    }
                }
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        background: '#222b36'
                    }
                }
            },
        },
        palette: {
            background: {
                default: '#171c24',
                paper: '#222b36'
            },
            divider: 'rgba(145, 158, 171, 0.24)',
            error: {
                contrastText: '#ffffff',
                main: '#f44336'
            },
            mode: 'dark',
            primary: {
                contrastText: '#ffffff',
                main: '#688eff'
            },
            success: {
                contrastText: '#ffffff',
                main: '#4caf50'
            },
            text: {
                primary: '#ffffff',
                secondary: '#919eab'
            },
            warning: {
                contrastText: '#ffffff',
                main: '#ff9800'
            }
        },
        shadows: darkShadows
    },
    [THEMES.NATURE]: {
        components: {
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid rgba(145, 158, 171, 0.24)'
                    }
                }
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        background: '#293142'
                    }
                }
            }
        },
        palette: {
            background: {
                default: '#1c2531',
                paper: '#293142'
            },
            divider: 'rgba(145, 158, 171, 0.24)',
            error: {
                contrastText: '#ffffff',
                main: '#f44336'
            },
            mode: 'dark',
            primary: {
                contrastText: '#ffffff',
                main: '#01ab56'
            },
            success: {
                contrastText: '#ffffff',
                main: '#4caf50'
            },
            text: {
                primary: '#ffffff',
                secondary: '#919eab'
            },
            warning: {
                contrastText: '#ffffff',
                main: '#ff9800'
            }
        },
        shadows: darkShadows
    }
};

export const createCustomTheme = (config = {}) => {
    let themeOptions = themesOptions[config.theme];
    if (!themeOptions) {
        console.warn(new Error(`The theme ${config.theme} is not valid`));
        themeOptions = themesOptions[THEMES.LIGHT];
    }

    let theme = createTheme(merge({}, baseOptions, themeOptions, {
        ...(config.roundedCorners && {
            shape: {
                borderRadius: 16
            }
        })
    }, {
        direction: config.direction
    }));

    if (config.responsiveFontSizes) {
        theme = responsiveFontSizes(theme);
    }

    return theme;
};
