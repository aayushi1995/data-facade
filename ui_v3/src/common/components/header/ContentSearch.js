/* eslint-disable react/no-array-index-key */
import {useState} from 'react';
import {Box, Button, Container, Drawer, IconButton, InputAdornment, TextField, Tooltip} from '@material-ui/core';
import SearchIcon from '../icons/Search';
import XIcon from '../icons/X';
import {useAppBarProps} from "./DataFacadeAppBar";

const ContentSearch = () => {
    const {setSearchQuery} = useAppBarProps();
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = () => {
        setSearchQuery(value);
    };

    const handleKeyUp = () => {
        setSearchQuery(value);
    };

    return (
        <>
            <Tooltip title="Search">
                <IconButton
                    color="inherit"
                    onClick={handleOpen}
                >
                    <SearchIcon fontSize="small"/>
                </IconButton>
            </Tooltip>
            <Drawer
                anchor="top"
                ModalProps={{BackdropProps: {invisible: true}}}
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: {width: '100%'}
                }}
                variant="temporary"
            >
                <Box sx={{p: 3}}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <IconButton onClick={handleClose}>
                            <XIcon fontSize="small"/>
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{p: 3}}>
                    <Container maxWidth="md">
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small"/>
                                        </InputAdornment>
                                    )
                                }}
                                onChange={(event) => setValue(event.target.value)}
                                onKeyUp={handleKeyUp}
                                placeholder="Search..."
                                value={value}
                            />
                            <Button
                                color="primary"
                                onClick={handleClick}
                                size="large"
                                sx={{ml: 2}}
                                variant="contained"
                            >
                                Search
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </Drawer>
        </>
    );
};

export default ContentSearch;
