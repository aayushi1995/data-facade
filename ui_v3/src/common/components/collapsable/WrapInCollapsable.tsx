import { Accordion, useTheme, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export interface WrapInCollapsableProps {
    expandMoreIcon?: JSX.Element
    summary: JSX.Element,
    expanded: JSX.Element,
    borderLeft?: string
    defaultExpanded?: boolean
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
            borderRadius: '10px',
            // boxShadow: '-10px -10px 20px #FAFBFF, 10px 10px 20px #A6ABBD',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0',
            backgroundBlendMode: 'soft-light, normal',
            }}
            variant={'outlined'}
            defaultExpanded={props.defaultExpanded || false}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon /> || props.expandMoreIcon}>
                {props.summary}
            </AccordionSummary>
            <AccordionDetails>
                {props.expanded}
            </AccordionDetails>
        </Accordion>
    )
}

export default WrapInCollapsable