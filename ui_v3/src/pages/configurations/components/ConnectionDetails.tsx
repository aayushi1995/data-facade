import React from "react";
import { ConnectionStateContext } from "../context/ConnectionsContext";


export const ConnectionDetails = () => {
    const connectionState = React.useContext(ConnectionStateContext);
    return <></>
    // const details = providerHistoryAndParametersQueryData?.data?.[0];
    // const theme = useTheme();
    // const today = new Date();    
    // const days = [...new Array(5)].map((_) => {
    //     today.setDate(today.getDate() + 1);
    //     return today.toString().slice(0, 10);
    // });

    // return selectedConnectionId ? <Box sx={{
    //     boxShadow: theme.shadows[20]
    // }}>
    //     <ReactQueryWrapper {...providerHistoryAndParametersQueryData} sx={{
    //         minHeight: 500,
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center'
    //     }}>
    //         {() => <Stack direction={"row"} sx={{p: 2}} gap={2}>
    //             <Stack direction={"column"} flex={1}>
    //                 <CreateDataSourceRow
    //                     isUpdate
    //                     selectedId={selectedConnectionId}
    //                     handleClose={() => {
    //                     }}/>
    //             </Stack>
    //             <Box sx={{m: 2}}>
    //                 <Divider orientation="vertical" sx={{height: "100%"}}/>
    //             </Box>
    //             <Stack direction={"column"} flex={2} gap={4} mt={3}>
    //                 <Typography variant={'body1'}>
    //                     Number of actions run per day
    //                 </Typography>
    //                 <BarChart
    //                     dataX = {days}
    //                     dataY = {details?.history || []}
    //                 />
    //                 <Stack direction={"row"}>
    //                     <Paper sx={{p: 2}}>
    //                         <Stack direction='column' gap={2}>
    //                             <Typography>
    //                                 Number of failed actions
    //                             </Typography>
    //                             <Typography variant="h5">
    //                                 {details?.failedActions}
    //                             </Typography>
    //                         </Stack>
    //                     </Paper>
    //                 </Stack>
    //             </Stack>
    //         </Stack>}
    //     </ReactQueryWrapper>
    // </Box> : null;
}