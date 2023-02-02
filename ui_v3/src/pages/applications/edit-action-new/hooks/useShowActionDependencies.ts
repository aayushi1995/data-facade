import { GridCellParams } from "@mui/x-data-grid"
import React from "react"
import { generatePath, useHistory } from "react-router"
import { WORKFLOW_EDIT_ROUTE } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { SINGLE_DASHBOARD_VIEW } from "../../../../common/components/route_consts/data/InsightsRoutesConfig"
import RelationshipMapTypes from "../../../../enums/RelationshipMapTypes"
import { ActionDependency } from "../../../../generated/interfaces/Interfaces"
import { BuildActionContext } from "../../build_action_old/context/BuildActionContext"
import useFetchActionDependencies from "./useFetchActionDependencies"


const useShowActionDependencies = () => {
    const buildActionContext = React.useContext(BuildActionContext)
    const history = useHistory()

    type TabTypes = "Flows" | "Dashboards"

    const [tabState, setTabState] = React.useState<TabTypes>("Flows") 

    const {data: actionDependencies, isLoading, error} = useFetchActionDependencies({filter: {Id: buildActionContext.actionDefinitionWithTags.actionDefinition.Id}, queryParams: {staleTime: 1000*60} })

    const getWorkflowDependecies = () => {
        if(!!actionDependencies) {
            return actionDependencies.filter(dependency => dependency.RelationshipType === RelationshipMapTypes.FLOW_ACTION)
        }
        return []
    }

    const getDashboardDependencies = () => {
        if(!!actionDependencies) {
            return actionDependencies.filter(dependency => dependency.RelationshipType === RelationshipMapTypes.DASHBOARD_ACTION)
        }
        return []
    }

    const getRows = () => {
        switch(tabState) {
            case "Dashboards": return getDashboardDependencies()
            case "Flows": return getWorkflowDependecies()
        }
    }

    const handleCellClick = (params: GridCellParams<unknown, ActionDependency, unknown>, event: any, details: any) => {
        if(params?.colDef?.field === "Entity") {
            if(tabState === "Flows" ) {
                history.push(generatePath(WORKFLOW_EDIT_ROUTE, {WorkflowId: params?.row?.ParentId}))
            } else if (tabState === "Dashboards") {
                history.push(generatePath(SINGLE_DASHBOARD_VIEW, {dashboardId: params?.row?.ParentId}))
            }
        }
    }

    return {
        actionDependencies,
        isLoading,
        error,
        tabState,
        setTabState,
        getRows,
        handleCellClick
    }



}

export default useShowActionDependencies