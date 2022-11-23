import { deDup } from "../components/WorkflowEditor";
export const getWorkflowEditorData = (actionDefinitionsResult, tableId) => {
  let tableMeta = {};
  let erroneous = false;
  let isLoading = false;
  if (!actionDefinitionsResult) {
    return ({
      tableMeta,
      actionDefinitions: [],
      erroneous
    });
  }
  const deDupAndFlattenedActionDefinitions = deDup(actionDefinitionsResult?.map(({ data, isLoading: _isLoading, error } = {}) => {
    isLoading = isLoading || _isLoading;
    erroneous = erroneous || _isLoading || !data || error;
    
    return (data?.map(({ ActionDefinitions, Name, Tables } = {}) => {
      tableMeta.Table = tableMeta.Table || Tables.find((table) => table.Id === tableId);
      return ActionDefinitions || [];
    }) || []);
  })?.flat(5), "Id");

  return ({
    actionDefinitions: deDupAndFlattenedActionDefinitions,
    tableMeta,
    erroneous,
    isLoading
  });
};
