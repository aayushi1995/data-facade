import React from "react";
import { SelectedActionCardProps } from "../components/SelectActionCard";



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