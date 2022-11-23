import React from 'react'
import {Grid, MenuItem, Select, TextField} from '@mui/material'

/*

    Each item displayed in the form is a node having unique node number
    Create a DAG.
    Maintain an array (state) where each element will be rendered on the form.

    Pop elements from the array whenever 

    bfs will only be invoked on dropdown.

*/

const TextInputBlock = (props) => {

    return (
        <Grid container spacing={0}>
            <Grid item>
                {props.name}
            </Grid>
            <Grid item>
                <TextField fullWidth/>
            </Grid>
        </Grid>
    )
}

const SelectOptionBlock = (props) => {

    return (
        <Grid container spacing={0}>
            <Grid item>
                {props.name}
            </Grid>
            <Grid item>
                <Select
                    onChange={props.selectOptionHandler}
                >
                    {props.options.map((elem, ind) => (
                        <MenuItem value={elem}> {IdToElementsMap[elem].name} </MenuItem>
                    ))}
                </Select>
            </Grid>
        </Grid>
    )

}

const IdToElementsMap = {
    1: {
        name: "Check Name",
        id: "check-name",
        type: "TextField"
    },
    2: {
        name: "Check Type",
        id: "check-type",
        type: "SelectOption"
    },
    3: {
        name: "Range Check",
        id: "range-check",
        type: "MenuItem"
    },
    4: {
        name: "Row Count Check",
        id: "row-count-check",
        type: "MenuItem"
    },
    5: {
        name: "Null Count Check",
        id: "null-count-check",
        type: "MenuItem"
    },
    6: {
        name: "Check 4",
        id: "check-4",
        type: "MenuItem"
    },
    7: {
        name: "Data Type",
        id: "data-type",
        type: "SelectOption"
    },
    8: {
        name: "Integer",
        id: "data-type-integer",
        type: "MenuItem"
    },
    9: {
        name: "Float",
        id: "data-type-float",
        type: "MenuItem"
    },
    10: {
        name: "Date",
        id: "data-type-date",
        type: "MenuItem"
    },
    11: {
        name: "From",
        id: "data-type-integer-from",
        type: "TextField"
    },
    12: {
        name: "To",
        id: "data-type-integer-to",
        type: "TextField"
    },
    13: {
        name: "Select",
        id: "select-default-1",
        type: "MenuItem"
    },
    14: {
        name: "Select",
        id: "select-default-2",
        type: "MenuItem"
    },
    15: {
        name: "Custom Text",
        id: "custom-text",
        type: "Text"
    },
    16: {
        name: "Custom Text 2",
        id: "custom-text-2",
        type: "Text"
    }
}


const tree = {
    0: [1, 2],
    2: [3, 4, 5, 6, 13],
    3: [7],
    7: [8, 9, 10, 14],
    8: [11, 12],
    4: [15, 16]
}

const reverseMapForMenuOptions = {
    3: [2],
    4: [2],
    5: [2],
    6: [2],
    13: [2],
    8: [7],
    9: [7],
    10: [7],
    14: [7]
}

const SelectOption = (props) => {

    const [optionState, setOptionState] = React.useState(props.default)

    const handleSetOptionState = (event) => {
        setOptionState(event.target.value)
        props.selectOptionChangeHandler(event.target.value)
    }

    return (
        <Select
            value={optionState}
            onChange={handleSetOptionState}
        >
            {tree[props.selectOptionId].map((options) => (
                <MenuItem value={options}>
                    {IdToElementsMap[options].name}
                </MenuItem>
            ))}
        </Select>
    )


}

const RenderElements = (props) => {

    if (props.node === 1) {
        return (
            <TextField label={IdToElementsMap[props.node].name}/>
        )
    } else if (props.node === 2) {
        return (
            <SelectOption default={13} selectOptionId={props.node}
                          selectOptionChangeHandler={props.selectOptionChangeHandler}/>
        )
    } else if (props.node === 7) {
        return (
            <SelectOption default={14} selectOptionId={props.node}
                          selectOptionChangeHandler={props.selectOptionChangeHandler}/>
        )
    } else if (props.node === 11) {
        return (
            <TextField label={IdToElementsMap[props.node].name}/>
        )
    } else if (props.node === 12) {
        return (
            <TextField label={IdToElementsMap[props.node].name}/>
        )
    } else if (props.node === 15) {
        return (
            <TextField label={IdToElementsMap[props.node].name}/>
        )
    } else if (props.node === 16) {
        return (
            <TextField label={IdToElementsMap[props.node].name}/>
        )
    } else {
        return <></>
    }


}

const EditChecks = () => {


    const [nodesToDisplay, setNodesToDisplay] = React.useState(
        {
            "toRender": [1, 2]
        }
    )

    const handleFormOptionChange = (event) => {


        const currNode = event
        let currArray = nodesToDisplay.toRender

        currArray = popElements(currArray, currNode)
        if (IdToElementsMap[currNode].type === 'MenuItem') {
            currArray.push(currNode)
        }
        currArray = bfs(currArray, currArray[currArray.length - 1])
        setNodesToDisplay({"toRender": currArray})

    }

    const bfs = (currArray, node) => {


        if (tree[node] !== undefined) {
            tree[node].map((elem) => currArray.push(elem))
        }
        return currArray

    }


    const popElements = (currArray, node) => {
        //node is a menuItem. Pop all elements from the end till the selectOption for node is reached
        const selectOptionToFind = reverseMapForMenuOptions[node][0]
        while ((currArray.length > 0) && (currArray[currArray.length - 1] !== selectOptionToFind)) {
            currArray.pop()
        }
        return currArray

    }

    return (
        <>
            {nodesToDisplay.toRender.map((elem) => (
                <div>
                    <RenderElements node={elem} selectOptionChangeHandler={handleFormOptionChange}/>
                </div>
            ))}
        </>
    )

}

export default EditChecks;