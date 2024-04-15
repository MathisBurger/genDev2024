import useApiService from "@/hooks/useApiService";
import {useEffect, useMemo, useState} from "react";
import {MinifiedGame} from "@/typings/game";
import {Card, CardContent, Grid} from "@mui/joy";
import GameCard from "@/components/GameCard";


const CurrentGamesCard = () => {

    const apiService = useApiService();
    const [games, setGames] = useState<MinifiedGame[]>([]);

    useEffect(() => {
        apiService.getAllGames().then((res) => setGames(res.data as MinifiedGame[]));
    }, []);

    const futureGames = useMemo<MinifiedGame[]>(
        () => games.filter((g) => (new Date(g.startsAt).getTime() > new Date().getTime() && !g.done) || (!g.done && new Date(g.startsAt).getTime() < new Date().getTime())),
        [games]
    );

    const limitedFutureGames = useMemo<MinifiedGame[]>(() => {
        if (futureGames.length > 3) {
            return futureGames.slice(0, 3);
        }
        return futureGames;
    }, [futureGames])

    return (
        <Card>
            <CardContent>
                <Grid direction="row" spacing={2} rowSpacing={2}>
                    {limitedFutureGames.map((game) => (
                        <Grid xs={12}>
                            <GameCard game={game} small />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default CurrentGamesCard;