import { Typography } from "@mui/material";

type ActionLanguageProps = {
    language?: string
}

function ActionLanguage(props: ActionLanguageProps) {
    return <Typography>
        {props?.language || "NA"}
    </Typography>
}

export default ActionLanguage;