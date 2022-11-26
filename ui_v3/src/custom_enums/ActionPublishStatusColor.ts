import ActionDefinitionPublishStatus from "../enums/ActionDefinitionPublishStatus";

const ActionPublishStatusColor = {
    [ActionDefinitionPublishStatus.DRAFT]: "#FFFF00",
    [ActionDefinitionPublishStatus.READY_TO_USE]: "#00FF00"
}

export default ActionPublishStatusColor;