import React from "react";
import { SelectActionCardProps } from "../../../common/components/workflow/create/SelectActionCard";
import { SelectedActionCardProps } from "../components/SelectActionCard";
import { SelectActionToAddProps } from "../components/SelectActionToAdd";



const useSelectActionCard = (props: SelectedActionCardProps) => {

    const {handlers: {onActionClick, onNameChange, onActionDelete}, actionDetails, actionIndex} = props

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onNameChange(event.target.value, actionIndex)
    }

    const handleActionClick = () => {
        onActionClick(actionIndex)
    }

    const handleActionDelete = () => {
        onActionDelete(actionIndex)
    }

    return {
        handleNameChange,
        handleActionClick,
        handleActionDelete
    }
}

export default useSelectActionCard