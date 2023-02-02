import SearchIcon from '@mui/icons-material/Search';
import { Box, Card, InputAdornment } from "@mui/material";
import { DialogHeader, SearchBarDialogTextField } from "../../../data/components/StyledComponents";
import { DetailView } from "../../../data/upload_table/components/RecommendedApps";
import useSelectActionToAdd from "../hooks/useSelectActionToAdd";

export interface SelectActionToAddProps {
    handlers: {
        onActionAddHandler: (actionId: string) => void
    },

}

const SelectActionToAdd = (props: SelectActionToAddProps) => {

    const {actionSearchQuery, handleActionSearchQueryChange, detailViewProps} = useSelectActionToAdd(props)

    return (
        <Card >
            <Box sx={{ ...DialogHeader }}>
                <SearchBarDialogTextField variant="standard" size='small'
                    value={actionSearchQuery}
                    onChange={handleActionSearchQueryChange}
                    placeholder="Search for Apps"
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ marginLeft: 1 }} />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <DetailView {...detailViewProps}/>
        </Card>
    )

}

export default SelectActionToAdd