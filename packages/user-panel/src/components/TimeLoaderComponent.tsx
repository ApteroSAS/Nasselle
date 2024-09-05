import React, { useState, useEffect } from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';

export const TimerLoadingBar: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalTime = 120000; // 2 minutes in milliseconds
        const interval = 1000; // 1 second interval

        const updateProgress = () => {
            setProgress((prevProgress) => {
                const progressIncrement = (interval / totalTime) * 100;
                return Math.min(prevProgress + progressIncrement, 100);
            });
        };

        const timer = setInterval(updateProgress, interval);

        return () => {
            clearInterval(timer); // Cleanup the timer when component unmounts
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6">Loading... {Math.round(progress)}%</Typography>
            <LinearProgress variant="determinate" value={progress} />
        </Box>
    );
};
