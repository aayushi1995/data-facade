import { ActionDefinitionDetail } from "../../../../generated/interfaces/Interfaces";
import { RecommendedActionsMainDiv, RecommendedActionsMainListItem, StyledListItem } from "../Chat.styles";
import { List } from 'antd';


const RecommendedActionsInput = (props: {recommendedActions?: ActionDefinitionDetail[], handleConversation?: Function}) =>  {
    const options = (props?.recommendedActions || [])?.map(action => action?.ActionDefinition?.model?.UniqueName)

    const onSelect = (action: ActionDefinitionDetail) => {
        props?.handleConversation?.({text: action?.ActionDefinition?.model?.UniqueName}, "user", "text")
    }

    return (
        <RecommendedActionsMainDiv>
        <List
            itemLayout="horizontal"
            dataSource={props?.recommendedActions?.slice(0, 5) || []}
            size="small"
            renderItem={(item) => (
            <RecommendedActionsMainListItem onClick={() => onSelect(item)} className="list-item" style={{ cursor: 'pointer' , borderBottom: '0px',paddingLeft:'0px' }}>
                {/* <List.Item.Meta
                    title={item?.ActionDefinition?.model?.UniqueName || "NA"}
                /> */}
                <StyledListItem>
                    {item?.ActionDefinition?.model?.UniqueName || "NA"}
                </StyledListItem>
            </RecommendedActionsMainListItem>
        )}
        />
    </RecommendedActionsMainDiv>
    )
}
export default RecommendedActionsInput

