

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
      actionDefinitionSummaryStatLabel: React.CSSProperties
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
      actionDefinitionSummaryStatLabel?: React.CSSProperties
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
      actionDefinitionSummaryStatLabel: true
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
  }
  interface PaletteOptions {
    lightBrown?: string;
    lightBlueDF?: string;
  }
}

const DeclareModules = () => {
    return; 
}

export default DeclareModules