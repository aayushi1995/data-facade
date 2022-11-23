import React from "react"
import { SetWorkflowContext, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import CollapsibleDrawer from "../../../../../pages/build_action/components/form-components/CollapsibleDrawer"
import SelectActionDrawer from "../../../common/SelectActionDrawer"



interface WorkflowSideDrawerProps {

}

const WorkflowSideDrawer = (props: WorkflowSideDrawerProps) => {
    const workflowContext = React.useContext(WorkflowContext)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [confirmationDialogState, setConfirmationDialogState] = React.useState(false)
    const [selectedActionId, setSelectedActionId] = React.useState<string | undefined>()

    const handleDrawerState = (state: {open: boolean}) => {
        setWorkflowContext({type: 'SET_SIDE_DRAWER_STATE', payload: state})
    }

    const handleActionSelect = (actionId?: string) => {
        if(actionId !== undefined) {
            setSelectedActionId(actionId)
            window.open(`/application/edit-workflow/${actionId}`)
        }
    }


    const handleDialogClose = () => {
        setConfirmationDialogState(false)
    }

    return (
        <>
            <CollapsibleDrawer
                open={workflowContext.sideDrawerState?.open || false}
                openWidth="400px"
                closedWidth="50px"
                openDrawer={() => {handleDrawerState({open: true})}}
            >
                <SelectActionDrawer setDialogState={(event: {open: boolean}) => handleDrawerState(event)} mainTabLabel="Flows" selectedActionId={selectedActionId} handleOnIdSelect={handleActionSelect}/>
            </CollapsibleDrawer>
        </>
    )
}

export default WorkflowSideDrawer