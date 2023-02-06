import PlayArrow from "@mui/icons-material/PlayArrow"
import SearchIcon from "@mui/icons-material/Search"
import { Box, Card, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import React from "react"
import { generatePath, useHistory } from "react-router"
import { APPLICATION_EXECUTE_ACTION } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { SearchBar } from "../../../../css/theme/CentralCSSManager"
import { ActionDefinitionDetail } from "../../../../generated/interfaces/Interfaces"
import { ContainerHeader, RecommnedQuestionContainer } from "../../components/StyledComponents"


export interface RecommendedQuestionsProps {
    recommenedQuestions: ActionDefinitionDetail[]
}

const RecommendedQuestions = (props: RecommendedQuestionsProps) => {
    const {recommenedQuestions} = props
    const [searchQuery, setSearchQuery] = React.useState<string | undefined>()
    const history = useHistory()

    const handleActionRun = (action?: ActionDefinitionDetail) => {
        history.push(generatePath(APPLICATION_EXECUTE_ACTION, {ActionDefinitionId: action?.ActionDefinition?.model?.Id || ""}) + "?name=" + action?.ActionDefinition?.model?.DisplayName)
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 1, ...RecommnedQuestionContainer}}>
            <Typography sx={{...ContainerHeader}}>
                Recommened Actions
            </Typography>
            <TextField variant="standard"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search Questions"
                multiline={true}
                sx={{
                    width: '100%',
                    ...SearchBar(),
                    m: 1
                }}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ marginLeft: 1 }} />
                        </InputAdornment>
                    )
                }} />
            {recommenedQuestions.filter(action => action.ActionDefinition?.model?.DisplayName?.toLocaleLowerCase()?.includes(searchQuery?.toLocaleLowerCase() || "")).map(action => (
                <Card sx={{width: '100%', p: 4, display: 'flex', justifyContent: 'space-between'}}>
                    {action.ActionDefinition?.model?.DisplayName}
                    <IconButton onClick={() => handleActionRun(action)}>
                        <PlayArrow />
                    </IconButton>
                </Card>
            ))}
        </Box>
    )
}


export default RecommendedQuestions