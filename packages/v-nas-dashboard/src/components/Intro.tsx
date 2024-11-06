import {useNavigate} from 'react-router-dom';
import {Box, Button, Typography} from '@mui/material'; // Import MUI components

export const Intro: React.FC = () => {
    const navigate = useNavigate();

    const handleAnswer = () => {
        navigate('/hw-nas'); // Navigates to the hardware NAS page
    };

    return (
        <Box textAlign="center" p={3} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" gutterBottom>
                Welcome to NSL Router
            </Typography>
            <Typography variant="body1">
                NSL Router offers seamless, secure, and scalable NAS Domain Routing.
                Perfect for Tech Enthusiasts, Small to Medium
                Businesses, and anyone looking to enhance their NAS Experience.
            </Typography>
            <Typography variant="h6" gutterBottom>
                Let&#39;s get started!
            </Typography>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAnswer()}
                >
                    Start
                </Button>
            </Box>
        </Box>
    );
};
