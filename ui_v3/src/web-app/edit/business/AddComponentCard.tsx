import { Card, CardActionArea } from "@mui/material"
import useAddComponentCard from "../hooks/useAddComponentCard"

interface ComponentCardProps {
    componentType: string
}

const cardStyle = {
    background: "#F4F5F7",
    boxShadow: "0px 0.728906px 1.45781px rgba(0, 0, 0, 0.25), 0px 0px 0.728906px rgba(0, 0, 0, 0.25)",
    borderRadius:'2.61px',
    padding:'8px',
    marginTop:'10px',
    borderLeft:'5px solid #66748A',
    cursor:'pointer'
    
}

const AddComponentCard = (props: ComponentCardProps) => {
    const { componentType } = props

    const { onComponentAdd } = useAddComponentCard({componentType: componentType})

    return (
        <Card sx={cardStyle} onClick={onComponentAdd}>
            
                {componentType}
            
        </Card>
    )

}

export default AddComponentCard