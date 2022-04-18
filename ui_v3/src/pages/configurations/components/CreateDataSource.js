import CloseIcon from "@mui/icons-material/Close"
import { Box, Container, Grid, IconButton, Link, TextField } from "@mui/material"
import React from 'react'
import { useHistory, useRouteMatch } from "react-router-dom"
import LoadingIndicator from '../../../common/components/LoadingIndicator'
import useStyles from './../../../css/configurations/CreateDataSource'
import { useRetreiveData } from './../../../data_manager/data_manager'
import labels from './../../../labels/labels'
import CreateDataSourceRow from "./ProviderParameterInput"


const filterOptionsMap = {
    "Provider Name": "UniqueName",
    "Description": "Description"
}

const filterOptionItems = [
    {
        "value": "Provider Name",
        "display": "Provider Name"
    },
    {
        "value": "Description",
        "display": "Description"
    }
]

const CreateDataSourceInternal = ({handleClose}) => {
    const classes = useStyles()
    const queryKey = 'CreateProvidersProviderDefinition'
    const [searchQuery, setSearchQuery] = React.useState("")

    const [filterOption, setFilterOption] = React.useState("Provider Name")
    const history = useHistory();
    let match = useRouteMatch();

    const {isLoading, error, data} = useRetreiveData(labels.entities.ProviderDefinition, {
        "filter": {
            "ProviderType": "DataSource"
        },
        "withProviderParameterDefinition": true
    });

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = () => {
        const filterKey = filterOptionsMap[filterOption]
        const rows = data?.filter(elem =>
            elem["ProviderDefinition"][filterKey].toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
        );
        console.log(rows);
        return rows;
    }
    const rows = searchResults(data)?.map(row => {
        const model = row?.ProviderDefinition || {};
        model.id = model.Id;
        return model;
    });
    const [selectedId, setSelectedId] = React.useState(rows?.[0]?.id);
    const columns = [
        {
            field: "UniqueName",
            headerName: "Name",
            description: `UniqueName of Data Source`,
            sortable: true,
            flex: 1,
        }, {
            field: "SourceURL",
            headerName: "Source URL",
            description: `Source URL`,
            sortable: true,
            flex: 1,
            renderCell: (params) => <Link href={params.row.SourceURL} target="_blank"
                                       rel="noreferrer"> {labels.CreateDataSourceRow.visit_provider} </Link>
        }, {
            field: "Description",
            headerName: "Description",
            description: `Description`,
            sortable: true,
            flex: 1,
        },
    ];
    if (isLoading) {
        return (<LoadingIndicator/>)
    } else if (error) {
        return (<div>Error</div>)
    } else {
        return (
            <Container>
                <h2>
                    <Grid justifyContent="space-between" container>
                        <Grid item>Create Data Source</Grid>
                        <Grid item>
                            <IconButton aria-label="close" onClick={handleClose}>
                                <CloseIcon/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </h2>
                <TextField
                    fullWidth
                    label="Data Source"
                    select
                    SelectProps={{native: true}}
                    variant="outlined"
                    onChange={(e) => {
                        setSelectedId(e.target.value);
                    }}
                >
                    {rows.map(({UniqueName, Id}) => (
                        <option
                            key={Id}
                            value={Id}
                        >
                            {UniqueName}
                        </option>
                    ))}
                </TextField>
                <Box margin={2}>
                    <CreateDataSourceRow selectedId={selectedId} handleClose={handleClose}/>
                </Box>

            </Container>
        )
    }
}


export default CreateDataSourceInternal;