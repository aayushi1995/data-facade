/**
 * 
 * @param data workflow action definitions [{LinkedDefinitions,workflowDefinition}]
 * @param actionDefinitions [[ActionDefinition]] all modified action definitions of type check or profiling or cleanup, if not present then send all
 * @param tableMeta
 * @param actionNameMap id mapped with DisplayName
 * @returns {{childDefinitions: *[], mappings: {}}}
 */
export function getWorkflowActionDefinitions(data, actionDefinitions, tableMeta, actionNameMap) {
    if (!data || actionDefinitions?.length <= 0) {
        return;
    }
    const linkedDefinitions = data[0]?.LinkedDefinitions
    const modifiedLinkedDefinitions = []
    const modifiedLinkedModels = []
    linkedDefinitions.forEach(linkedDefinition => {
            modifyLinkedDefinitions(linkedDefinition, actionNameMap, modifiedLinkedDefinitions, modifiedLinkedModels);
     })
    let mappings = {}
    modifiedLinkedDefinitions.forEach(action => {
        const defaultTemplate = action?.ActionTemplatesWithParameters?.filter(templateWithParameter =>
            templateWithParameter?.model?.Id == action?.ActionDefinition?.model?.DefaultActionTemplateId
        )
        const parameterDefinitions = defaultTemplate[0]?.actionParameterDefinitions
        parameterDefinitions?.forEach(parameter => {
            const Tag = parameter?.model?.Tag;
            //filling default value as workflow table, user can modify later
            if (Tag === 'data' || Tag === 'table_name') {
                mappings = {
                    ...mappings,
                    [parameter?.model?.Id]: {
                        ParameterValue: tableMeta?.Table?.UniqueName,
                        TableId: tableMeta?.Table?.Id,
                        ProviderInstanceId: tableMeta?.Table?.ProviderInstanceID,
                    }
                }
            } else {
                mappings = {
                    ...mappings,
                    [parameter?.model?.Id]: {
                        ParameterValue: ''
                    }
                }
            }
            // assumption: only one table as parameter

        })
    });
    return { finalDefinitions: modifiedLinkedDefinitions, childDefinitions: modifiedLinkedModels, mappings };
}

function modifyLinkedDefinitions(linkedDefinition, actionNameMap, validLinkedDefinitions, validLinkedModels) {
    const lModel = linkedDefinition?.ActionDefinition?.model;
    const lModelId = linkedDefinition?.ActionDefinition?.model?.Id;
        if (actionNameMap?.[lModelId]) {
            lModel.DisplayName = actionNameMap[lModelId];
        }
        validLinkedDefinitions.push(linkedDefinition);
        validLinkedModels.push(lModel);
}
