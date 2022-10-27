import { Box, Card, Tab, Tabs, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material"
import React from "react"
import { RouteComponentProps } from "react-router-dom"
import ApplicationHeroInfo from "../../../common/components/application-info-hero/ApplicationHeroInfo"
import ApplicationActions from "../../../common/components/application/ApplicationActions"
import ApplicationWorkflows from "../../../common/components/application/ApplicationWorkflows"
import NoData from "../../../common/components/NoData"
import useGetApplicationDetails from "../hooks/useGetApplicationDetails"
import ApplicationRunsByMe from "./ApplicationRunsByMe"
import SyncWithGitDialog from "./SyncWithGitDialog"
import { ActionDefinitionHeroActionContextWrapper } from "../../build_action/components/shared-components/ActionDefinitionHero"
interface MatchParams {
    applicationId: string
}
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
);
}

const ApplicationDetailView = ({match}: RouteComponentProps<MatchParams>) => {
    const [tabValue, setTableValue] = React.useState(0)
    const [syncWithGitDialogState, setSyncWithGitDialogState] = React.useState(false)
    const [attatchNewProvider, setAttatchNewProvider] = React.useState<boolean>(false)
    const applicationId = match.params.applicationId
    const [applicationDetailData, applicationDataError, applicationDetailLoading] = useGetApplicationDetails(applicationId)

    const handleSyncWithGit = (attatchNewProvider: boolean) => {
        setSyncWithGitDialogState(true)
        setAttatchNewProvider(attatchNewProvider)
    }

    const handleDialogClose = () => {
        setSyncWithGitDialogState(false)
    }

    if(!!applicationDetailData) {
        const application = applicationDetailData[0]
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <SyncWithGitDialog open={syncWithGitDialogState} onClose={handleDialogClose} applicationId={applicationId} attatchNewProvider={attatchNewProvider}/>
                <Box sx={{flex: 1}}>
                    <Card sx={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0',
                            backgroundBlendMode: 'soft-light, normal',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '-10px -10px 20px #FAFBFF, 10px 10px 20px #A6ABBD',
                            borderRadius: '10px',
                            p: 1, marginBottom: 1}}
                    >
                        <ApplicationHeroInfo mode='EDIT' applicationName={application?.model?.Name || "Name"} createdBy={{name: "Creator"}} 
                        numberStats={[{value: application?.numberOfActions || 0, label: "Actions"}, {value: application?.numberOfFlows || 0, label: "Workflows"}]}
                        status="In use" description={application?.model?.Description} gitSyncStatus={application?.gitSyncStatus} handleSyncWithGit={handleSyncWithGit}
                        // onChangeHandlers= {
                        //     // onNameChange= (newName?: string) => setApplicationContext({ type: "SetApplicationName", payload: { newName: newName } }),
                        //     // onDescriptionChange= (newDescription?: string) => setApplicationContext({ type: "SetApplicationDescription", payload: { newDescription: newDescription } }),
                        //   }
                        
                        />

                        {/* <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <ActionDefinitionHeroActionContextWrapper/>
                        </Box> */}
                        
                    </Card>
                </Box>
                <Box>
                    <Tabs value={tabValue} onChange={((event, newValue) => setTableValue(newValue))}>
                    {
                        ["All","Flows", "Actions", "History"].map((label, index) => 
                            <Tab label={label} value={index} sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "14px",
                                lineHeight: "24px",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "center",
                                opacity: 0.7
                                }}
                            />
                        )
                    }
                    </Tabs>
                </Box>
                <Box mb={4}>
                    <TabPanel value={tabValue} index={0}>
                        <Box mt={1}>
                            <ApplicationWorkflows workflows={application.workflows || []}/>
                        </Box>
                        <Box mt={0}>
                            <ApplicationActions application={application}/>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box mt={1}>
                            <ApplicationWorkflows workflows={application.workflows || []}/>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Box mt={1}>
                            <ApplicationActions application={application}/>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <Box mt={1}>
                            <ApplicationRunsByMe application={application?.model}/>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>

        )
    }
    else if(applicationDetailLoading) {
        return <>Loading...</>
    }

    return <NoData/>

}

export default ApplicationDetailView
