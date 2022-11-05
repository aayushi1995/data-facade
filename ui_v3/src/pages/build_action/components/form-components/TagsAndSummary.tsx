import { Grid } from "@mui/material";
import { useContext } from "react";
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler";
import { Tag } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import ActionSummary from "../common-components/ActionSummary";
import ConfigureActionVisibility from "../common-components/ConfigureActionVisibility";
import WrapInHeader from "../common-components/WrapInHeader";


const TagsAndSummary = () => {
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)
   
    const tagHandlerProps: VirtualTagHandlerProps = {
        selectedTags: buildActionContext.actionDefinitionWithTags.tags,
        tagFilter: {},
        allowAdd: true,
        allowDelete: true,
        onSelectedTagsChange: (newTags: Tag[]) => {
            setBuildActionContext({
                type: "ReAssignActionDefinitionTag",
                payload: {
                    newTags: newTags
                }
            })
        },
        inputFieldLocation: "RIGHT"
    }

    return (
        <Grid container spacing={2} sx={{p: 5}}>
            <Grid container spacing={2} item xs={12} lg={12}>
                <Grid item xs={12} lg={4}>
                    <WrapInHeader header="Action Summary">
                        <ActionSummary/>
                    </WrapInHeader>
                </Grid>
                <Grid item spacing={2} xs={12} lg={4}>
                    <WrapInHeader header="Action Definition Behaviour">
                        <ConfigureActionVisibility/>
                    </WrapInHeader>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <WrapInHeader header="Action Tags">
                        <VirtualTagHandler {...tagHandlerProps}/>
                    </WrapInHeader>
                </Grid>
            </Grid>
            {/* <Grid container spacing={2} item xs={12} lg={5}>
                <Grid item xs={12}>
                    <WrapInHeader header="Action High Level Details">
                        <ActionHighLevelDetails/>
                    </WrapInHeader>
                </Grid>
            </Grid> */}
        </Grid>
    )
}
export default TagsAndSummary;