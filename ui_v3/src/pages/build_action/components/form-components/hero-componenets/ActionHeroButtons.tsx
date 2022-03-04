import { Box, IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ActionHeroButtons = () => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end", flexShrink: 1, flexGrow: 0, pt: 1, pb: 1}} className="buttons">
            <Box>
                <IconButton>
                    <FavoriteIcon/>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <SaveIcon/>
                </IconButton>
            </Box>
            <Box>
                <IconButton></IconButton>
            </Box>
        </Box>
    )
}

export default ActionHeroButtons;