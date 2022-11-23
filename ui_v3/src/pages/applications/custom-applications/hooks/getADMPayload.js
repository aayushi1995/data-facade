export function getADMPayload(item, ActionInstanceId, Table, tableTypeActionParameter, ActionDefinitionParameterId2, actionNameMap) {
    let entityProperties, ActionParameterInstanceEntityProperties;
    if (item.ActionInstance) {
        entityProperties = item.ActionInstance.model;
        ActionParameterInstanceEntityProperties = item.ActionInstance.ParameterInstances;
    } else {
        entityProperties = {
            ActionType: item?.ActionType,
            DefinitionId: item?.Id,
            DisplayName: actionNameMap?.[item?.Id] || item?.DisplayName,
            Id: ActionInstanceId,
            Name: item.UniqueName,
            ProviderInstanceId: Table?.ProviderInstanceID,
            TableId: Table?.Id,
            TemplateId: tableTypeActionParameter?.TemplateId,
        };
        ActionParameterInstanceEntityProperties = [
            {
                ActionInstanceId: ActionInstanceId,
                ActionParameterDefinitionId: tableTypeActionParameter?.Id,
                Id: ActionDefinitionParameterId2,
                ParameterName: tableTypeActionParameter?.ParameterName,
                ParameterValue: Table?.UniqueName,
                TableId: Table?.Id,
                ProviderInstanceId: Table?.ProviderInstanceID,
            },
        ];
    }
    return {
        entityName: "ActionInstance",
        actionProperties: {
            entityProperties,
            ActionParameterInstanceEntityProperties,
            withActionParameterInstance: true,
            SynchronousActionExecution: true,
        },
    };
}
