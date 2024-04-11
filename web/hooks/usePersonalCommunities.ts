import {createContext, useContext} from "react";
import {Community} from "@/typings/community";

interface GetterAndSetter {
    getter: Community[];
    setter: (c: Community[]) => void;
}

export const PersonalCommunitiesContext = createContext<GetterAndSetter>({
    getter: [],
    setter: () => {}
});

const usePersonalCommunities = () => useContext<GetterAndSetter>(PersonalCommunitiesContext);

export default usePersonalCommunities;