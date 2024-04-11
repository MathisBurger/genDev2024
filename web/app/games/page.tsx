'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Divider, Grid} from "@mui/joy";
import useApiService from "@/hooks/useApiService";
import {useEffect, useMemo, useState} from "react";
import {MinifiedGame} from "@/typings/game";
import GameCard from "@/components/GameCard";


const GamesPage = () => {

    const apiService = useApiService();
    const [games, setGames] = useState<MinifiedGame[]>([]);

    useEffect(() => {
        apiService.getAllGames().then((res) => setGames(res.data as MinifiedGame[]));
    }, []);

    const futureGames = useMemo<MinifiedGame[]>(
        () => games.filter((g) => new Date(g.startsAt).getTime() > new Date().getTime()),
        [games]
    );

    const pastGames = useMemo<MinifiedGame[]>(
        () => games.filter((g) => new Date(g.startsAt).getTime() < new Date().getTime()),
        [games]
    );

    return (
        <AuthorizedLayout>
            <Grid container direction="row" justifyContent="center">
                <Grid xs={7}><h1 style={{textAlign: 'center'}}>Zukünftige Spiele</h1></Grid>
                <Grid xs={6}>
                    <Grid xs={6} container direction="column" spacing={2}>
                        {futureGames.map((game) => (
                            <Grid xs={12}>
                                <GameCard game={game} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
                <Divider />
                <Grid xs={7}>
                    <h1 style={{textAlign: 'center'}}>Vergangene Spiele</h1>
                </Grid>
                <Grid xs={6} container direction="row" spacing={2}>
                    {pastGames.map((game) => (
                        <Grid xs={12}>
                            <GameCard game={game} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </AuthorizedLayout>
    );
}

export default GamesPage;