import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Card, Dialog, Grid, IconButton, InputAdornment, Typography } from "@mui/material";
import React from "react";
import LinesEllipsis from "react-lines-ellipsis";
import { generatePath, Link as RouterLink, NavLink } from "react-router-dom";
import MarcketPlaceIcon from '../../../../../src/assets/images/marketplace_blue.svg';
import { useGetPrebuiltApplications } from "../../../../common/components/application/hooks/useGetPrebuildApplications";
import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper";
import { APPLICATION_DETAIL_ROUTE_ROUTE, APPLICATION_ROUTE_MARKETPLACE } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig";
import { ApplicationCardViewResponse } from "../../../../generated/interfaces/Interfaces";
import useFetchActionDefinitionForSelector from "../../../applications/edit-action-new/hooks/useFetchActionDefinitionForSelector";
import useGetApplicationDetails from "../../../applications/hooks/useGetApplicationDetails";
import AppCard from "../../components/AppCard";
import { ActionCardConatier, ActionCardHeader, AllApps, AllPackageList, ContainerHeader, DialogBody, DialogHeader, NumberofItemInPackage, PackagesNameStyle, PackagesNameStyleR, PackageTabHeader, ScratchPadTabStyle, SearchBarDialogTextField, SeeAllPackage } from "../../components/StyledComponents";
import addActionContext from './AddActionContext';
import { AddActionCard, AddIconCss, appname, seemoremarcketplace } from "./CssProperties";
export type RecommendedAppsProps = {
    searchQuery?: string,
    tableId?: string
}


function RecommendedApps(props: RecommendedAppsProps) {
    const { tableId } = props
    const propsSearchQuery = props?.searchQuery?.toLowerCase() || ""
    const { data, isLoading, error } = useFetchActionDefinitionForSelector({})
    const filteredData = data?.filter(action => action?.ActionDisplayName?.toLowerCase()?.includes(propsSearchQuery))
    const [dialogState, setDialogState] = React.useState<boolean>(false)
    const [dialogsearchQuery, setDialogSearchQuery] = React.useState<string>(propsSearchQuery)

    const actionDefinitionRows = <ReactQueryWrapper
        isLoading={isLoading}
        error={error}
        data={data}
        children={() => filteredData?.slice(0, 9)?.map?.(ad =>
            <Grid item xs={6} md={4} lg={2.4} sx={{ px: 1, py: 2 }}>
                <AppCard Displayname={ad.ActionDisplayName || ""} Description={ad.ActionDisplayName || ""} ID={ad.ActionId} tableId={tableId} />
            </Grid>
        )}
    />
    const { ActionMaker, setActionMaker } = React.useContext(addActionContext);
    if (filteredData?.length == 0 && props.searchQuery) {
        setActionMaker(props.searchQuery)
    }

    return (
        <>
            <Box>
                <Dialog fullWidth={true} maxWidth={'lg'} open={dialogState}>
                    <Box sx={{ ...DialogHeader }}>
                        <SearchBarDialogTextField variant="standard" size='small'
                            value={dialogsearchQuery}
                            onChange={(event) => setDialogSearchQuery(event.target.value)}
                            placeholder="Search for Apps"
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ marginLeft: 1 }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <IconButton sx={{ ml: 'auto', mr: 4 }} onClick={() => { setDialogState(false) }}><CloseIcon /></IconButton>
                    </Box>
                    <DetailView
                        searchQuery={dialogsearchQuery}
                        tableId={props?.tableId}
                    />
                </Dialog>
            </Box>
            <Box sx={{ ...ActionCardConatier }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ ...ContainerHeader }}>Recommended Apps</Typography>
                    <Button sx={{ ml: 'auto' }} onClick={() => { setDialogState(true) }}>See All</Button>
                </Box>
                <Grid container>
                    <Grid item xs={6} md={4} lg={2.4} sx={{ px: 1, py: 2 }}>
                        <Card sx={{...AddActionCard}} to="/data/scratchpad?source=browser&name=ScratchPad" component={NavLink}>
                            <Typography sx={{...ScratchPadTabStyle}}>Scratch Pad</Typography> 
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={4} lg={2.4} sx={{ px: 1, py: 2 }}>
                        <Card sx={{ ...AddActionCard }} to="application/edit-action/Add" component={NavLink}>
                            <Box sx={{ height: '12vh', p: 3 }}>
                                <Typography sx={{ ...ActionCardHeader }}>Create New action</Typography>
                                <Typography sx={{...appname}}>Name : {props.searchQuery}</Typography>
                            </Box>
                            <Box sx={{borderTop:'1px solid #7cf786',textAlign:'center'}}>
                                <AddIcon sx={{...AddIconCss}} />
                            </Box>
                        </Card>
                    </Grid>
                    {actionDefinitionRows}

                </Grid>
            </Box>
        </>
    )
}

export type DetailViewProps = {
    searchQuery?: string,
    tableId?: string,
    fromAddActionView?: boolean,
    onAddAction?: (actionId: string) => void
}

export function DetailView(props: DetailViewProps) {
    const prebuiltAppsQuery = useGetPrebuiltApplications()
    const [selectedAppId, setSelectedAppId] = React.useState<string | undefined>()
    const filteredPrebuiltAppsData = !!selectedAppId ? prebuiltAppsQuery?.data?.filter(data => data?.ApplicationId === selectedAppId) : prebuiltAppsQuery?.data

    React.useEffect(() => {
        if (!!props?.searchQuery) {
            setSelectedAppId(undefined)
        }
    }, [props?.searchQuery])

    const appLabels = prebuiltAppsQuery?.data?.map(data => <ApplicationLabel
        ApplicationId={data?.ApplicationId}
        ApplicationName={data?.ApplicationName}
        ActionCount={data?.NumberOfActions}
        FlowCount={data?.NumberOfFlows}
        onLabelClick={(applicationId?: string) => {
            console.log(applicationId, selectedAppId)
            setSelectedAppId(oldId => oldId === applicationId ? undefined : applicationId)
        }
        }
        isSelected={selectedAppId === data?.ApplicationId}
    />)

    const applicationActions = filteredPrebuiltAppsData?.map(data => <ApplicationDetailView
        app={data}
        searchQuery={props?.searchQuery}
        tableId={props?.tableId}
        isSelected={selectedAppId === data?.ApplicationId}
        fromAddActionView={props.fromAddActionView}
        onAddAction={props.onAddAction}
    />)

    return (
        <Box sx={{ ...DialogBody }}>
            <Box sx={{ ...AllPackageList }}>
                    <Box onClick={() => setSelectedAppId(undefined)} sx={{ cursor: "pointer" }}>
                        <Typography sx={{ ...PackageTabHeader }}>All Packages</Typography>
                    </Box>
                    <Box sx={{height:'60vh',overflow:'scroll'}}>
                    {appLabels}
                    </Box>

                    {!props.fromAddActionView && <Box sx={{...seemoremarcketplace}} to={APPLICATION_ROUTE_MARKETPLACE} component={NavLink}>
                        <img width='20px' height='20px' src={MarcketPlaceIcon } alt="" />
                        See more in marketplace
                        </Box>
                    }
            </Box>
            <Box sx={{ ...AllApps }}>{applicationActions}</Box>
        </Box>
    )
}

type ApplicationLabelProps = {
    ApplicationId?: string,
    ApplicationName?: string,
    ActionCount?: number,
    FlowCount?: number,
    isSelected?: boolean,
    onLabelClick: (applicationId?: string) => void
}
function ApplicationLabel(props: ApplicationLabelProps) {
    return (
        <Box onClick={() => { props.onLabelClick(props?.ApplicationId) }} sx={{ my: 2, display: 'flex', px: 4, py: 1, textDecoration: 'none', backgroundColor: props?.isSelected && "#eeeeee", ":hover": { backgroundColor: '#EAEBEF' }, cursor: "pointer" }}>
            <Typography sx={{ ...PackagesNameStyle }}>
                <LinesEllipsis
                    text={props?.ApplicationName}
                    maxLine='1'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                />
            </Typography>
            <Typography sx={{ ...NumberofItemInPackage }}>{(props?.FlowCount || 0) + (props?.ActionCount || 0)}</Typography>
        </Box>
    )
}

type ApplicationDetailViewProps = {
    app?: ApplicationCardViewResponse,
    tableId?: string,
    searchQuery?: string,
    isSelected?: boolean,
    fromAddActionView?: boolean,
    onAddAction?: (actionId: string) => void
}
function ApplicationDetailView(props: ApplicationDetailViewProps) {
    const { app } = props
    const [applicationDetailData, applicationDataError, applicationDetailLoading] = useGetApplicationDetails(app?.ApplicationId || '0')
    const appDetailData = applicationDetailData?.[0]
    const allActions = appDetailData?.actions
    const filteredActions = allActions?.filter(action => action?.model?.DisplayName?.toLowerCase()?.includes((props?.searchQuery || "").toLowerCase()))
    const actions = props?.isSelected ? allActions : filteredActions?.slice(0, 3)

    return (actions?.length || 0) > 0 ?
        <ReactQueryWrapper
            isLoading={applicationDetailLoading}
            error={applicationDataError}
            data={applicationDetailData}
            children={() => (
                <Box sx={{ px: 4, py: 2, }}>
                    <Box sx={{ display: 'flex', px: 1 }}>
                        <Box sx={{ ...PackagesNameStyleR }}>{appDetailData?.model?.Name}</Box>
                        <Box sx={{ ...SeeAllPackage }} to={generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: appDetailData?.model?.Id })} component={RouterLink}>See all</Box>
                    </Box>
                    <Grid container spacing={2}>
                        {actions?.map(action =>
                            <Grid item xs={4}>
                                <AppCard onAddAction={props.onAddAction} fromAddActionView={props.fromAddActionView} Displayname={action?.model?.DisplayName || ""} Description={action?.model?.Description || ""} ID={action?.model?.Id} tableId={props?.tableId} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            )}
        />
        :
        <></>
}

export default RecommendedApps;