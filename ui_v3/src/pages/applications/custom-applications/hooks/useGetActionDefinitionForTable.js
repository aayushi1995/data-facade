import { useRetreiveData, useFetchMultipleRetreiveData } from "../../../../data_manager/data_manager";
import labels from "../../../../labels/labels";
import {useEffect, useRef} from "react";

 /**
 * 
 * @param {*} TableId 
 [
	{
		TAG_MAP_MODEL
	},
	{
		Id: String,
        DeletedStatus: String,
        DeletedOn: BigDecimal,
        TagName: String,
        CreatedBy: String,
        CreatedOn: BigDecimal,
        RelatedEntityType: String,
        RelatedEntityId: String,
	}
]*/
export const useFetchTagDefinitionQuery = (tableId) => useRetreiveData(labels.entities.TAG_MAP, {
    "filter": {
        "RelatedEntityType": "TableProperties",
        "RelatedEntityId": tableId
    }
});
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
/**
 * 
 * @param tableId string
 * @returns [{
    data: [
  {ActionDefinitions: [], ActionParameterDefinitions: [], Columns, Id, Name, Tables: [{Description, DisplayName, Id, ProviderInstanceName, ProviderInstanceID, UniqueName, Owner, FullSyncedOn}]}
 ]}]
 */
export const useGetActionDefinitionForTable = (tableId) => {
    const  {data: tags, isLoading: isTagsLoading, error: tagsError} =useFetchTagDefinitionQuery(tableId);
    const tagMapQueries = tags?.map(({TagName})=>[labels.entities.TAG, {
        "filter": {
            Name: TagName
        },
        SingleTagView: true
        //"withActionParameterDefinition": true,
    }]);
    const actionDefinitionsResult = useFetchMultipleRetreiveData(tagMapQueries, {enabled: !isTagsLoading && tags && !tagsError});
    return {actionDefinitionsResult, isTagsLoading, tagsError};
}