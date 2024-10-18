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
import {TimerLoadingBar} from "../../components/TimeLoaderComponent";


let API_URL = 'https://nasselle.com/dashboard/api';
if(process.env.BACKEND_URL) {
    API_URL = 'http://localhost:8192';
}

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

    const handleActionClick = async (action:'delete'|'reboot'|'create'|'update') => {
        setLoading(true);
        try {
            const token = await getUserToken();
            const response = await axios.post(`${API_URL}/vnas/${action}`, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log('Response:', response.data);
            const userData = await dataProvider.getOne<any>(ResourceKey, {id: userid} as any);
            setVnas(userData.data.vnas);
            notify(`done`);
        } catch (error) {
            console.error('Error creating V-NAS:', error);
            notify(`Error creating V-NAS: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return <>
        <Paper style={{padding: '20px'}}>
            <div style={{fontWeight: 'bold', color: 'red', textAlign: 'center'}}>
                WARNING THIS IS FOR DEMONSTRATION PURPOSE ONLY - THIS WILL NOT CREATE A PRODUCTION V-NAS
            </div>
        </Paper>
        <br/>
        {loading && <TimerLoadingBar />}
        {!loading && <>
            {vnas && <>
                <EntryPointLink editMode={true}/>
                <br/>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning"
                        onClick={() => {
                            handleActionClick("reboot")
                        }}>Reboot</Button>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning"
                        onClick={() => {
                            handleActionClick("delete")
                        }}>DELETE V-NAS AND USER DATA</Button>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning"
                        onClick={() => {
                            handleActionClick("create")
                        }}>Re-create</Button>
                <br/>
                <br/>
                <Button fullWidth variant="contained" color="warning"
                        onClick={() => {
                            handleActionClick("update")
                        }}>Update OS</Button>
            </>}
            {!vnas && <>
                <NameManagement editMode={true}/>
                <Button fullWidth variant="contained" color="primary"
                        onClick={() => {
                            handleActionClick("create")
                        }}>Create</Button>
            </>}

        </>}
    </>
}