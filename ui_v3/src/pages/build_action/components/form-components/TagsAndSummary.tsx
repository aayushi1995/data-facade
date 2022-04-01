import { Grid, Button } from "@mui/material";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import VirtualTagHandler, { VirtualTagHandlerProps } from "../../../../common/components/tag-handler/VirtualTagHandler";
import useCopyAndSaveDefinition from "../../../../common/components/workflow/create/hooks/useCopyAndSaveDefinition";
import { Tag } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import ActionHighLevelDetails from "../common-components/ActionHighLevelDetails";
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
        orientation: "VERTICAL",
        direction: "DEFAULT"
    }

    return (
        <Grid container spacing={2} sx={{p: 5}}>
            <Grid container spacing={2} item xs={12} lg={7}>
                <Grid item xs={12} lg={6}>
                    <WrapInHeader header="Action Summary">
                        <ActionSummary/>
                    </WrapInHeader>
                </Grid>
                <Grid container spacing={2} item xs={12} lg={6}>
                    <Grid item xs={12}>
                        <WrapInHeader header="Action Definition Behaviour">
                            <ConfigureActionVisibility/>
                        </WrapInHeader>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <WrapInHeader header="Action Tags">
                        <VirtualTagHandler {...tagHandlerProps}/>
                    </WrapInHeader>
                </Grid>
            </Grid>
            <Grid container spacing={2} item xs={12} lg={5}>
                <Grid item xs={12}>
                    <WrapInHeader header="Action High Level Details">
                        <ActionHighLevelDetails/>
                    </WrapInHeader>
                </Grid>
            </Grid>
        </Grid>
    )
}
export default TagsAndSummary;