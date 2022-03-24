import React from 'react'
import {Grid} from '@mui/material'
import NoData from '../../../common/components/NoData';
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ChecksRow from './ChecksRow'
import Search from './../../../common/components/Search'
import SelectOption from './../../../common/components/SelectOption'
import {useRetreiveData} from "../../../data_manager/data_manager";


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

export const useTablePropertiesWithChecksQuery = (tableId) => useRetreiveData('TableProperties', {
    "filter": {
        "Id": tableId
    },
    "withChecks": true
}, {enabled: !!tableId});
const Checks = (props) => {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterOption, setFilterOption] = React.useState("Instance Name")
    const searchValue = (props.location !== undefined && props.location.state !== undefined) ? props.location.state.search : ""

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
    } = useTablePropertiesWithChecksQuery(props.tableId)


    React.useEffect(() => {
        if (actionDefinitionData !== undefined && actionDefinitionData.length > 0) {
            const toScroll = document.getElementById('tableDetailsChecks-container')
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
            actionDefinitionData[0].Check?.ActionEntities?.forEach((actions) => {
                actions?.ActionInstances?.forEach((instance) => {
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

                    <div id="tableDetailsChecks-container">
                        <Grid container spacing={0}>
                            {
                                searchResults(data)?.map((val) => (
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