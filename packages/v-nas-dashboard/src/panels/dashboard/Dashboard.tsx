import {CircularProgress} from '@mui/material';
import {EntryPointLink} from "@/components/EntryPointLink";
import {PageContainer} from "dashboard-core";
import {Intro} from "@/components/Intro";
import {useRefDomain} from "@/components/meshRouter/UseRefDomain";

export const Dashboard: React.FC = () => {
    const refDomain = useRefDomain();
    return (
        <PageContainer>
                {refDomain.isLoading ? <CircularProgress/> : refDomain.domainName ? <EntryPointLink editMode={false}/> : <Intro/>}
        </PageContainer>
    );
};
