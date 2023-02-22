import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper"
import ParameterDefinitionsConfigPlane from "../../../../common/components/parameters/ParameterDefinitionsConfigPlane"
import useParameterValues from "../hooks/useParameterValues"

export interface ParameterValueProps {
    actionDefinitionId: string,
    onParameterValueChange: (parameterValues: Record<string, string>) => void,
    parameterValue?: Record<string, string>
}

const ParameterValues = (props: ParameterValueProps) => {
    
    const {fetchActionDefinitionDetail, getParameterDefinitions, actionParameterInstances, handleChange} = useParameterValues(props)

    return (
        <ReactQueryWrapper {...fetchActionDefinitionDetail} isLoading={fetchActionDefinitionDetail.isLoading || fetchActionDefinitionDetail.isRefetching}>
            {() => (
                <ParameterDefinitionsConfigPlane 
                    parameterDefinitions={getParameterDefinitions() || []} 
                    parameterInstances={actionParameterInstances}
                    handleChange={handleChange}
                />
            )}
        </ReactQueryWrapper>
    )
}

export default ParameterValues