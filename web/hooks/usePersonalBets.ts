import {PersonalBet} from "@/typings/bet";
import {createContext, useContext} from "react";


interface PersonalBetsData {
    getter: PersonalBet[];
    setter: (d: PersonalBet[]) => void;
}

export const PersonalBetsContext = createContext<PersonalBetsData>({getter: [], setter: () => {}});


const usePersonalBets = () => useContext<PersonalBetsData>(PersonalBetsContext);

export default usePersonalBets;