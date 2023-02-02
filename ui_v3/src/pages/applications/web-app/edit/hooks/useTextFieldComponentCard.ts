import React from "react";
import { ComponentDefinition } from "../../../../../generated/entities/Entities";
import { SetEditWebAppContext } from "../context/EditWebAppContextProvider";


const useTextFieldComponentCard = ({component}: {component: ComponentDefinition}) => {

    const setEditWebAppContext = React.useContext(SetEditWebAppContext) 

    const onTextValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditWebAppContext({
            type: 'EditTextOfTextBoxComponent',
            payload: {
                componentId: component.Id!,
                details: {
                    ...JSON.parse(component.Config || "{}"),
                    Text: event.target.value
                }
            }
        })
    }

    return {
        onTextValueChange
    }
}

export default useTextFieldComponentCard