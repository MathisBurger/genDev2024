import {PersonalCommunitiesContext} from "@/hooks/usePersonalCommunities";
import {ReactNode, useEffect, useState} from "react";
import {Community} from "@/typings/community";
import useApiService from "@/hooks/useApiService";

interface PersonalCommunitiesWrapperProps {
    children: ReactNode;
}

const PersonalCommunitiesWrapper = ({children}: PersonalCommunitiesWrapperProps) => {

    const [communities, setCommunities] = useState<Community[]>([]);
    const apiService = useApiService();


    useEffect(() => {
        apiService.getPersonalCommunities().then((res) => setCommunities(res.data as Community[]));
    }, []);

    return (
        <PersonalCommunitiesContext.Provider value={{getter: communities, setter: setCommunities}}>
            {children}
        </PersonalCommunitiesContext.Provider>
    );
}

export default PersonalCommunitiesWrapper;