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
                },
                {
                    props: {
                        variant: "PackageActionButton1"
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
            fontFamily: "'SF Pro Text'",
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
        },
        parameterGrid: {
            fontFamily: "'Rubik'", 
            fontStyle: "normal", 
            fontWeight: 400, 
            fontSize: "16px", 
            lineHeight: "116.7%"
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
            }),
            //
            navbarBgColor: palette.augmentColor({
                color:{
                    main: '#A6CEE3'
                }
            }),

            // Application Card All Colors
            cardTextColor: palette.augmentColor({
                color: {
                    main: '#242424'
                }
            }),
            carHeaderColor: palette.augmentColor({
                color:{
                    main: '#121312'
                }
            }),
            cardBackgroundColor: palette.augmentColor({
                color:{
                    main: '#FFFFFF;'
                }
            }),
            disableCardBackgroundColor: palette.augmentColor({
                color:{
                    main: '#F3F3F3'
                }
            }),
            cardInfoColor: palette.augmentColor({
                color:{
                    main: '#5B5B5B'
                }
            }),
            cardInfoFormCreatedByStringColor: palette.augmentColor({
                color:{
                    main: '#253858'
                }
            }),
            cardInfoFormatCreatedOnString: palette.augmentColor({
                color:{
                    main: '#42526e'
                }
            }),
            cardIconButtonBackgroundColor: palette.augmentColor({
                color:{
                    main: '#A4CAF0'
                }
            }),
            cardIconBtn1HoverBgColor: palette.augmentColor({
                color:{
                    main: '#0AA1DD'
                }
            }),
            cardIconBtn1HoverColor: palette.augmentColor({
                color:{
                    main: '#FFFFFF'
                }
            }),
            cardDeleteBtnBgColor: palette.augmentColor({
                color:{
                    main: '#F4F4F4'
                }
            }),
            cardNumUserTextColor: palette.augmentColor({
                color:{
                    main: '#AA9BBE'
                }
            }),

            //build action form
            buildActionDrawerCardBgColor: palette.augmentColor({
                color:{
                    main: '#F5F9FF'
                }
            }),
            ActionCardBgColor: palette.augmentColor({
                color:{
                    main: '#FFFFFF'
                }
            }),
            ActionCardBgColor2: palette.augmentColor({
                color:{
                    main: '#CDE1ED'
                }
            }),
            ActionDefinationHeroCardBgColor: palette.augmentColor({
                color: {
                    main: '#F5F9FF'
                }
            }),
            ActionDefinationHeroTextColor1: palette.augmentColor({
                color:{
                    main: '#253858'
                }
            }),
            ActionDefinationTextPanelBgColor: palette.augmentColor({
                color:{
                    main: '#E8E8E8'
                }
            }),
            ActionDefinationTextPanelBgHoverColor: palette.augmentColor({
                color:{
                    main: '#E3E3E3'
                }
            }),
            ActionConfigComponentBtnColor1: palette.augmentColor({
                color:{
                    main: '#56D280'
                }
            }),
            ActionConfigComponentBtnColor2: palette.augmentColor({
                color:{
                    main: '#F178B6'
                }
            }),
            ActionText1Color: palette.augmentColor({
                color:{
                    main: '#A6ABBD'
                }
            }),
            ActionConfigDialogBgColor: palette.augmentColor({
                color:{
                    main: '#66748A'
                }
            }),


            // DATA Connecion grid

            statusCardBgColor1: palette.augmentColor({
                color:{
                    main: '#C3FDED'
                }
            }),
            statusCardBgColor2: palette.augmentColor({
                color:{
                    main: '#ffbdbd'
                }
            }),
            statusCardBgColor3: palette.augmentColor({
                color:{
                    main: '#FCF4AC'
                }
            }),
            allTableTextfieldbgColor1: palette.augmentColor({
                color:{
                    main: '#E0E5EC'
                }
            }),
            syncingLogoColor1: palette.augmentColor({
                color:{
                    main: '#000000'
                }
            }),
            syncingLogoColor2: palette.augmentColor({
                color:{
                    main: '#FA9705'
                }
            }),
            syncStatusColor1: palette.augmentColor({
                color:{
                    main: '#00AA11'
                }
            }),
            syncStatusColor2: palette.augmentColor({
                color:{
                    main: '#FF0000'
                }
            }),

            dialogueTextColor1: palette.augmentColor({
                color:{
                    main: '#A7A9AC'
                }
            }),

            typographyColor1: palette.augmentColor({
                color:{
                    main: '#353535'
                }
            }),
            typographyColor2: palette.augmentColor({
                color:{
                    main: '#EDF0F4'
                }
            }),
            typographyColor3: palette.augmentColor({
                color:{
                    main: '#2C2D30'
                }
            }),
            executionCardBgColor1: palette.augmentColor({
                color:{
                    main: '#8C0000'
                }
            }),
            executionCardBgColor2: palette.augmentColor({
                color:{
                    main: '#32E6B7'
                }
            }),
            executionCardBgColor3: palette.augmentColor({
                color:{
                    main: '#DDDDDD'
                }
            }),
            linearProgressBgColor1: palette.augmentColor({
                color:{
                    main: '#FFE700'
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
            },
            // navbar
            navbarBgColor:{
                main : '#fff'
            },


            //application card
            cardTextColor: {
                main: '#E6EAE7'
            },
            cardHeaderColor: {
                main: '#E6EDE8'
            },
            cardBackgroundColor:{
                main: '#054D3A '
            },
            disableCardBackgroundColor:{
                main: '#051A63'
            },
            cardInfoColor:{
                main: '#5B5B5B'
            },
            cardInfoFormCreatedByStringColor:{
                main: 'ffffff'
            },
            cardInfoFormatCreatedOnString:{
                main: '#E5D6EB'
            },
            cardIconButtonBackgroundColor:{
                main: '#054D3A'
            },
            cardIconBtn1HoverBgColor:{
                main: '#ffffff'
            },
            cardDeleteBtnBgColor:{
                main: '#ffffff'
            },
            cardNumUserTextColor:{
                main: '#ffffff'
            },


            //ACTIONS FORMS
            buildActionDrawerCardBgColor:{
                main: '#ffffff'
            },
            ActionCardBgColor:{
                main: '#fff'
            },
            ActionCardBgColor2:{
                main: '#fff'
            },
            ActionDefinationHeroCardBgColor:{
                main: '#fff'
            },
            ActionDefinationHeroTextColor1:{
                main: '#fff'
            },
            ActionDefinationTextPanelBgColor:{
                main: '#fff'
            },
            ActionDefinationTextPanelBgHoverColor:{
                main: '#fff'
            },
            ActionConfigComponentBtnColor1:{
                main: '#fff'
            },
            ActionConfigComponentBtnColor2:{
                main: '#fff'
            },
            ActionText1Color:{
                main: '#fff'
            },
            ActionConfigDialogBgColor:{
                main: '#fff'
            },
            statusCardBgColor1:{
                main: '#fff'
            },
            statusCardBgColor2:{
                main: '#fff'
            },
            statusCardBgColor3:{
                main: '#fff'
            },
            allTableTextfieldbgColor1:{
                color: '#E0E5EC'
            },
            syncingLogoColor1:{
                color: '#000000'
            },
            syncingLogoColor2:{
                color: '#FA9705'
            },
            syncStatusColor1:{
                color: '#00AA11'
            },
            syncStatusColor2:{
                color: '#FF0000'
            },
            dialogueTextColor1:{
                color: '#A7A9AC'
            },
            typographyColor1:{
                main: '#353535'
            },
            typographyColor2:{
                main: '#EDF0F4'
            },
            typographyColor3:{
                main: '#2C2D30'
            },
            executionCardBgColor1:{
                main: '#8C0000'
            },
            executionCardBgColor2:{
                main: '#32E6B7'
            },
            executionCardBgColor3:{
                main: '#DDDDDD'
            },
            linearProgressBgColor1:{
                main: '#FFE700'
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
            },

            // navbar
            navbarBgColor:{
                main: '#0b4f4b'
            },
            //application card
            cardTextColor: {
                main: '#E6EAE7'
            },
            cardHeaderColor: {
                main: '#E6EDE8'
            },
            cardBackgroundColor:{
                main: '#054D3A '
            },
            disableCardBackgroundColor:{
                main: '#051A63'
            },
            cardInfoColor:{
                main: '#acd8ff'
            },
            cardInfoFormCreatedByStringColor:{
                main: '#ffffff'
            },
            cardInfoFormatCreatedOnString:{
                main: '#E5D6EB'
            },
            cardIconButtonBackgroundColor:{
                main: '#054D3A'
            },
            cardIconBtn1HoverBgColor:{
                main: '#ffffff'
            },
            cardDeleteBtnBgColor:{
                main: '#ffffff'
            },
            cardNumUserTextColor:{
                main: '#ffffff'
            },


            //Action bulid
            buildActionDrawerCardBgColor:{
                main: '#ffffff'
            },
            ActionCardBgColor:{
                main: '#171201'
            },
            ActionCardBgColor2:{
                main: '#fff'
            },
            ActionDefinationHeroCardBgColor:{
                main: '#fff'
            },
            ActionDefinationHeroTextColor1:{
                main: '#fff'
            },
            ActionDefinationTextPanelBgColor:{
                main: '#300b28'
            },
            ActionDefinationTextPanelBgHoverColor:{
                main: '#fff'
            },
            ActionConfigComponentBtnColor1:{
                main: '#fff'
            },
            ActionConfigComponentBtnColor2:{
                main: '#fff'
            },
            ActionText1Color:{
                main: '#fff'
            },
            ActionConfigDialogBgColor:{
                main: '#fff'
            },

            // data connection grid
            statusCardBgColor1:{
                main: '#014213'
            },
            statusCardBgColor2:{
                main: '#450101'
            },
            statusCardBgColor3:{
                main: '#cca404'
            },
            allTableTextfieldbgColor1:{
                color: '#E0E5EC'
            },
            syncingLogoColor1:{
                color: '#000000'
            },
            syncingLogoColor2:{
                color: '#FA9705'
            },
            syncStatusColor1:{
                color: '#00AA11'
            },
            syncStatusColor2:{
                color: '#FF0000'
            },
            dialogueTextColor1:{
                color: '#A7A9AC'
            },
            typographyColor1:{
                main: '#353535'
            },
            typographyColor2:{
                main: '#EDF0F4'
            },
            typographyColor3:{
                main: '#2C2D30'
            },
            executionCardBgColor1:{
                main: '#8C0000'
            },
            executionCardBgColor2:{
                main: '#32E6B7'
            },
            executionCardBgColor3:{
                main: '#DDDDDD'
            },
            linearProgressBgColor1:{
                main: '#FFE700'
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
