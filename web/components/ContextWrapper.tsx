import {PersonalCommunitiesContext} from "@/hooks/usePersonalCommunities";
import {ReactNode, useEffect, useState} from "react";
import {Community} from "@/typings/community";
import useApiService from "@/hooks/useApiService";
import {PersonalBet} from "@/typings/bet";
import {PersonalBetsContext} from "@/hooks/usePersonalBets";

interface ContextWrapperProps {
    children: ReactNode;
}

const ContextWrapper = ({children}: ContextWrapperProps) => {

    const [communities, setCommunities] = useState<Community[]>([]);
    const [personalBets, setPersonalBets] = useState<PersonalBet[]>([]);
    const apiService = useApiService();


    useEffect(() => {
        apiService.getPersonalCommunities().then((res) => setCommunities(res.data as Community[]));
        apiService.getPersonalBets().then((res) => setPersonalBets(res.data as PersonalBet[]));
    }, []);

    return (
        <PersonalCommunitiesContext.Provider value={{getter: communities, setter: setCommunities}}>
            <PersonalBetsContext.Provider value={{getter: personalBets, setter: setPersonalBets}}>
                {children}
            </PersonalBetsContext.Provider>
        </PersonalCommunitiesContext.Provider>
    );
}

export default ContextWrapper;