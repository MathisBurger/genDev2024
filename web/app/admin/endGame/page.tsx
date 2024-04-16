'use client';
import {useRouter, useSearchParams} from "next/navigation";
import useApiService from "@/hooks/useApiService";
import {FormEvent, useMemo, useState} from "react";
import useSnackbar from "@/hooks/useSnackbar";
import ResponseCode from "@/service/ResponseCode";
import {Button, Card, CardContent, Grid, Input} from "@mui/joy";

const RenameGamePage = () => {

    const gameId = parseInt(useSearchParams().get('gameId') ?? '', 10);
    const apiService = useApiService();
    const gameName = useSearchParams().get('gameName') ?? '';
    const homeGoals = parseInt(useSearchParams().get("homeGoals") ?? '', 10);
    const awayGoals = parseInt(useSearchParams().get("awayGoals") ?? '', 10);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const snackbar = useSnackbar();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const resp = await apiService.endGame(gameId);
        setLoading(false);
        if (resp.status === ResponseCode.OK) {
            router.push("/admin");
        } else {
            snackbar.error(resp.data);
        }
    };

    return (
        <Grid container direction="row" justifyContent="center">
            <Grid xs={7}>
                <Button onClick={() => router.back()}>Zurück</Button>
            </Grid>
            <Grid xs={7}><h1 style={{textAlign: 'center'}}>Spiel umbenennen</h1></Grid>
            <Grid xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <form onSubmit={onSubmit}>
                            <Grid container direction="row" spacing={2} justifyContent="center" alignItems="center">
                                <Grid xs={12}>
                                    <h2 style={{textAlign: 'center'}}>{gameName}</h2>
                                </Grid>
                                <Grid xs={12}>
                                    <h1 style={{textAlign: 'center'}}>{homeGoals} {' : '} {awayGoals}</h1>
                                </Grid>
                                <Grid xs={12} container direction="row" spacing={2} justifyContent="center">
                                    <Grid xs={6} lg={3}>
                                        <Button size="lg" fullWidth type="submit" loading={loading}>
                                            Spiel beenden
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

export default RenameGamePage;