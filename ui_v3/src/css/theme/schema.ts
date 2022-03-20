import { Typography } from "@mui/material";


declare module '@mui/material/styles' {
    interface TypographyVariants {
      heroHeader: React.CSSProperties;
      heroMeta: React.CSSProperties;
      workflowActionCard: React.CSSProperties;
      applicationActionCard: React.CSSProperties
    }
  
    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
      heroHeader?: React.CSSProperties;
      heroMeta?: React.CSSProperties;
      workflowActionCard?: React.CSSProperties;
      applicationActionCard?: React.CSSProperties;
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        heroHeader: true;
        heroMeta: true;
        workflowActionCard: true;
        applicationActionCard: true;
    }
}

declare module "@mui/material/styles" {
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