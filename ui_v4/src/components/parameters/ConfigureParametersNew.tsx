import { ActionParameterDefinition, ActionParameterInstance } from "@/generated/entities/Entities"
import ActionParameterDefinitionDatatype from "@/helpers/enums/ActionParameterDefinitionDatatype"
import ActionParameterDefinitionTag from "@/helpers/enums/ActionParameterDefinitionTag"
import { Space } from "antd"
import React from "react"
import ParameterDefinitionsConfigPlane from "./ParameterDefinitionsConfigPlane"
import { ActionParameterAdditionalConfig } from "./ParameterInput"


interface ConfigureParametersPropsNew {
    mode: "GENERAL" | "ADVANCED",
    ActionParameterDefinitions: ActionParameterDefinition[],
    ActionParameterInstances: ActionParameterInstance[],
    ParameterAdditionalConfig: ActionParameterAdditionalConfig[],
    showOnlyParameters?: boolean
    handleParametersChange: (newActionParameterInstances: ActionParameterInstance[]) => void,
    parentExecutionId?: string,
    fromTestRun?: boolean
}

export const isDefaultValueDefined = (parameterDefaultValue?: string) => {
    const defaultParameterInstance = JSON.parse(parameterDefaultValue || "{}") as ActionParameterInstance
    return !!defaultParameterInstance.ParameterValue || !!defaultParameterInstance.TableId || !!defaultParameterInstance.ColumnId
}

const ConfigureParametersNew = (props: ConfigureParametersPropsNew) => {

    const filteredParameters = (props.mode === "GENERAL" ?
        props?.ActionParameterDefinitions?.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue))
        : props?.ActionParameterDefinitions?.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue))).sort((p1, p2) => ((p1?.Index || 0) > (p2?.Index || 1)) ? 1 : -1)

    const [parameterSelected, setParameterSelected] = React.useState<ActionParameterDefinition | undefined>()



    const onParameterClick = (parameterId: string) => {
        const parameter = filteredParameters.find(apd => apd.Id === parameterId)
        setParameterSelected(parameter)
    }

    const numberOfParameters = filteredParameters.length
    const pramameterBody: ActionParameterDefinition[] = []

    filteredParameters.map(parameterDef => {
        if (parameterDef.ParameterName === 'df' ||
            parameterDef.ParameterName === ActionParameterDefinitionTag.TABLE_NAME ||
            parameterDef.ParameterName === ActionParameterDefinitionTag.DATA ||
            parameterDef.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME) {
            pramameterBody.unshift(parameterDef)
        } else {
            pramameterBody.push(parameterDef)
        }
    })



    if (numberOfParameters <= 4) {
        return (

            <>
                {
                    pramameterBody.map((parameterDef, index) => {
                        return (
                            <Space direction="vertical" size="large" key={index}>
                                <ParameterDefinitionsConfigPlane
                                    parameterDefinitions={[parameterDef]}
                                    parameterInstances={props.ActionParameterInstances}
                                    parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                                    handleChange={props.handleParametersChange}
                                    onParameterClick={onParameterClick}
                                    parentExecutionId={props.parentExecutionId}
                                />

                            </Space>
                        )
                    })
                }
            </>

        )
    }

    const getParamsToShowInGroups = () => {
        const paramArrayByGroup: ActionParameterDefinition[][] = []
        for (let i = 0; i < filteredParameters.length / 5; i++) {
            const paramsToShow = filteredParameters.slice(i * 5, Math.min(filteredParameters.length, (i + 1) * 5))
            paramArrayByGroup.push(
                paramsToShow
            )
        }
        return paramArrayByGroup
    }

    return (
        <>
            {getParamsToShowInGroups().map((groupParams, index) => (
                <Space direction="vertical" size="large" key={index}>
                    <ParameterDefinitionsConfigPlane parameterDefinitions={groupParams}
                        parameterInstances={props.ActionParameterInstances}
                        parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                        handleChange={props.handleParametersChange}
                        onParameterClick={onParameterClick}
                        parentExecutionId={props.parentExecutionId}
                    />
                </Space>
            ))}

        </>
    )
}

export default ConfigureParametersNew
