import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ConnectionStateContext } from '../../configurations/context/ConnectionsContext';
import { CHOOSE_CONNECTOR_SELECTED_ROUTE, connectionsRoutes } from "./DataRoutesConstants";


export const  ConnectionBreadCrumbs = () => {
    const connectionState = React.useContext(ConnectionStateContext)
    const crumbs = connectionsRoutes.reduce((a: typeof connectionsRoutes, r)=>{
        if(r.href === CHOOSE_CONNECTOR_SELECTED_ROUTE){
            if(connectionState?.ProviderDefinitionDetail !== undefined) {
                a.push({
                    href: r.href,
                    label: r.labelCreator? r.labelCreator(
                        connectionState?.ProviderDefinitionDetail?.ProviderDefinition?.ProviderType,
                        connectionState?.ProviderDefinitionDetail?.ProviderDefinition?.UniqueName
                    ): r.label
                });
            }
        }else{
            a.push(r);
        }
        return a;
    }, []);

    const breadcrumbs = crumbs.map(({href, label}, index)=>{
        if(index === crumbs.length - 1){
            return <Typography key="3" color="text.primary">
                {label}
            </Typography>
        }else{
            return <Link underline="hover" key="1" color="inherit" to={href} component={RouterLink}>
                {label}
            </Link>
        }
    });
    return (
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
    );
}
