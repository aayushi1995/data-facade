import { Accordion, useTheme, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export interface WrapInCollapsableProps {
    expandMoreIcon?: JSX.Element
    summary: JSX.Element,
    expanded: JSX.Element,
    borderLeft?: string
}

const WrapInCollapsable = (props: WrapInCollapsableProps) => {

    const theme = useTheme()

    return (
        <Accordion
            sx={{
                backgroundColor: theme.palette.background.paper,
            '&:hover': {
                backgroundColor: theme.palette.background.default
            },
            borderRadius: 6,
            borderLeft: props.borderLeft || "7px solid rgba(219, 140, 40, 1)",
            }}
            variant={'outlined'}
        >
            <AccordionSummary expandIcon={props.expandMoreIcon || <ExpandMoreIcon />}>
                {props.summary}
            </AccordionSummary>
            <AccordionDetails>
                {props.expanded}
            </AccordionDetails>
        </Accordion>
    )
}

export default WrapInCollapsable