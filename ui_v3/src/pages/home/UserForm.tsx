import { Box, Button, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { ManagementServiceUser } from "../../generated/interfaces/Interfaces";



const UserForm = ({user}: {user: ManagementServiceUser}) => {

    const getValue: Record<string, string> = {
        developer: "Developer",
        businessUser: "Business User"
    }

    console.log(getValue["developer"])

    return (
        <Box sx={{width: '100%', heigt: '100%', p: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexDirection: 'column'}}>
            <Typography variant="homePageTitle">
                Help us know you better
            </Typography>
            <Typography variant="homePageSubtext">
                Please fill up the following sentence so that we can provide you with an unique experience tailored only for you
            </Typography>
            <Box sx={{display: 'flex', mt: 1, gap: 2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="homePageSubtext">
                    I am a
                </Typography>
                <FormControl>
                    <Select sx={{borderRadius: "8px"}} autoWidth size="medium" value={user?.persona || "developer"}>
                        <MenuItem value="businessUser">Business User</MenuItem>
                        <MenuItem value="developer">Developer</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" sx={{background: "#007DFA", borderRadius: "8px", p: 1, mt: 2}}>
                <Typography >Continue</Typography>
            </Button>
            <Box sx={{mt: 5, display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
                <Button variant="contained" sx={{color: '#000000', background: '#EAEBEF', '&:hover': {background: '#EAEBEF'}}}>
                    Skip
                </Button>
            </Box>
        </Box>
    )
}

export default UserForm