import { lightShadows } from '../../../css/theme/shadows';

export function getIconSxProperties() {
    return {
        height: "100%",
        width: "100%",
        backgroundColor: "cardIconButtonBackgroundColor.main",
        boxShadow: lightShadows[32],
        "&:hover": {
            backgroundColor: "cardIconBtn1HoverBgColor.main",
            color: "cardIconBtn1HoverColor.main"
        }
    };
}
