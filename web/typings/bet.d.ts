import {MinifiedGame} from "@/typings/game";

export interface PersonalBet {
    id: number;
    goalsHome: number;
    goalsAway: number;
    betPoints?: number;
    game: MinifiedGame;
}