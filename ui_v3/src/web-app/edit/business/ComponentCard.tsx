import { Card, Typography, Box, IconButton, TextField } from "@mui/material"
import { WebAppComponent } from "../context/EditWebAppContextProvider"
import CloseIcon from '@mui/icons-material/Close';
import useComponentCard from "../hooks/useComponentCard";
import ComponentTypes from "../../../enums/ComponentTypes";
import InputComponentCard from "./component_cards/InputComponentCard";
import TextBoxComponentCard from "./component_cards/TextBoxComponentCard";

interface ComponentCardProps {
    component: WebAppComponent
}

const ComponentCard = ({component}: ComponentCardProps) => {
    
    const {onDelete, onLableChange} = useComponentCard(component)

    const renderComponentType = (): React.ReactFragment => {
        switch(component.Type) {
            case ComponentTypes.INPUT : return <InputComponentCard component={component}/>
            case ComponentTypes.TEXT_BOX: return <TextBoxComponentCard component={component} />
            default: return <Typography>This is component of type {component.Type} </Typography>
        }
    }
    
    return (
        <Card sx={{overflow: 'auto', height: '100%', width: '100%', borderRadius: '0px', display: 'flex', flexDirection: 'column', gap: 2}}>
            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', bgcolor: 'lightgray'}}>
                <TextField variant="standard" sx={{width: '50%'}} label="Label" value={component.Label} onChange={onLableChange}/>
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                    <IconButton onClick={onDelete}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {renderComponentType()}
            </Box>
        </Card>
    )
}

export default ComponentCard