import React, {useState} from 'react';
import {Button, Container, FormControl, Input, InputLabel as Label} from "@mui/material";
import dataManager from "../../data_manager/data_manager";
import {useMutation, useQueryClient} from "react-query";


export const UserEdit = ({handleClose, users}) => {
    const queryClient = useQueryClient();
    const [item, setItem] = useState({
        firstName: '',
        lastName: '',
        newUserEmail: ''
    });

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let newItem = {...item};
        newItem[name] = value;
        setItem(newItem);
    }

    const mutation = useMutation(() => {
        return dataManager.getInstance
            .addUser(item).then((r) => r.json()).then((item) => {
                setItem(item);
                return item;
            }).catch(console.error);
    }, {
        onSuccess: (result) => {
            //to use the id from returned item when available
            handleClose();
            queryClient.setQueryData('users', [...users, {
                ...item,
                email: item.newUserEmail,
                id: result?.id || Math.random()
            }]);
        }
    })
    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutateAsync();
        return false;
    }
    return <Container>
        <h2>Add User</h2>
        <form style={{width: "100%"}} onSubmit={handleSubmit}>
            <FormControl style={{width: "100%"}}>
                <Label for="firstName">FirstName</Label>
                <Input type="text" name="firstName" id="firstName" value={item.firstName || ''}
                       onChange={handleChange} autoComplete="FirstName"/>
            </FormControl>
            <FormControl style={{width: "100%"}}>
                <Label for="lastName">LastName</Label>
                <Input type="text" name="lastName" id="lastName" value={item.lastName || ''}
                       onChange={handleChange} autoComplete="LastName"/>
            </FormControl>
            <FormControl style={{width: "100%"}}>
                <Label for="newUserEmail">Email</Label>
                <Input type="text" name="newUserEmail" id="newUserEmail" value={item.newUserEmail || ''}
                       onChange={handleChange} autoComplete="newUserEmail"/>
            </FormControl>
            <FormControl style={{width: "100%"}}>
                <Button color="primary" type="submit">Save</Button>
            </FormControl>
        </form>
    </Container>
}