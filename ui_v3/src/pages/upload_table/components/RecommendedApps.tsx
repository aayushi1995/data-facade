import { Box, Button, Dialog, Grid, IconButton, InputAdornment, Typography } from "@mui/material";
import React from "react";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import useFetchActionDefinitionForSelector from "../../../edit-action-new/hooks/useFetchActionDefinitionForSelector";
import AppCard from "../../data/components/AppCard";
import { ActionCardConatier, AllApps, AllPackageList, ContainerHeader, DialogBGcolor, DialogBody, DialogHeader, NumberofItemInPackage, PackagesNameStyle, PackagesNameStyleR, PackageTabHeader, SearchBarDialogTextField, SearchBarTextField, SeeAllPackage, StyledTypographyDataHeader } from "../../data/components/StyledComponents";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { ActionDetailsForApplication, ApplicationCardViewResponse, ApplicationDetails } from "../../../generated/interfaces/Interfaces";
import { generatePath, Link as RouterLink } from "react-router-dom";
import { APPLICATION_DETAIL_ROUTE_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig";
import useGetApplicationDetails from "../../apps/hooks/useGetApplicationDetails";
import { useGetPrebuiltApplications } from "../../../common/components/application/hooks/useGetPrebuildApplications";
import LinesEllipsis from "react-lines-ellipsis";

export type RecommendedAppsProps = {
    searchQuery?: string,
    tableId?: string
}

function RecommendedApps(props: RecommendedAppsProps) {
    const propsSearchQuery = props?.searchQuery?.toLowerCase() || ""
    const { data, isLoading, error } = useFetchActionDefinitionForSelector({})
    const filteredData = data?.filter(action => action?.ActionDisplayName?.toLowerCase()?.includes(propsSearchQuery))
    const [dialogState, setDialogState] = React.useState<boolean>(false)
    const [dialogsearchQuery, setDialogSearchQuery] = React.useState<string>(propsSearchQuery)
    
    const actionDefinitionRows = <ReactQueryWrapper
        isLoading={isLoading}
        error={error}
        data={data}
        children = {() => filteredData?.map?.(ad =>
            <Grid item xs={6} md={4} lg={2.4} sx={{px:1,py:2}}>
                <AppCard Displayname={ad.ActionDisplayName || ""} Description={ad.ActionDisplayName || ""} ID={ad.ActionId} />
            </Grid>
        )}
    />

    return (
        <>
            <Box>
                <Dialog fullWidth={true} maxWidth={'lg'} open={dialogState}>
                    <Box sx={{...DialogHeader}}>
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
                        onSearchQueryChange={(newSearchQuery) => setDialogSearchQuery(newSearchQuery)}
                    />
                </Dialog>
            </Box>
            <Box sx={{ ...ActionCardConatier }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ ...ContainerHeader }}>Recommended Apps</Typography>
                    <Button sx={{ ml: 'auto' }} onClick={() => { setDialogState(true) }}>See All</Button>
                </Box>
                <Grid container>
                    {actionDefinitionRows}
                </Grid>
            </Box>
        </>
    )
}

type DetailViewProps = {
    searchQuery?: string,
    onSearchQueryChange?: (newSearchQuery: string) => void
}

function DetailView(props: DetailViewProps) {
    const prebuiltAppsQuery = useGetPrebuiltApplications()
    const filteredPrebuiltAppsData = prebuiltAppsQuery?.data?.filter(data => data?.ApplicationName?.includes(props?.searchQuery || ""))

    const appLabels = filteredPrebuiltAppsData?.map(data => <ApplicationLabel 
        ApplicationName={data?.ApplicationName} 
        ActionCount={data?.NumberOfActions}
        FlowCount={data?.NumberOfFlows}
        onLabelClick={(applicationName: string) => props?.onSearchQueryChange?.(applicationName)}
    />)

    const applicationDetailsApps = filteredPrebuiltAppsData?.map(data => <ApplicationDetailView app={data} showAllActions={filteredPrebuiltAppsData?.length === 1}/>)

    return (
        <Box sx={{...DialogBody}}>
            <Box sx={{...AllPackageList}}>
                <Box>
                    <Box onClick={() => props?.onSearchQueryChange?.("")} sx={{ cursor: "pointer" }}>
                        <Typography sx={{...PackageTabHeader}}>All Packages</Typography>
                    </Box>
                    {appLabels}
                </Box>
            </Box>
            <Box sx={{...AllApps}}>{applicationDetailsApps}</Box>
        </Box>
    )
}

type ApplicationLabelProps = {
    ApplicationName?: string,
    ActionCount?: number,
    FlowCount?: number,
    onLabelClick: (applicationName: string) => void
}
function ApplicationLabel(props: ApplicationLabelProps) {
    return (
        <Box onClick={()=>{props.onLabelClick(props?.ApplicationName || "")}} sx={{ my: 2, display: 'flex', px: 4, py: 1, textDecoration: 'none', ":hover": { backgroundColor: '#EAEBEF' } }}>
            <Typography sx={{...PackagesNameStyle}}>
                <LinesEllipsis
                    text={props?.ApplicationName}
                    maxLine='1'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                />
            </Typography>
            <Typography sx={{...NumberofItemInPackage}}>{(props?.FlowCount || 0) + (props?.ActionCount || 0)}</Typography>
        </Box>
    )
}

type ApplicationDetailViewProps = {
    app?: ApplicationCardViewResponse,
    showAllActions: boolean
}
function ApplicationDetailView(props: ApplicationDetailViewProps) {
    const { app } = props
    const [applicationDetailData, applicationDataError, applicationDetailLoading] = useGetApplicationDetails(app?.ApplicationId || '0')
    const appDetailData = applicationDetailData?.[0]
    const getActions = () => props?.showAllActions ? appDetailData?.actions : appDetailData?.actions?.slice(0, 3)

    return (
        <ReactQueryWrapper
            isLoading={applicationDetailLoading}
            error={applicationDataError}
            data={applicationDetailData}
            children={() => (
                <Box sx={{ px: 4, py: 2, }}>
                <Box sx={{ display: 'flex', px: 1 }}>
                    <Box sx={{...PackagesNameStyleR}}>{appDetailData?.model?.Name}</Box>
                    <Box sx={{...SeeAllPackage}} to={generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: appDetailData?.model?.Id })} component={RouterLink}>See all</Box>
                </Box>
                <Grid container>
                    {getActions()?.map(action =>
                        <Grid item xs={4} sx={{ px: 1 }}>
                            <AppCard Displayname={action?.model?.DisplayName || ""} Description={action?.model?.Description || ""} ID={action?.model?.Id} />
                        </Grid>
                    )}
                </Grid>
            </Box>
            )}
        />
    )
}

export default RecommendedApps;