import { useQuery } from "react-query"
import dataManager from "../../../../data_manager/data_manager"
import { ActionDefinition, ActionDefinitionColumns, Application } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"
import { AddReferenceProps } from "../components/AddReference"



const useAddReference = (props: AddReferenceProps) => {

    const {trainingData, onActionReferenceValueChange, setSelectedActionId, onApplicationIdChange} = props

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}
    const fetchAllActionsNameAndId = useQuery(
        [labels.entities.ActionDefinition, "AddReferenceAction"],
        () => {
            const columnsToRetrieve: {UniqueName: ActionDefinitionColumns}[] = [{UniqueName: "Id"}, {UniqueName: "DisplayName"}, {UniqueName: "UniqueName"}, {UniqueName: "ApplicationId"}]
            const filter: ActionDefinition = {IsVisibleOnUI: true}
            return fetchedDataManager.retreiveData(labels.entities.ActionDefinition, {
                filter: filter,
                columnsToRetrieve: columnsToRetrieve
            }) as ActionDefinition[]
        }, {
            staleTime: 1000*60
        }
    )

    const fetchAllApplications = useQuery(
        [labels.entities.APPLICATION, "AddReferenceAction"],
        () => {
            return fetchedDataManager.retreiveData(labels.entities.APPLICATION, {
                filter: {}
            }) as Application[]
        }, {
            staleTime: 1000*60
        }
    )

    const onActionSelect = (actionDefinition: ActionDefinition) => {
        setSelectedActionId(actionDefinition.Id)
        const application = fetchAllApplications?.data?.find(application => application.Id === actionDefinition.ApplicationId)
        const value = (application?.UniqueName || "NA") + "." + (actionDefinition.UniqueName || "NA")

        onActionReferenceValueChange(value)
        onApplicationIdChange(actionDefinition?.ApplicationId)
    }

    const getActionValue = () => {
        if(!!trainingData?.reference) {
            const [applicationName, actionName] = trainingData?.reference?.split('.')
            const applicationId = fetchAllApplications?.data?.find(app => app.UniqueName === applicationName)?.Id
            return fetchAllActionsNameAndId?.data?.find(action => action.UniqueName === actionName && action.ApplicationId === applicationId)
        }
    }

    return {
        fetchAllActionsNameAndId,
        fetchAllApplications,
        onActionSelect,
        getActionValue
    }

}

export default useAddReference