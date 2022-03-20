import { Box, Card, Divider, Typography, Button, Avatar, TextField, Grid} from "@material-ui/core";
import ActionInfo from "./hero-componenets/ActionInfo";
import ActionDescription from "./hero-componenets/ActionDescription";
import { lightShadows } from "../../../../css/theme/shadows";

export interface ActionHeroProps {
    Name?: string,
    Description?: string,
    Author?: string,
    onNameChange?: (newName: string|undefined) => void,
    onDescriptionChange?: (newDescription: string|undefined) => void
    readOnly?: boolean
}

const ActionHero = (props: ActionHeroProps) => {
    const {Name, Description, onNameChange, onDescriptionChange, Author, readOnly} = props

    return (
        <Card
            sx={{
                backgroundColor: 'background.paper',
            '&:hover': {
                backgroundColor: 'background.default'
            },
            background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0",
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxSizing: "border-box",
            boxShadow: lightShadows[29]
            }}
            variant={'outlined'}
        >
            <Grid container>
                <Grid item xs={12} md={6}>
                    <ActionInfo Name={Name} onNameChange={onNameChange} Author={Author}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <ActionDescription Description={Description} onDescriptionChange={onDescriptionChange} Author={Author} readOnly={false}/>
                </Grid>
            </Grid>
        </Card>
    )
}

export default ActionHero;