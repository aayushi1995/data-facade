import useSlackInstallURL from '@/components/common/useSlackInstallURL';
// import GoogleAuth from '@/components/google/GoogleAuth';
// import ImportGoogleSheet from '@/components/google/ImportGoogleSheet';
// import ImportS3File from '@/components/google/ImportS3File';
import { ReactQueryWrapper } from '@/components/ReactQueryWrapper/ReactQueryWrapper';
import { ConnectionsProvider, ConnectionStateContext } from '@/contexts/ConnectionsContext';
import { Fetcher } from '@/generated/apis/api';
import { ProviderDefinitionDetail } from '@/generated/interfaces/Interfaces';
import ProviderDefinitionId from '@/helpers/enums/ProviderDefinitionId';
import labels from '@/utils/labels';
import React from "react";
import { useQuery } from "react-query";
import { generatePath, Route, Routes, useNavigate } from "react-router-dom";
import { ProviderInputConnectionStateWrapper } from "./ProviderParameterInput";
import {
    CHOOSE_CONNECTOR_ROUTE,
    CHOOSE_CONNECTOR_SELECTED_ROUTE
} from "./DataRoutesConstants";
import { iconProviderMap } from "./iconProviderMap";
import { Button, Card, Col, Input, Row, Typography } from 'antd';
import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CardDesc, CardUniqeName, StyledConnectioncard, StyledIconContainer } from './ConnectionPage.style';
import Paragraph from 'antd/es/typography/Paragraph';
import { BtnText, ChatCreateButton, HeaderTextTypo, HeaderTypo, InputStyle } from '@/components/LandingPageHeader/LandingPageHeader.style';




export function ProviderIcon({ providerUniqueName, height , width }: {providerUniqueName?: string, height?: number, width?: number}) {

    // ignoring because server should send ProviderType with only legit enum UniqueNames in its type
    // @ts-ignore
    const src = (providerUniqueName && (providerUniqueName in iconProviderMap))? iconProviderMap[providerUniqueName]: '';
    return src? <img src={src}
                height={height || 24}
                width={width || 24}
                alt={providerUniqueName}
    />: null;
}

function ConnectorCard(props: { onClick?: () => void, provider: ProviderDefinitionDetail }
) {
    const connectionState = React.useContext(ConnectionStateContext)

    return <StyledConnectioncard >
        <div>
            <StyledIconContainer><ProviderIcon providerUniqueName={props.provider.ProviderDefinition?.UniqueName || "NA"}/></StyledIconContainer>
            <CardUniqeName>{props.provider?.ProviderDefinition?.UniqueName}</CardUniqeName>
            <CardDesc ellipsis={{ rows: 2} }>{props.provider?.ProviderDefinition?.Description}</CardDesc>
            <Button type="primary" ghost onClick={props.onClick} block>
            <PlusOutlined /> Connect
            </Button>
        </div>
    </StyledConnectioncard>;
}

export const ConnectionDialogContent = () => {
    const [searchText, setSearchText] = React.useState<string>('');
    const providerDefinitionQuery = useQuery([labels.entities.ProviderDefinition, "Detail"], () => Fetcher.fetchData("GET", "/providerDefinitionDetail", { IsVisibleOnUI: true }))
    const history = useNavigate();
    const { url: slackInstallUrl } = useSlackInstallURL()
    const searchPredicate = (provider: ProviderDefinitionDetail) => !!searchText && provider?.ProviderDefinition ?
        (provider?.ProviderDefinition?.UniqueName||"").toLowerCase().includes(searchText.toLowerCase()) : true;

    const providerComponents = {
        [ProviderDefinitionId.SLACK]: (provider: ProviderDefinitionDetail) => 
            slackInstallUrl && <ConnectorCard onClick={() => window.open(slackInstallUrl)} provider={provider}/>,

        // [ProviderDefinitionId.GOOGLE_SHEETS]: (provider: ProviderDefinitionDetail) => 
        //     <GoogleConnectorCard provider={provider}/>,
        // [ProviderDefinitionId.S3]: (provider: ProviderDefinitionDetail) => <S3ConnectorCard provider={provider}/>,
        DEFAULT: (provider: ProviderDefinitionDetail) => <ConnectorCard onClick={() => {
            if(!!provider?.ProviderDefinition?.Id) {
                // history.push(generatePath(CHOOSE_CONNECTOR_SELECTED_ROUTE, { ProviderDefinitionId: provider?.ProviderDefinition?.Id}))
                history(`/data/source/choose/${provider?.ProviderDefinition?.Id}`)
            }
        }} provider={provider}
    />
    }

    const getProviderComponent = (provider: ProviderDefinitionDetail) => {

        const component = providerComponents?.[provider?.ProviderDefinition?.Id || "NA"] || providerComponents.DEFAULT
        return component(provider)
    }
    
    return (
        
            <>
            <Row style={{marginTop:'35px',marginBottom:'35px'}}>
            <Col span={6}>
                <HeaderTypo>Connection</HeaderTypo>
                <HeaderTextTypo>Get started with our available Connectors.</HeaderTextTypo>
            </Col>
            <Col span={10}>
                
            </Col>
            <Col span={8}>
            <Input
                        prefix={<SearchOutlined style={{color:"#9CA3AF"}}/>} size="large"
                        id="search connector"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search Connector"
                        style={InputStyle} 
                    />
            </Col>
            </Row>
                {/* <Route caseSensitive={false} path='/data'> */}
                    
                    
                    <ReactQueryWrapper
                        isLoading={providerDefinitionQuery.isLoading}
                        error={providerDefinitionQuery.error}
                        data={providerDefinitionQuery.data}
                        sx={{
                            minHeight: 200,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                    {console.log(providerDefinitionQuery.data)}
                        <Row gutter={[32, 32]}>
                            {providerDefinitionQuery.data?.filter(searchPredicate)?.map((provider, i: number) =>
                                <Col span={6}>
                                    { getProviderComponent(provider) }
                                </Col>)
                            }
                        </Row>
                    </ReactQueryWrapper>
                {/* </Route> */}
                <Routes>
                <Route path={"choose/:ProviderDefinitionId"} element={<ProviderInputConnectionStateWrapper/>}/>
                </Routes>
            </>
    )
}

// const GoogleConnectorCard = (props: { onClick?: () => {}, provider: ProviderDefinitionDetail }) => {
//     const [dialogOpen, setDialogOpen] = React.useState(false)
//     const closeDialog = () => setDialogOpen(false)
//     const openDialog = () => setDialogOpen(true)
//     return (
//         <>
//             <Dialog maxWidth="md" fullWidth open={dialogOpen} onClose={closeDialog}>
//                 <DialogTitle>
//                     <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//                         <Box>
//                             Google
//                         </Box>
//                         <IconButton aria-label="close" onClick={closeDialog}>
//                         <CloseOutlined />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ py: 1 }}>
//                         <ImportGoogleSheet/>
//                         <GoogleAuth>
//                             <Button>Add New</Button>
//                         </GoogleAuth>
//                     </Box>
//                 </DialogContent>
//             </Dialog>
//             <ConnectorCard onClick={openDialog} provider={props?.provider}/>
//         </>
//     )
// }

// const S3ConnectorCard = (props: { provider: ProviderDefinitionDetail }) => {
//     const history = useNavigate()
//     const [dialogOpen, setDialogOpen] = React.useState(false)
//     const openDialog = () => setDialogOpen(true)
//     const closeDialog = () => setDialogOpen(false)

//     const onAddNew = () => props?.provider?.ProviderDefinition?.Id && history(
//         generatePath(CHOOSE_CONNECTOR_SELECTED_ROUTE, { ProviderDefinitionId: props?.provider?.ProviderDefinition?.Id})
//         )

//     return (
//         <>
//             <Dialog maxWidth="md" fullWidth open={dialogOpen} onClose={closeDialog}>
//                 <DialogTitle>
//                     <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
//                         <Box>
//                             S3
//                         </Box>
//                         <IconButton aria-label="close" onClick={closeDialog}>
//                         <CloseOutlined />
//                         </IconButton>
//                     </Box>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ py: 1 }}>
//                         <ImportS3File/>
//                         <Button onClick={onAddNew}>
//                             Add New
//                         </Button>
//                     </Box>
//                 </DialogContent>
//             </Dialog>
//             <ConnectorCard provider={props?.provider} onClick={() => openDialog()}/>
//         </>
//     )
// }