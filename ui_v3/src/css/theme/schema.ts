import React from "react";


declare module '@mui/styles' {
    interface TypographyVariants {
      heroHeader: React.CSSProperties;
      heroMeta: React.CSSProperties;
      actionCardHeader: React.CSSProperties;
      actionCardSubHeader: React.CSSProperties
      allApplicationViewSectionHeader: React.CSSProperties,
      wizardText: React.CSSProperties,
      wizardHeader: React.CSSProperties,
      wrapInHeader: React.CSSProperties,
      actionDefinitionSummaryStatValue: React.CSSProperties,
      actionDefinitionSummaryStatLabel: React.CSSProperties,
      tableStatLabel: React.CSSProperties,
      tableStatValue: React.CSSProperties,
      higlLevelInfoHeader: React.CSSProperties,
      tableBrowserContent: React.CSSProperties,
      tableBrowserHealthCell: React.CSSProperties,
      parameterGrid: React.CSSProperties
    }
  
    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
      heroHeader?: React.CSSProperties;
      heroMeta?: React.CSSProperties;
      actionCardHeader?: React.CSSProperties;
      actionCardSubHeader?: React.CSSProperties;
      allApplicationViewSectionHeader?: React.CSSProperties,
      wizardText?: React.CSSProperties,
      wizardHeader?: React.CSSProperties,
      wrapInHeader?: React.CSSProperties,
      actionDefinitionSummaryStatValue?: React.CSSProperties,
      actionDefinitionSummaryStatLabel?: React.CSSProperties,
      statText?: React.CSSProperties,
      tableStatLabel?: React.CSSProperties,
      tableStatValue?: React.CSSProperties,
      higlLevelInfoHeader: React.CSSProperties,
      tableBrowserContent: React.CSSProperties,
      tableBrowserHealthCell: React.CSSProperties,
      parameterGrid: React.CSSProperties,
      executeActionName: React.CSSProperties
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        heroHeader: true;
        heroMeta: true;
        actionCardHeader: true;
        actionCardSubHeader: true;
        allApplicationViewSectionHeader: true;
        wizardText: true;
        wizardHeader: true,
        wrapInHeader: true,
        actionDefinitionSummaryStatValue: true,
        actionDefinitionSummaryStatLabel: true,
        statText: true,
        tableStatLabel: true,
        tableStatValue: true,
        higlLevelInfoHeader: true,
        tableBrowserContent: true,
        tableBrowserHealthCell: true,
        parameterGrid: true,
        executeActionName: true,
        executeActionSubtext: true,
        executeActionDescription: true,
        parameterInputField: true
    }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    ModuleHeaderButton1: true,
    ModuleHeaderButton2: true
  }
}

declare module "@mui/styles" {
  interface Palette {
    lightBrown: string;
    lightBlueDF: string;
    cardTextColor: string;
    cardHeaderColor: string;
    cardBackgroundColor: string;
    disableCardBackgroundColor: string;
    cardInfoColor: string;
    cardInfoFormCreatedByStringColor: string;
    cardInfoFormatCreatedOnString: string;
    cardIconButtonBackgroundColor: string;
    cardIconBtn1HoverBgColor: string;
    cardIconBtn1HoverColor: string;
    cardDeleteBtnBgColor: string;
    cardNumUserTextColor: string;
    buildActionDrawerCardBgColor: string;
    ActionCardBgColor: string;
    ActionCardBgColor2: string;
    ActionDefinationHeroCardBgColor: string;
    ActionDefinationHeroTextColor1: string;
    ActionDefinationTextPanelBgColor: string;
    ActionDefinationTextPanelBgHoverColor: string;
    ActionConfigComponentBtnColor1: string;
    ActionConfigComponentBtnColor2: string;
    ActionText1Color: string;
    ActionConfigDialogBgColor: string;
    navbarBgColor: string;
    statusCardBgColor1: string;
    statusCardBgColor2: string;
    statusCardBgColor3: string;
    allTableTextfieldbgColor1: string;
    syncingLogoColor1: string;
    syncingLogoColor2: string;
    syncStatusColor1: string;
    syncStatusColor2: string;
    dialogueTextColor1: string;
    typographyColor1: string;
    typographyColor2: string;
    typographyColor3: string;
    executionCardBgColor1: string;
    executionCardBgColor2: string;
    executionCardBgColor3: string;
    linearProgressBgColor1: string;
  }
  interface PaletteOptions {
    lightBrown?: string;
    lightBlueDF?: string;
    cardTextColor?: string;
    cardHeaderColor?: string;
    cardBackgrondColor?: string;
    disableCardBackgroundColor?: string;
    cardInfoColor?: string;
    cardInfoFormCreatedByStringColor?: string;
    cardInfoFormatCreatedOnString?: string;
    cardIconButtonBackgroundColor?: string;
    cardIconBtn1HoverBgColor?: string;
    cardIconBtn1HoverColor?: string;
    cardDeleteBtnBgColor?: string;
    cardNumUserTextColor?: string;
    buildActionDrawerCardBgColor?: string;
    ActionCardBgColor?: string;
    ActionCardBgColor2?: string;
    ActionDefinationHeroCardBgColor?: string;
    ActionDefinationHeroTextColor1?: string;
    ActionDefinationTextPanelBgColor?: string;
    ActionDefinationTextPanelBgHoverColor?: string;
    ActionConfigComponentBtnColor1?: string;
    ActionConfigComponentBtnColor2?: string;
    ActionText1Color?: string;
    ActionConfigDialogBgColor?: string;
    navbarBgColor?: string;
    statusCardBgColor1?: string;
    statusCardBgColor2?: string;
    statusCardBgColor3?: string;
    allTableTextfieldbgColor1?: string;
    syncingLogoColor1?: string;
    syncingLogoColor2?: string;
    syncStatusColor1?: string;
    syncStatusColor2?: string;
    dialogueTextColor1?: string;
    typographyColor1?: string;
    typographyColor2?: string;
    typographyColor3?: string;
    executionCardBgColor1?: string;
    executionCardBgColor2?: string;
    executionCardBgColor3?: string;
    linearProgressBgColor1?: string;
  }
}

const DeclareModules = () => {
    return; 
}

export default DeclareModules