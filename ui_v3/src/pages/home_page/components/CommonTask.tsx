import { Box, List, ListItem } from "@mui/material";
import { NavLink as RouterLink } from 'react-router-dom';
import { APPLICATION_ADD_ACTION_ROUTE, APPLICATION_BUILD_FLOW_ROUTE_ROUTE, APPLICATION_CREATION_WIZARD_ROUTE, APPLICATION_ROUTE, APPPLICATION_CREATE_AUTO_FLOW } from '../../../common/components/route_consts/data/ApplicationRoutesConfig';
import { DATA_ALL_TABLES_ROUTE, DATA_CONNECTIONS_ROUTE, DATA_CONNECTION_CHOOSE } from "../../../common/components/route_consts/data/DataRoutesConfig";
import { INSIGHTS_ROUTE } from "../../../common/components/route_consts/data/RoutesConfig";
import { HeadeCssOfCard, TypographyForCommon } from './CSS/CssProperties';

type commonItems = {
    Name : string,
    URL : string
}


const packageItems: commonItems[]=[
    {Name:'Create - ',URL : APPLICATION_CREATION_WIZARD_ROUTE},
    {Name:"Package " , URL : APPLICATION_CREATION_WIZARD_ROUTE},
    {Name:'Action ' , URL : APPLICATION_ADD_ACTION_ROUTE},
    {Name:'Flow ' , URL : APPLICATION_BUILD_FLOW_ROUTE_ROUTE}

]

const AllItems: commonItems[][] = [
    [{Name: 'Connect Data' , URL: DATA_CONNECTION_CHOOSE}],
    packageItems,
    [{Name: 'Applications' , URL: APPLICATION_ROUTE}],
    [{Name: 'Insights', URL : INSIGHTS_ROUTE}],
    [{Name: 'All data sets', URL : DATA_ALL_TABLES_ROUTE}],
    [{Name: 'Create Autoflow', URL : APPPLICATION_CREATE_AUTO_FLOW }],
    [{Name: 'All Connections', URL : DATA_CONNECTIONS_ROUTE}]
]

const ShowAllItems = ()=>{
    return AllItems.map(Items=>
                        <ListItem>
                            {Items.map(it=>
                                <RouterLink style={{textDecoration: 'none'}} to={it.URL}>
                                    {/* <Connection/> */}
                                    <TypographyForCommon >
                                        {it.Name}
                                    </TypographyForCommon>
                                </RouterLink>
                            )}
                        </ListItem>)
}

export const CommonTask = ()=>{
    return(
        <Box>
            <HeadeCssOfCard>
                Common Task
            </HeadeCssOfCard>
            <Box>
                <List>
                {ShowAllItems()}
                </List>
            </Box>
        </Box>
    )
}

export default CommonTask;