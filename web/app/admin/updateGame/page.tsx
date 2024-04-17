'use client';
import {Button, Card, CardContent, Grid, Input} from "@mui/joy";
import {FormEvent, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import useApiService from "@/hooks/useApiService";
import ResponseCode from "@/service/ResponseCode";
import useSnackbar from "@/hooks/useSnackbar";


const UpdateGamePage = () => {

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
        const data = new FormData(e.currentTarget);
        const goalsHome = parseInt(`${data.get("homeGoals")}`, 10);
        const goalsAway = parseInt(`${data.get("awayGoals")}`, 10);
        setLoading(true);
        const resp = await apiService.updateGame(gameId, goalsHome, goalsAway);
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
            <Grid xs={7}><h1 style={{textAlign: 'center'}}>Spiel aktualisieren</h1></Grid>
            <Grid xs={12} lg={6}>
                <Card>
                    <CardContent>
                        <form onSubmit={onSubmit}>
                            <Grid container direction="column" spacing={2} justifyContent="center">
                                <Grid xs={12}>
                                    <h2 style={{textAlign: 'center'}}>{gameName}</h2>
                                </Grid>
                                <Grid xs={12} container direction="row" spacing={2} justifyContent="center">
                                    <Grid xs={3} lg={2}>
                                        <Input
                                            type="number"
                                            name="homeGoals"
                                            required
                                            defaultValue={homeGoals === Number.NaN ? 0 : homeGoals}
                                            style={{fontSize: '4em', fontWeight: 'bold'}}
                                        />
                                    </Grid>
                                    <Grid xs={1}>
                                        <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>:</h1>
                                    </Grid>
                                    <Grid xs={3} lg={2}>
                                        <Input
                                            type="number"
                                            name="awayGoals"
                                            required
                                            defaultValue={awayGoals === Number.NaN ? 0 : awayGoals}
                                            style={{fontSize: '4em', fontWeight: 'bold'}}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid xs={12} container direction="row" spacing={2} justifyContent="center">
                                    <Grid xs={6} lg={3}>
                                        <Button size="lg" fullWidth type="submit" loading={loading}>
                                            Aktualisieren
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default UpdateGamePage;