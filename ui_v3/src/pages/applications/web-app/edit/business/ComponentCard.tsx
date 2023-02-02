import CloseIcon from '@mui/icons-material/Close';
import { Card, CardContent, CardHeader, IconButton, TextField, Typography } from "@mui/material";
import ComponentTypes from "../../../../../enums/ComponentTypes";
import { WebAppComponent } from "../context/EditWebAppContextProvider";
import useComponentCard from "../hooks/useComponentCard";
import InputComponentCard from "./component_cards/InputComponentCard";
import TextBoxComponentCard from "./component_cards/TextBoxComponentCard";

interface ComponentCardProps {
    component: WebAppComponent
}

const cardStyle = {
    background: "#F2F6FF",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "4px",
    height: 'auto', width: '100%',
    cursor:'move'
}

const ComponentCard = ({ component }: ComponentCardProps) => {

    const { onDelete, onLabelChange } = useComponentCard(component)

    const renderComponentType = (): React.ReactFragment => {
        switch (component.Type) {
            case ComponentTypes.INPUT: return <InputComponentCard component={component} />
            case ComponentTypes.TEXT_BOX: return <TextBoxComponentCard component={component} />
            default: return <Typography style={{fontSize:12,fontWeight:500,color:'#6E7887'}}>This is component of type {component.Type} </Typography>
        }
    }

    return (
        <Card sx={cardStyle}>
            <CardHeader
                action={
                    <IconButton aria-label="delete" onClick={onDelete}>
                        <CloseIcon />
                    </IconButton>
                }
                title={renderComponentType()}
            />
            <CardContent>
                    <TextField fullWidth inputMode="text"  label="Label" value={component.Label} onChange={onLabelChange} />
            </CardContent>
        </Card>
    )
}

export default ComponentCard