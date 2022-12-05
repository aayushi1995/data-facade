import { Card, CardActionArea } from "@mui/material"
import useAddComponentCard from "../hooks/useAddComponentCard"

interface ComponentCardProps {
    componentType: string
}

const AddComponentCard = (props: ComponentCardProps) => {
    const { componentType } = props

    const { onComponentAdd } = useAddComponentCard({componentType: componentType})

    return (
        <Card sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1, height: '100%', width: '100%'}}>
            <CardActionArea onClick={onComponentAdd}>
                {componentType}
            </CardActionArea>
        </Card>
    )

}

export default AddComponentCard