'use client';
import {Divider, Grid} from "@mui/joy";
import GameCard from "@/components/GameCard";
import {useEffect, useState} from "react";
import {MinifiedGame} from "@/typings/game";
import useApiService from "@/hooks/useApiService";


const AdminPage = () => {

    const apiService = useApiService();
    const [games, setGames] = useState<MinifiedGame[]>([]);

    useEffect(() => {
        apiService.getAllGames().then((res) => setGames(res.data as MinifiedGame[]));
    }, []);

    return (
        <Grid container direction="row" justifyContent="center">
            <Grid xs={7}><h1 style={{textAlign: 'center'}}>Spiele</h1></Grid>
            <Grid xs={6}>
                <Grid xs={6} container direction="column" spacing={2}>
                    {games.filter(game => !game.done).map((game) => (
                        <Grid xs={12}>
                            <GameCard game={game} />
                        </Grid>
                    ))}
                    <Divider />
                    <h2 style={{textAlign: 'center'}}>Beendete Spiele</h2>
                    {games.filter(game => game.done).map((game) => (
                        <Grid xs={12}>
                            <GameCard game={game} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default AdminPage;