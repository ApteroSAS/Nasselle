import {type FC, useEffect, useState} from 'react';
import {Box, LinearProgress, Typography} from '@mui/material';

export const TimerLoadingBar: FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalTime = 60000; // 1 minutes in milliseconds
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
