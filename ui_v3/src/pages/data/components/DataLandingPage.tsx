import { Box, Button, Card, Dialog, DialogTitle, Grid, IconButton, InputAdornment, Typography } from "@mui/material";
import { ActionCardButtonContainer, ActionCardConatier, ActionCardDescription, ActionCardHeader, AllApps, appCardContainer, ContainerHeader, DialogBGcolor, DialogBody, DialogHeader, HeaderButtonsStyle, IconConatiner, NumberofItemInPackage, PackagesNameStyle, PackagesNameStyleR, PackageTabHeader, SearchBarDialogTextField, SearchBarTextField, SeeAllPackage, StyledTypographyDataHeader } from "./StyledComponents";
import UploadFileIcon from "../../../images/uploadFile.svg"
import CreateConnectionIcon from "../../../images/createConnection.svg"
import SaveIcon from "../../../images/SaveIcon.svg"
import SettingIcon from "../../../images/editAction.svg"
import RunIcon from "../../../images/runAction.svg"
import labels from "../../../labels/labels";
import SearchIcon from '@mui/icons-material/Search';
import React, { useContext, useEffect } from "react";
import useFetchActionDefinitionForSelector from "../../../edit-action-new/hooks/useFetchActionDefinitionForSelector"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import { DATA_CONNECTIONS_UPLOAD_ROUTE, DATA_CONNECTION_CHOOSE } from "../../../common/components/header/data/DataRoutesConfig";
import { generatePath, Link as RouterLink, Route, Switch } from "react-router-dom";
import { SetModuleContextState } from "../../../common/components/ModuleContext";
import AppCard from "./AppCard";
import { useGetPrebuiltApplications } from "../../../common/components/application/hooks/useGetPrebuildApplications";
import { ActionDetailsForApplication, ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces";
import useGetApplicationDetails from "../../apps/hooks/useGetApplicationDetails";
import { filter } from "lodash";
import { APPLICATION_DETAIL_ROUTE_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig";
import CloseIcon from '@mui/icons-material/Close';
import LinesEllipsis from "react-lines-ellipsis";



export const DataLandingPage = () => {
    const HeaderString = "Upload csv or select a table to explore"
    const { data, isLoading, error } = useFetchActionDefinitionForSelector({})

    // const { data, isLoading, error } = useFetchActionDefinitions({})
    const [searchQuery, setSearchQuery] = React.useState("")
    const filteredData = (data || [])?.filter(ad => ad?.ActionDisplayName?.includes?.(searchQuery))
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [])
    const actionDefinitionRows = filteredData?.map?.(ad =>
        <Grid item xs={6} md={4} lg={2.4} sx={{...appCardContainer}}>
            <AppCard Displayname={ad.ActionDisplayName || ""} Description={ad.ActionDisplayName || ""} ID={ad.ActionId} />
        </Grid>
    )
    const [opener, setOpener] = React.useState<boolean>(false);
    console.log(opener)
    const prebuiltAppsQuery = useGetPrebuiltApplications()
    const [dialogsearchQuery, setDialogSearchQuery] = React.useState("")
    const packageItem = (prebuiltApplications: ApplicationCardViewResponse[] | undefined) => {
        const filterData = (prebuiltApplications || []).filter(pk => pk?.ApplicationName?.includes?.(dialogsearchQuery))
        return filterData.map(pk =>
            <Box to={generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: pk.ApplicationId })} component={RouterLink} sx={{ my: 2, display: 'flex', px: 4, py: 1, textDecoration: 'none', ":hover": { backgroundColor: '#EAEBEF' } }}>
                <Typography sx={{...PackagesNameStyle}}>
                    <LinesEllipsis
                        text={pk.ApplicationName}
                        maxLine='1'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                    />
                </Typography>
                <Typography sx={{...NumberofItemInPackage}}>{(pk.NumberOfFlows || 0) + (pk.NumberOfActions || 0)}</Typography>
            </Box>

        )
    }
    const AllPackageList = () => {
        return (
            <>
                <Box>
                    <Typography sx={{...PackageTabHeader}}>All Packages</Typography>
                    {packageItem(prebuiltAppsQuery.data)}
                </Box>


            </>
        )
    }
    const AppsInDialog = (filterActions: ActionDetailsForApplication[] | undefined) => {
        const AllActions = filterActions?.slice(0, 3) || []
        return AllActions.map(ac =>
            <Grid item xs={4} sx={{ px: 1 }}>
                <AppCard Displayname={ac.model?.DisplayName || ""} Description={ac.model?.Description || ""} ID={ac.model?.Id} />
            </Grid>
        )
    }
    const ApplicationDetailsApps = (prebuiltApplications: ApplicationCardViewResponse[] | undefined) => {
        const filterData = (prebuiltApplications || []).filter(pk => pk?.ApplicationName?.includes?.(dialogsearchQuery))
        return filterData.map(pk => {
            const [applicationDetailData, applicationDataError, applicationDetailLoading] = useGetApplicationDetails(pk.ApplicationId || '0')
            if (!!applicationDetailData) {
                const application = applicationDetailData[0]
                return <Box sx={{ px: 4, py: 2, }}>
                    <Box sx={{ display: 'flex', px: 1 }}>
                        <Box sx={{...PackagesNameStyleR}}>{application.model?.Name}</Box>
                        <Box sx={{...SeeAllPackage}} to={generatePath(APPLICATION_DETAIL_ROUTE_ROUTE, { applicationId: application.model?.Id })} component={RouterLink}>See all</Box>
                    </Box>
                    <Grid container>
                        {/* <ReactQueryWrapper
                            isLoading={applicationDetailLoading}
                            error={applicationDataError}
                            data={applicationDetailData}
                            children={() => AppsInDialog(application.workflows)}
                        /> */}
                        <ReactQueryWrapper
                            isLoading={applicationDetailLoading}
                            error={applicationDataError}
                            data={applicationDetailData}
                            children={() => AppsInDialog(application.actions)}
                        />
                    </Grid>
                </Box>

            }
        })
    }
    const DetailsDialoge = () => {
        return (<>
            <Dialog fullWidth={true} maxWidth={'lg'} open={opener}>
                <Box sx={{...DialogBGcolor}}>
                    <Box sx={{...DialogHeader}}>
                        <SearchBarDialogTextField variant="standard" size='small'
                            value={dialogsearchQuery}
                            onChange={(event) => setDialogSearchQuery(event.target.value)}
                            placeholder={'Search for Apps'}
                            multiline={true}
                            onKeyDown={(event)=>{event.stopPropagation()}}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ marginLeft: 1 }} />
                                    </InputAdornment>
                                )
                            }} />
                        <IconButton sx={{ ml: 'auto', mr: 4 }} onClick={() => { setOpener(false) }}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{...DialogBody}}>
                        <Box sx={{...AllPackageList}}><AllPackageList /></Box>
                        <Box sx={{...AllApps}}>{ApplicationDetailsApps(prebuiltAppsQuery.data)}</Box>
                    </Box>
                </Box>
            </Dialog>
        </>
        )
    }

    return (
        <Box sx={{ mt: 10,mx:6 }}>
            <DetailsDialoge />
            <Box>
                <StyledTypographyDataHeader>
                    {HeaderString}
                </StyledTypographyDataHeader>
            </Box>
            <Box sx={{ ...IconConatiner }}>
                <Box sx={{...HeaderButtonsStyle }} to={DATA_CONNECTION_CHOOSE} component={RouterLink}><img width='100px' height='100px' src={CreateConnectionIcon} alt="" /></Box>
                <Box sx={{...HeaderButtonsStyle }} to={DATA_CONNECTIONS_UPLOAD_ROUTE} component={RouterLink}><img width='100px' height='100px' src={UploadFileIcon} alt="" /></Box>
            </Box>
            <Box sx={{ py: 2 }}>
                <SearchBarTextField variant="standard"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={labels.AddActionPage.searchText}
                    multiline={true}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ marginLeft: 1 }} />
                            </InputAdornment>
                        )
                    }} />
            </Box>
            <Box sx={{ ...ActionCardConatier }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ ...ContainerHeader }}>Recommended Apps</Typography>
                    <Button sx={{ ml: 'auto' }} onClick={() => { setOpener(true) }}>See All</Button>
                </Box>
                <Grid container>
                    <ReactQueryWrapper
                        isLoading={isLoading}
                        error={error}
                        data={data}
                        children={() => actionDefinitionRows}
                    />
                </Grid>
            </Box>
        </Box>
    )

}

export default DataLandingPage;