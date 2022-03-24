import React, {useContext} from 'react'
import {Grid} from '@mui/material'
import NoData from '../../../common/components/NoData';
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import {useQuery} from 'react-query'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ChecksRow from './ChecksRow'
import Search from './../../../common/components/Search'
import SelectOption from './../../../common/components/SelectOption'
import AppContext from "../../../utils/AppContext";


const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;
const endPoint = require("./../../../common/config/config").FDSEndpoint

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
        },
    },
};


const filterOptionItems = [
    {
        "value": "Instance Name",
        "display": "Instance Name"
    },
    {
        "value": "Definition Name",
        "display": "Definition Name"
    }
]

const filterOptionsMap = {

    "Instance Name": "InstanceName",
    "Definition Name": "DefinitionName"
}

const Checks = (props) => {
    const appcontext = useContext(AppContext);
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Instance Name")
    const searchValue = (props.location !== undefined && props.location.state !== undefined) ? props.location.state.search : ""
    const email = appcontext.userEmail
    const token = appcontext.token

    const actionDefinitionConfig = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "entityName": "ColumnProperties",
            "actionProperties": {
                "filter": {
                    "Id": props.columnId
                },
                "withChecks": true
            }
        })
    }

    const searchQueryHandler = (event) => {
        setSearchQuery(event.target.value)
    }

    const filterOptionHandler = (event) => {
        setFilterOption(event.target.value)
    }

    const searchResults = (myData) => {
        return myData.filter(elem => {
                switch (filterOption) {
                    case "Instance Name":
                        return (elem.instance.ActionInstance.DisplayName || "").toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""
                    case "Definition Name":
                        return (elem.action.ActionDefinition.UniqueName || "").toLowerCase().search(searchQuery.toLowerCase()) >= 0 || searchQuery === ""

                }
            }
        )
    }

    const {
        isLoading: actionDefinitionLoading,
        error: actionDefinitionError,
        data: actionDefinitionData
    } = useQuery(`FetchActionDefinitionInCheckColumn${props.columnId}`, () =>
        fetch(endPoint + '/entity/getproxy?email=' + email, actionDefinitionConfig).then(res => res.json()))


    React.useEffect(() => {
        if (actionDefinitionData !== undefined && actionDefinitionData.length > 0) {
            const toScroll = document.getElementById('columnDetailsCheck-container')
            toScroll.style.overflow = 'auto';
            toScroll.style.maxHeight = `${window.innerHeight - toScroll.offsetTop - 50}px`;

        }
    }, [actionDefinitionData])

    if (actionDefinitionLoading) {
        return <LoadingIndicator/>
    } else if (actionDefinitionError) {
        return <NoData/>
    } else {
        if (actionDefinitionData === undefined || actionDefinitionData.length === 0) {
            return (<NoData/>)
        } else {
            const data = []
            actionDefinitionData[0].Check.ActionEntities.forEach((actions) => {
                actions.ActionInstances.forEach((instance) => {
                    data.push({action: actions, instance: instance})
                })
            })
            return (
                <React.Fragment>
                    <Grid container spacing={2}>
                        <Grid item xs={2} style={{marginLeft: 40, marginRight: 40}}>
                            <SelectOption filterOptionHandler={filterOptionHandler} menuItems={filterOptionItems}
                                          filterOption={filterOption}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Search searchQueryHandler={searchQueryHandler} searchValue={searchValue}/>
                        </Grid>
                    </Grid>

                    <div id="columnDetailsCheck-container">
                        <Grid container spacing={0}>
                            {
                                searchResults(data).map((val) => (
                                    <Grid item xs={12}>
                                        <ChecksRow action={val.action} instance={val.instance}/>
                                    </Grid>
                                ))

                            }
                        </Grid>
                    </div>

                </React.Fragment>
            )
        }
    }
}

export default Checks;