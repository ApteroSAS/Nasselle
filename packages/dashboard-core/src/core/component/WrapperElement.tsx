import {Paper} from '@mui/material';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '1em',
        minHeight: '100%',
        minWidth: '100%',
    } as React.CSSProperties,
    paper: {
        padding: '2em',
        maxWidth: '800px',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
    } as React.CSSProperties,
};

interface DashboardContainerProps {
    children: React.ReactNode;
}

export const PageContainer: React.FC<DashboardContainerProps> = ({ children }) => (
    <div style={styles.container}>
        <Paper style={styles.paper}>
            {children}
        </Paper>
    </div>
);
