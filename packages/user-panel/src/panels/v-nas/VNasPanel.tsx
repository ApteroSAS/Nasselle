import React from 'react';
import { PageContainer } from '../../components/WrapperElement';
import Button from '@mui/material/Button';
import { NameManagement } from '../../components/NameManagement';
import axios from 'axios';
import {useNotify} from "react-admin";
import {getUserToken} from "../../providers/firebaseAuthProvider";

export const VNasPanel = () => {
    const notify = useNotify();
    const handleCreateClick = async () => {
        try {
            const token = await getUserToken();
            const response = await axios.post('http://localhost:8192/create-vnas', {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error creating V-NAS:', error);
            notify(`Error creating V-NAS: ${error}`);
        }
    };

    return <PageContainer>
        <div style={{ textAlign: 'center' }}>
            V-NAS (Virtual Network-Attached Storage) is a cloud-based service that provides NAS capabilities without the need for physical hardware. It allows users to securely access, store, and manage their data over the internet with enhanced features like VPN support, your own domain, and robust security protocols such as TLS and DDoS protection.
        </div>
        <div style={{ fontWeight: 'bold', color: 'red' }}>
            WARNING THIS IS FOR DEMONSTRATION PURPOSE ONLY - THIS WILL NOT CREATE A PRODUCTION V-NAS
        </div>
        <NameManagement/>
        <Button fullWidth variant="contained" color="primary" onClick={handleCreateClick}>Create</Button>
    </PageContainer>
}