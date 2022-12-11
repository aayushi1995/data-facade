import { TextField } from "@mui/material"
import { ComponentDefinition } from "../../../../generated/entities/Entities"
import { TextBoxComponentDetails } from "../../../types/ComponentConfigTypes"
import useTextFieldComponentCard from "../../hooks/useTextFieldComponentCard"



const TextBoxComponentCard = ({component}: {component: ComponentDefinition}) => {

    const {onTextValueChange} = useTextFieldComponentCard({component})
    
    const componentDetails = JSON.parse(component.Config || "{}") as TextBoxComponentDetails

    return (
        <TextField fullWidth variant="outlined" value={componentDetails.Text} onChange={onTextValueChange}/>
    )

}

export default TextBoxComponentCard