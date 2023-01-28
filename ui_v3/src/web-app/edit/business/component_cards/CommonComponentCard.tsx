import { Card, CardActionArea, Typography } from "@mui/material"
import ChartSquareBar from "../../../../icons/ChartSquareBar"
import useAddComponentCard from "../../hooks/useAddComponentCard"
import InsertChartOutlinedSharpIcon from '@mui/icons-material/InsertChartOutlinedSharp';
import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import { TextInputIcon } from "../../../../assets/theme.icon";
interface ComponentCardProps {
    componentType: string
}

const cardStyle = {
    background: "#EDF0F4",
    boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.4)",
    borderRadius: "5px",
    alignItems: "center",
    display: "flex",
    padding: '15px',
    justifyContent: "center",
    cursor:"pointer"

}

const CommonComponentCard = (props: ComponentCardProps) => {
    const { componentType } = props

    const { onComponentAdd } = useAddComponentCard({ componentType: componentType })

    const renderIcon = (componentType: string) => {
        switch (componentType) {
            case 'chart': {
                return <InsertChartOutlinedSharpIcon />
            }
            case 'output': {
                return <OutputOutlinedIcon />
            }

            case 'input': {
                return <InputOutlinedIcon />
            }
            case 'text_box': {
                return <TextInputIcon />
            }


        }
    }

    return (
        <div>
            <Card sx={cardStyle} onClick={onComponentAdd}>
                {renderIcon(componentType)}
            </Card>
            <Typography style={{fontSize:12,textAlign:'center',marginTop:5}}>{componentType}</Typography>
        </div>
    )

}

export default CommonComponentCard