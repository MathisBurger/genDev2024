'use client';
import {useRouter, useSearchParams} from "next/navigation";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, Divider, Grid, Input} from "@mui/joy";
import useApiService from "@/hooks/useApiService";
import {FormEvent} from "react";
import ResponseCode from "@/service/ResponseCode";
import useSnackbar from "@/hooks/useSnackbar";
import usePersonalBets from "@/hooks/usePersonalBets";
import {PersonalBet} from "@/typings/bet";


const PlaceBetPage = () => {

    const id = useSearchParams().get('gameId') ?? '';
    const gameName = useSearchParams().get('gameName') ?? '';
    const apiService = useApiService();
    const snackbar = useSnackbar();
    const {setter} = usePersonalBets();
    const router = useRouter();

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const resp = await apiService.placeBet(
            parseInt(id, 10),
            parseInt(`${data.get("homeGoals")}`, 10),
            parseInt(`${data.get("awayGoals")}`, 10)
        );
        if (resp.status !== ResponseCode.OK) {
            snackbar.error(resp.data as string);
            return;
        }
        const personalBets = (await apiService.getPersonalBets()).data as PersonalBet[];
        setter(personalBets);
        router.push("/bets");
    }

    return (
        <AuthorizedLayout>
            <h1>Wette platzieren</h1>
            <Divider />
            <form onSubmit={onSubmit}>
                <Grid container direction="column" spacing={2} justifyContent="center">
                    <Grid xs={12}>
                        <h2 style={{textAlign: 'center'}}>{gameName}</h2>
                    </Grid>
                    <Grid xs={12} container direction="row" spacing={2} justifyContent="center">
                        <Grid xs={4}>
                            <Input type="number" name="homeGoals" required style={{fontSize: '4em', fontWeight: 'bold'}} />
                        </Grid>
                        <Grid xs={1}>
                            <h1 style={{textAlign: 'center', fontWeight: 'bold'}}>:</h1>
                        </Grid>
                        <Grid xs={4}>
                            <Input type="number" name="awayGoals" required style={{fontSize: '4em', fontWeight: 'bold'}} />
                        </Grid>
                    </Grid>
                    <Grid xs={12} container direction="row" spacing={2} justifyContent="center">
                        <Grid xs={3}>
                            <Button size="lg" fullWidth type="submit">
                                Wette platzieren
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </AuthorizedLayout>
    );
}

export default PlaceBetPage;