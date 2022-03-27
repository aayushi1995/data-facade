import { Box, Card, Divider, Typography, Button, Avatar, TextField, Grid} from "@mui/material";
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
                backgroundColor: '#F5F9FF',
                boxSizing: "border-box",
                boxShadow: '0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)',
                borderRadius: "26.3934px",
                border: '0.439891px solid #FFFFFF',
                minWidth: '100%'
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