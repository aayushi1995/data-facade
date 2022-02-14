import React, {useRef, useState} from "react";
import {makeStyles} from '@material-ui/styles';
import Modal from '@material-ui/core/Modal';
import {Button, Grid, Typography} from "@material-ui/core";
import {UserEdit} from "../../common/components/UserEdit";
import {useMutation, useQuery, useQueryClient} from "react-query";
import dataManager from "../../data_manager/data_manager";
import {Error} from "@material-ui/icons";
import {DataGrid} from '@material-ui/data-grid';
import {useRouteMatch} from "react-router-dom";
import {PageHeader} from "../../common/components/header/PageHeader";

const columns = [
    {
        field: 'firstName',
        headerName: 'First name',
        editable: true,
        flex: 1
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        editable: true,
        flex: 1
    },
    {
        field: 'email',
        headerName: 'Email',
        editable: false,
        flex: 1
    }
];
export const useStyles = makeStyles((theme)=>({
    paper: {
        position: 'absolute',
        width: '50%',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: "",
        padding: "40px",
        maxHeight: "400px",
        overflow: "scroll"
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        minWidth: 650,
    },
}));

export function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export const Users = () => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const match = useRouteMatch();
    const {
        isLoading,
        error,
        data: users
    } = useQuery('users', () => dataManager.getInstance.fetchUsers().then(r => r.json()));
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <UserEdit users={users} handleClose={handleClose}/>
        </div>
    );
    const selectedItems = useRef([]);
    const mutation = useMutation(() => {
        return Promise.all(selectedItems?.current?.map((id) => {
            const targetUserEmail = users?.find(user => user.id === id)?.email;
            return targetUserEmail && dataManager.getInstance
                .deleteUser(targetUserEmail);
        })).then(() => {
            console.log("deleted");
        }).catch(console.error);
    }, {
        onSuccess: () => {
            const newUsers = users.filter(user => !selectedItems?.current?.includes(user.id));
            queryClient.setQueryData('users', newUsers);
        }
    })
    const deleteUsers = async () => {
        try {
            const deleted = await mutation.mutateAsync(users)
            console.log(deleted)
        } catch (error) {
            console.error(error)
        } finally {
            console.log('done')
        }
    }

    return (
        <Grid xs={12}>
            <PageHeader path={match.path} url={match.url}/>
            <Grid container style={{
                marginBottom: "20px",
            }} spacing={3}>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Add User
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" onClick={deleteUsers}>
                        Delete User(s)
                    </Button>
                </Grid>
                <Modal
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Grid>
            {error && <Typography><Error color="error"/> {error?.toString()}</Typography>}
            {isLoading && <Typography>Loading...</Typography>}
            {!isLoading && (users?.length > 0 ?
                    <DataGrid
                        autoHeight
                        onSelectionModelChange={(selectionModel) => {
                            selectedItems.current = selectionModel;
                        }}
                        rows={users}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        checkboxSelection
                        onCellEditCommit={(change) => {
                            console.log(change)
                            const changedUser = users.find(u => u.id === change.id);
                            console.log(changedUser)
                            changedUser[change.field] = change.value;
                            changedUser && dataManager.getInstance.updateUser(changedUser).then(console.log).catch(console.error)
                        }}
                    /> : <Typography>No users found</Typography>)}
        </Grid>
    );
}