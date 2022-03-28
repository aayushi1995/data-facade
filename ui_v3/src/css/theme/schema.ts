import { Typography } from "@mui/material";


declare module '@mui/styles' {
    interface TypographyVariants {
      heroHeader: React.CSSProperties;
      heroMeta: React.CSSProperties;
      actionCardHeader: React.CSSProperties;
      actionCardSubHeader: React.CSSProperties
      allApplicationViewSectionHeader: React.CSSProperties,
      wizardText: React.CSSProperties
    }
  
    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
      heroHeader?: React.CSSProperties;
      heroMeta?: React.CSSProperties;
      actionCardHeader?: React.CSSProperties;
      actionCardSubHeader?: React.CSSProperties;
      allApplicationViewSectionHeader?: React.CSSProperties,
      wizardText?: React.CSSProperties
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