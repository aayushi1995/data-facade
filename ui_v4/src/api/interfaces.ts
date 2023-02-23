export type TableColumnRelationshipConfig = {

}

export type ActionParameterDefinitionParentRelationshipNameType = "TableColumn"

export type ActionParameterDefinitionParentRelationshipConfigType = TableColumnRelationshipConfig

export type ActionParameterDefinitionConfig = {
    ParentParameterDefinitionId?: string,
    ParentRelationshipName?: ActionParameterDefinitionParentRelationshipNameType,
    ParentRelationshipConfig?: ActionParameterDefinitionParentRelationshipConfigType
}

