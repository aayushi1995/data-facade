import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import merge from 'lodash/merge';
import { THEMES } from '../../data_manager/constants';
import { darkShadows, lightShadows } from './shadows';

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
            },
            variants: [
                {
                    props: {
                        variant: "ModuleHeaderButton1"
                    },
                    style: {
                        backgroundColor: '#000000',
                        color: "#FFFFFF",
                        borderRadius: '10px', 
                        width: "250px",
                        height: "50px",
                        '&:hover': {
                            backgroundColor: '#555555',
                            color: "#FFFFFF",
                        }
                    }
                },
                {
                    props: {
                        variant: "ModuleHeaderButton2"
                    },
                    style: {
                        background: "#42C2FF",
                        color: "#FFFFFF",
                        borderRadius: '10px', 
                        width: "250px",
                        height: "50px",
                        '&:hover': {
                            backgroundColor: '#0AA1DD',
                            color: "#FFFFFF",
                        }
                    }
                }
            ]
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
        actionCardHeader: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "157%",
            letterSpacing: "0.1px",
            color: "#253858"
        },
        actionCardSubHeader: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "143%",
            letterSpacing: "0.15px",
            color: "rgba(66, 82, 110, 0.86)"
        },
        applicationActionCard: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "266%",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            color: "rgba(66, 82, 110, 0.86)"
        },
        tabHeader: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "24px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            opacity: 0.7
        },
        allApplicationViewSectionHeader: {
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "160%",
            letterSpacing: "0.15px",
            color: "#304FFE"
        },
        wizardText: {
            fontFamily: "'SF Compact Display'",
            fontStyle: "normal",
            fontWeight: 900,
            fontSize: "25px",
            lineHeight: "45px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            color: "#A7A9AC"
        },
        wizardHeader: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "150%",
            letterSpacing: "0.15px",
            color: "#253858"
        },
        wrapInHeader: {
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "160%",
            letterSpacing: "0.15px",
            color: "#253858"
        },
        actionDefinitionSummaryStatValue: {
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "48.8571px",
            lineHeight: "133.4%",
            color: "#253858"
        },
        actionDefinitionSummaryStatLabel: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "24.4286px",
            lineHeight: "166%",
            letterSpacing: "0.814286px",
            color: "rgba(66, 82, 110, 0.86)"
        },
        statText: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "157%"
        },
        tableStatLabel: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: "266%",
            color: "rgba(66, 82, 110, 0.86)"
        },
        tableStatValue: {
            fontFamily: "'SF Pro Display'",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "25px",
            lineHeight: "133.4%"
        },
        higlLevelInfoHeader: {
            fontFamily: "'Nunito'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "24px",
            lineHeight: "24px"
        },
        tableBrowserContent: {
            fontFamily: "'Rubik'",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "116.7%"
        },
        tableBrowserHealthCell: {
            fontFamily: "'SF Pro Text'",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "157%",
            letterSpacing: "0.1px",
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
            },
            typography: {
                tabHeader: {
                    color: '#5664D2'
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
                main: '#5664D2'
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
