import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {Link as RouterLink} from 'react-router-dom';
import {useConnectionProviders} from "./hooks/useConnectionProviders";
import {CHOOSE_CONNECTOR_SELECTED_ROUTE, connectionsRoutes} from "./DataRoutesConstants";


export const  ConnectionBreadCrumbs = () => {
    const {currentProvider} = useConnectionProviders();
    const crumbs = connectionsRoutes.reduce((a: typeof connectionsRoutes, r)=>{
        if(r.href === CHOOSE_CONNECTOR_SELECTED_ROUTE){
            if(currentProvider !== undefined) {
                a.push({
                    href: r.href,
                    label: r.labelCreator? r.labelCreator(
                        currentProvider.ProviderDefinition.ProviderType,
                        currentProvider.ProviderDefinition.UniqueName
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
