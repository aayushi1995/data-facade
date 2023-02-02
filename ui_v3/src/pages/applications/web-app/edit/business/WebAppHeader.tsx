import { DoneOutline, EditOutlined } from "@mui/icons-material"
import { TextField, Box, Typography, Card, Grid, Button, Input } from "@mui/material"
import React, { useRef, useState } from "react"
import { EditWebAppContext } from "../context/EditWebAppContextProvider"
import useWebAppEditHomePage from "../hooks/useGetWebAppEditHomePage"
import useWebAppHeader from "../hooks/useWebAppHeader"


interface WebAppHeaderProps {
    webAppId: string
}

const WebAppHeader = ({ webAppId }: WebAppHeaderProps) => {

    const editWebAppContext = React.useContext(EditWebAppContext)

    const { handleWebAppModelChange } = useWebAppHeader()
    const { onSave} = useWebAppEditHomePage({ webAppId: webAppId })

    const [isEdit, setIsEdit] = useState(false)
    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', gap: 2, minheight: 100, height:"auto", background: '#A4CAF0', borderRadius: '3px' }}>
            <Box sx={{ height: 38, background: '#24B2CF', padding: '5px' }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                >
                    <Grid item>
                        {
                            isEdit ? 
                            <Input autoFocus disableUnderline={true}  value={editWebAppContext.webApp.DisplayName} size="small"  onChange={(event) => handleWebAppModelChange("DisplayName", event.target.value)}
                            />
                            :
                            <Typography style={{ color: '#F9F9F9', fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{editWebAppContext.webApp.DisplayName}</Typography>
                        }
                    </Grid>
                    <Grid item>
                        {
                            isEdit?
                            <Button size="small"  sx={{color:'#fff'}} endIcon={<DoneOutline style={{fontSize:12}}/>} onClick={() => {
                                setIsEdit(false)
                                onSave()
                            }}>Done </Button>
                            :
                            <Button size="small" variant="text" sx={{color:'#fff'}} endIcon={<EditOutlined style={{fontSize:12}}/>} onClick={() => setIsEdit(true)}>Edit </Button>
                        }
                    </Grid>
                </Grid>
                

            </Box>
            <Box sx={{ padding: '5px' }}>
                { isEdit?
                <Input autoFocus fullWidth disableUnderline={true}  value={editWebAppContext.webApp.Description} size="small"  onChange={(event) => handleWebAppModelChange("Description", event.target.value)}              
                />
                :
                editWebAppContext.webApp.Description}
            </Box>
            {/* <TextField fullWidth value={editWebAppContext.webApp.DisplayName} onChange={(event) => handleWebAppModelChange("DisplayName", event.target.value)}/>
            <TextField fullWidth value={editWebAppContext.webApp.Description} multiline onChange={(event) => handleWebAppModelChange("Description", event.target.value)}/> */}
        </Card>
    )
}

export default WebAppHeader


