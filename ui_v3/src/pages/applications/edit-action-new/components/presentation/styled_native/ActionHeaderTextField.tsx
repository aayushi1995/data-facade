import { styled, TextField, TextFieldProps } from "@mui/material";
import { ActionHeaderActionDescriptionStyle, ActionHeaderActionNameStyle, ActionHeaderDropDownTextStyle } from "../../../style/ActionHeaderStyles";

export const ActionHeaderActionNameTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    fullWidth: true,
    InputProps: {
        disableUnderline: true,
        sx: ActionHeaderActionNameStyle
    }
}));

export const ActionHeaderActionDescriptionTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    fullWidth: true,
    InputProps: {
        disableUnderline: true,
        sx: {
            ...ActionHeaderActionDescriptionStyle
        }
    }
}))


export const ActionHeaderAutoCompleteTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    fullWidth: true,
    InputProps: {
        disableUnderline: true,
        sx: {
            ...ActionHeaderDropDownTextStyle
        }
    }
}))