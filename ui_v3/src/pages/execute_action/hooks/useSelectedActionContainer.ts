import React from "react"
import { SelectedActionCardProps } from "../components/SelectActionCard"
import { SelectedActionContainerProps } from "../components/SelectedActionContainer"
import { SetExecuteActionContext } from "../context/ExecuteActionContext"


const useSelectedActionContainer = (props: SelectedActionContainerProps) => {

    const {actions, selectedActionIndex, handlers: {onClickAction, onNameChange, onActionDelete}} = props

    const prepareSelectedActionCardProps: (actionIndex: number) => SelectedActionCardProps = (actionIndex: number) => {
        return {
            handlers: {
                onActionClick: onClickAction,
                onNameChange: onNameChange,
                onActionDelete: onActionDelete
            },
            actionDetails: actions[actionIndex]?.model || {},
            actionIndex: actionIndex,
            selectedActionIndex: selectedActionIndex
        }
    }

    const onAddActionClick = () => {
        if(!!selectedActionIndex){
            onClickAction(selectedActionIndex)
        }
    }

    return {
        prepareSelectedActionCardProps,
        onAddActionClick
    }

}

export default useSelectedActionContainer