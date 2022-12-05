import React from "react"
import { ComponentDefinition } from "../../../../generated/entities/Entities"
import { InputComponentDetails } from "../../../types/ComponentConfigTypes"
import { EditWebAppContext } from "../../context/EditWebAppContextProvider"
import DefaultValueInput from "../../../../pages/build_action/components/common-components/parameter_input/DefaultValueInput"


interface InputComponentCardProps {
    component: ComponentDefinition
}

const InputComponentCard = ({component}: InputComponentCardProps) => {

    const editWebAppContext = React.useContext(EditWebAppContext)

    const componentDetails = JSON.parse(component.Config || "{}") as InputComponentDetails | undefined
    const associatedGlobalParameter = editWebAppContext.WebAppParameters.find(globalParam => globalParam.Id === componentDetails?.ParameterReference)

    return (
        <DefaultValueInput actionParameterDefinition={associatedGlobalParameter} onDefaultValueChange={() => {}}/>
    )
}

export default InputComponentCard