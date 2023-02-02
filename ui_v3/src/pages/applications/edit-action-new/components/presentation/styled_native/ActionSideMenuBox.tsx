import { Box, BoxProps, Card, CardProps, Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/styles";


export const ActionSideMenuBox = styled(Card)<CardProps>(({ theme }) => ({
    background:
    "linear-gradient(135.37deg, rgba(0, 0, 0, 0.4) 4.29%, rgba(255, 255, 255, 0.4) 95.6%), #F6F8FC",
    backgroundBlendMode: "soft-light, normal",
    boxShadow: "1px 1px 1px #A6ABBD",
    borderRadius: "5px"
}))

export const ActionDeepDiveMenuCard = styled(Card)<CardProps>(( { theme } ) => ({
    background: "#F6F8FC",
    boxShadow:
      "-1.45781px -1.45781px 4.37344px rgba(255, 255, 255, 0.5), 1.45781px 1.45781px 4.37344px rgba(163, 177, 198, 0.5)",
    borderRadius: "5.87435px"
}))

export const ActionSideMenuHeaderTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontFamily: "'Segoe UI'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "150%",
    letterSpacing: "0.0870091px",
    color: "#FF6C40"
}))