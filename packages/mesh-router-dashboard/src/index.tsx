import { createRoot } from 'react-dom/client';

import {fetchFirebaseConfig} from "./configuration/FirebaseConfig";

(async () => {
    await fetchFirebaseConfig();
    const { default: App } = await import('./App/App');
    const container = document.getElementById('root');
    if (!container) {
        throw new Error('No container found');
    }
    const root = createRoot(container);

    root.render(<App />);
})().catch((error) => {
    console.error('Error in fetchFirebaseConfig:', error);
});
