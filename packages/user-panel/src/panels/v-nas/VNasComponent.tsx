import React, {useEffect} from 'react';
import {PageContainer} from '../../components/WrapperElement';
import Button from '@mui/material/Button';
import {NameManagement} from '../../components/NameManagement';
import axios from 'axios';
import {useDataProvider, useNotify} from "react-admin";
import {getUserToken} from "../../providers/firebaseAuthProvider";
import {ResourceKey} from "../../App/UsersResource";
import {useUserIdentity} from "../../App/user/UserIdentity";
import {EntryPointLink} from "../../components/EntryPointLink";
import {CircularProgress, Paper} from "@mui/material";


const API_URL = 'https://nasselle.com/dashboard/api';
//const API_URL = 'http://localhost:8192';

export const VNasComponent = () => {
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const {data, isLoading, error} = useUserIdentity();
    const [loading, setLoading] = React.useState<boolean>(true);
    const userid = data?.id;
    const [vnas, setVnas] = React.useState<string>();

    useEffect(() => {
        if (!userid || isLoading) return;
        (async () => {
            const userData = await dataProvider.getOne<any>(ResourceKey, {id: userid} as any);
            setVnas(userData.data.vnas);
            setLoading(false);
        })();
    }, [userid, isLoading]);

    const handleCreateClick = async () => {
        setLoading(true);
        try {
            const token = await getUserToken();
            const response = await axios.post(`${API_URL}/create-vnas`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log('Response:', response.data);
            const userData = await dataProvider.getOne<any>(ResourceKey, {id: userid} as any);
            setVnas(userData.data.vnas);
            notify(`V-NAS Created - you can open your dashboard`);
        } catch (error) {
            console.error('Error creating V-NAS:', error);
            notify(`Error creating V-NAS: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async () => {
        setLoading(true);
        try {
            const token = await getUserToken();
            const response = await axios.post(`${API_URL}/delete-vnas`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log('Response:', response.data);
            const userData = await dataProvider.getOne<any>(ResourceKey, {id: userid} as any);
            setVnas(userData.data.vnas);
            notify(`V-NAS Deleted`);
        } catch (error) {
            console.error('Error deleting V-NAS:', error);
            notify(`Error deleting V-NAS: ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return <>
        <Paper style={{padding: '20px'}}>
            <div style={{fontWeight: 'bold', color: 'red', textAlign: 'center'}}>
                WARNING THIS IS FOR DEMONSTRATION PURPOSE ONLY - THIS WILL NOT CREATE A PRODUCTION V-NAS
            </div>
        </Paper>
        <br/>
        {loading && <CircularProgress/>}
        {!loading && <>
            {vnas && <>
                <EntryPointLink/>
                <br/>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning" onClick={handleCreateClick}>Reset</Button>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning" onClick={handleDeleteClick}>DELETE V-NAS AND USER
                    DATA</Button>
            </>}
            {!vnas && <>
                <NameManagement/>
                <Button fullWidth variant="contained" color="primary" onClick={handleCreateClick}>Create</Button>
            </>}

        </>}
    </>
}