import { List } from 'antd';
import { useMemo } from "react";
import { v4 } from "uuid";
import { ActionDefinitionDetail } from "../../../../generated/interfaces/Interfaces";
import { RecommendedActionsMainDiv, RecommendedActionsMainListItem, StyledListItem } from "../Chat.styles";
import { makeActionInstancesWithParameterInstances } from "../chatInitiate";


const RecommendedActionsInput = (props: {recommendedActions?: ActionDefinitionDetail[], handleConversation?: Function, setActionDefinitions?: Function}) =>  {
    const options = (props?.recommendedActions || [])?.map(action => action?.ActionDefinition?.model?.UniqueName)

    const onSelect = (action: ActionDefinitionDetail) => {
        const actionInstanceWithParameterInstances = makeActionInstancesWithParameterInstances({action: action})
        const MessageId = v4()

        props?.handleConversation?.({text: action?.ActionDefinition?.model?.DisplayName}, "user", "text", undefined, undefined, undefined, false)
        props?.handleConversation?.(JSON.stringify(actionInstanceWithParameterInstances), 'system', 'action_instance', MessageId, true, true)
        
    }

    const recommendedActionsArray = useMemo(() => {
        return props?.recommendedActions?.filter((obj:any) => !!obj?.ActionDefinition?.model?.UniqueName).slice(0, 5)
    },[props?.recommendedActions])

    return (
        <RecommendedActionsMainDiv>
        <List
            itemLayout="horizontal"
            dataSource={recommendedActionsArray || []}
            size="small"
            renderItem={(item) => (
            <RecommendedActionsMainListItem onClick={() => onSelect(item)} className="list-item" style={{ cursor: 'pointer' , borderBottom: '0px',paddingLeft:'0px' }}>
                {/* <List.Item.Meta
                    title={item?.ActionDefinition?.model?.UniqueName || "NA"}
                /> */}
                <StyledListItem>
                    {item?.ActionDefinition?.model?.DisplayName || item?.ActionDefinition?.model?.UniqueName || item?.ActionDefinition?.model?.Description || "Action Name" }
                </StyledListItem>
            </RecommendedActionsMainListItem>
        )}
        />
    </RecommendedActionsMainDiv>
    )
}
export default RecommendedActionsInput

