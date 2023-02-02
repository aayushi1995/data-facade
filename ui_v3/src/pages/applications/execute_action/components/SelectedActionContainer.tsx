import { Box, Button, Typography } from "@mui/material"
import DownArrow from "../../../../../src/assets/images/DownArrow.svg"
import { ActionInstanceWithParameters } from "../../../../generated/interfaces/Interfaces"
import useSelectedActionContainer from "../hooks/useSelectedActionContainer"
import { SelectedActionContainerMainBox, StyledDividerActionContainer } from "../styled_components/SelectedActionContainerManBox"
import SelectActionCard from "./SelectActionCard"

export interface SelectedActionContainerProps {
    actions: ActionInstanceWithParameters[],
    handlers: {
        onNameChange: (newName: string, actionIndex: number) => void,
        onClickAction: (actionIndex: number) => void,
        onActionDelete: (actionIndex: number) => void
    },
    selectedActionIndex?: number
}


const SelectedActionContainer = (props: SelectedActionContainerProps) => {
    
    const {actions} = props
    const {prepareSelectedActionCardProps, onAddActionClick} = useSelectedActionContainer(props)

    const getActionsToRender = () => {
        return actions.map((actionInstanceWithParameter, index) => (
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <SelectActionCard {...prepareSelectedActionCardProps(index)}/>
                <Box>
                    <img src={DownArrow} style={{flex: 2, height: '100%'}}/>
                </Box>
            </Box>
        ))
    }

    return (
        <SelectedActionContainerMainBox sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1}}>
                <Typography>
                    Selected Actions
                </Typography>
                <Button onClick={onAddActionClick}>
                    Add
                </Button>
            </Box>
            <StyledDividerActionContainer orientation="horizontal"/>
            <Box sx={{height: '100%', overflowY: 'auto', minWidth: '200px', p: 1, display: 'flex', flexDirection: 'column'}}>
                {getActionsToRender()}
                <Box sx={{border: '1px dashed #66748A', p: 3, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={onAddActionClick}>
                    Add Action
                </Box>
            </Box>
            

        </SelectedActionContainerMainBox>
    )
}

export default SelectedActionContainer