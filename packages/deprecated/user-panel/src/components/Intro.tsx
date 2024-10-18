import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material'; // Import MUI components

/*export const Intro: React.FC = () => {
    const navigate = useNavigate();

    const handleAnswer = (answer: string) => {
        if (answer === 'yes') {
            navigate('/hw-nas'); // Navigates to the hardware NAS page
        } else {
            navigate('/v-nas'); // Navigates to the virtual NAS page
        }
    };

    return (
            <Box textAlign="center" p={3} boxShadow={3} borderRadius={2}>
                <Typography variant="h4" gutterBottom>
                    Welcome to Nasselle
                </Typography>
                <Typography variant="body1" paragraph>
                    Nasselle offers seamless, secure, and scalable network-attached storage
                    management solutions. Perfect for Tech Enthusiasts, Small to Medium
                    Businesses, and anyone looking to enhance their data management and
                    security.
                </Typography>
                <Typography variant="h6" gutterBottom>
                    To get started do you have a Hardware NAS?
                </Typography>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAnswer('yes')}
                        style={{ marginRight: '10px' }}
                    >
                        Yes
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAnswer('no')}
                    >
                        No
                    </Button>
                </Box>
            </Box>
    );
};*/

export const Intro: React.FC = () => {
    const navigate = useNavigate();

    const handleAnswer = (answer: string) => {
        if (answer === 'yes') {
            navigate('/hw-nas'); // Navigates to the hardware NAS page
        } else {
            navigate('/v-nas'); // Navigates to the virtual NAS page
        }
    };

    return (
        <Box textAlign="center" p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" gutterBottom>
                Welcome to Nasselle
            </Typography>
            <Typography variant="body1" paragraph>
                Nasselle offers seamless, secure, and scalable network-attached storage
                management solutions. Perfect for Tech Enthusiasts, Small to Medium
                Businesses, and anyone looking to enhance their data management and
                security.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Let's get started!
            </Typography>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAnswer('no')}
                >
                    Start
                </Button>
            </Box>
        </Box>
    );
};
