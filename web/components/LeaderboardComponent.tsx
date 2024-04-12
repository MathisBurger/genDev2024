

export interface LeaderboardElement {
    placement: number;
    user: {
        username: string;
        points: number;
        preliminaryPoints: number;
    }
}

interface LeaderboardComponentProps {
    elements: LeaderboardElement[];
    topPageIncrease: () => void;
    bottomPageIncrease: () => void;
}

const LeaderboardComponent = () => {


}