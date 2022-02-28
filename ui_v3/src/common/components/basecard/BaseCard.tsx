import {Card, CardContent, Box, Typography, Avatar, Divider, Button} from '@material-ui/core';
import { alpha, useTheme } from '@material-ui/core/styles';
import {ButtonIconWithToolTip} from "../../../pages/table_browser/components/DataSetsTable";

const NA = "NA";
export const BaseCard = ({title= NA, description=NA, background='#A4CAF0'})=>{
    const theme = useTheme();
    return <Card sx={{borderRadius: 5, background}}>
        <CardContent
            sx={{
                display: 'flex'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row'
                }}
            >
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: "space-between"
                }}
            >
                <Box>
                    <Typography
                        color="primary"
                        variant="h6"
                        sx={{mt: 2}}
                    >
                        {title}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        sx={{ mt: 0 }}
                    >
                        {description}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'row',
                        mt: 2,
                        gap: 1,
                        alignItems: "flex-end"
                    }}
                >
                <Avatar
                    alt={title.split(' ').map(text=>text.charAt(0)).join('')}
                    sx={{
                        backgroundColor: alpha(theme.palette.success.main, 0.08),
                        color: 'success.main',
                        boxShadow: theme.shadows[0],
                        borderRadius: 100
                    }}
                />
                    <Avatar
                        alt={title.split(' ').map(text=>text.charAt(0)).join('')}
                        sx={{
                            backgroundColor: alpha(theme.palette.success.main, 0.08),
                            color: 'success.main',
                            boxShadow: theme.shadows[10],
                            borderRadius: 100
                        }}
                    />
                </Box>

                </Box>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                }}>
                    <ButtonIconWithToolTip Icon={()=><div>Icon</div>} title={"title"} onClick={()=>{}}/>
                    <ButtonIconWithToolTip Icon={()=><div>Icon</div>} title={"title"} onClick={()=>{}}/>
                    <ButtonIconWithToolTip Icon={()=><div>Icon</div>} title={"title"} onClick={()=>{}}/>
                </Box>
            </Box>

        </CardContent>

    </Card>;
};
