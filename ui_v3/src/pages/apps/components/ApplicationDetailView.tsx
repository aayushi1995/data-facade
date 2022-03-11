import React from "react"
import { useRouteMatch, RouteComponentProps } from "react-router-dom"
import ApplicationHeader from "../../../common/components/application/ApplicationHeader"
import NoData from "../../../common/components/NoData"
import useGetApplicationDetails from "../hooks/useGetApplicationDetails"
import { Box, Card, Tab, Tabs, Typography } from "@material-ui/core"
import ApplicationHeroInfo from "../../../common/components/application-info-hero/ApplicationHeroInfo"
import ApplicationActions from "../../../common/components/application/ApplicationActions"
import ApplicationWorkflows from "../../../common/components/application/ApplicationWorkflows"

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
    const applicationId = match.params.applicationId
    console.log(applicationId)

    const [applicationDetailData, applicationDataError, applicationDetailLoading] = useGetApplicationDetails(applicationId)
    console.log(applicationDetailData)
    if(applicationDetailData) {
        console.log(applicationDetailData)
        const application = applicationDetailData[0]
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Box sx={{flex: 1}}>
                    <ApplicationHeader pageHeader="Application Details" subHeading="Create, Manage Applications from here" fromApplicationDetail={true} applicationId={application.model?.Id}/>
                </Box>
                <Box sx={{flex: 1}}>
                    <Card sx={{background: 'background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0',
                            backgroundBlendMode: 'soft-light, normal',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: '-10px -10px 20px #FAFBFF, 10px 10px 20px #A6ABBD',
                            borderRadius: '10px',
                            p: 1, marginBottom: 1}}
                    >
                        <ApplicationHeroInfo applicationName={application?.model?.Name || "Name"} createdBy={{name: "Created By"}} 
                        numberStats={[{value: application?.numberOfActions || 0, label: "Actions"}, {value: application?.numberOfFlows || 0, label: "Workflows"}]}
                        status="In use"
                        />
                    </Card>
                </Box>
                <Box>
                    <Tabs value={tabValue} onChange={((event, newValue) => setTableValue(newValue))}>
                        <Tab label="Actions" value={0} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                        <Tab label="Flows" value={1} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                        <Tab label="Runs by Me" value={2} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                        <Tab label="History" value={3} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                        <Tab label="Live Apps" value={4} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7,
                              color: 'rgba(0, 170, 17, 1)'
                        }}/>
                    </Tabs>
                </Box>
                <Box mb={3}>
                    <TabPanel value={tabValue} index={0}>
                        <Box mt={1}>
                            <ApplicationActions actions={application.actions || []}/>
                        </Box>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <Box mt={1}>
                            <ApplicationWorkflows workflows={application.workflows || []}/>
                        </Box>
                    </TabPanel>
                </Box>
            </Box>

        )
    }
    else if(applicationDetailLoading) {
        return <>Loading...</>
    }

    console.log(applicationDataError)
    return <NoData/>

}

export default ApplicationDetailView