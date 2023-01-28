import React from "react";
import { Typography } from "@mui/material";
import ComponentTypes from "../../../enums/ComponentTypes";
import { SetEditWebAppContext, WebAppComponent } from "../context/EditWebAppContextProvider";
import InputComponentCard from "../business/component_cards/InputComponentCard";


const useComponentCard = (component: WebAppComponent) => {

    const setEditWebAppContext = React.useContext(SetEditWebAppContext)

    const onDelete = () => {
        setEditWebAppContext({
            type: 'DeleteComponent',
            payload: {
                componentId: component.Id!
            }
        })
    }

    const onLabelChange = (label: React.ChangeEvent<HTMLInputElement>) => {
        setEditWebAppContext({
            type: 'ChangeComponentLabel',
            payload: {
                componentId: component.Id!,
                label: label.target.value
            }
        })
    }

    return {
        onDelete,
        onLabelChange
    }

}

export default useComponentCard

