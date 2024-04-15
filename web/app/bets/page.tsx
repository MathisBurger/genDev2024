'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import usePersonalBets from "@/hooks/usePersonalBets";
import {Divider, Grid} from "@mui/joy";
import BetCard from "@/components/BetCard";
import useApiService from "@/hooks/useApiService";
import {useEffect} from "react";
import ResponseCode from "@/service/ResponseCode";
import {PersonalBet} from "@/typings/bet";


const BetsPage = () => {

    const {getter, setter} = usePersonalBets();
    const apiService = useApiService();

    useEffect(() => {
        const fetcher = async () => {
            const resp = await apiService.getPersonalBets();
            if (resp.status === ResponseCode.OK) {
                setter(resp.data as PersonalBet[]);
            }
        }
        fetcher();
        const interval = setInterval(fetcher, 10_000);
        return () => clearInterval(interval)
    }, [apiService]);




    return (
        <AuthorizedLayout>
            <Grid container direction="row" justifyContent="center">
                <Grid xs={7}><h1 style={{textAlign: 'center'}}>Wetten</h1></Grid>
                <Grid xs={6}>
                    <Grid xs={6} container direction="column" spacing={2}>
                        {(getter ?? []).reverse().filter(b => !b.game.done).map((bet) => (
                            <Grid xs={12}>
                                <BetCard bet={bet} />
                            </Grid>
                        ))}
                        <Grid xs={12}>
                            <Divider />
                            <h2 style={{textAlign: 'center'}}>Vergangene Wetten</h2>
                            {(getter ?? []).reverse().filter(b => b.game.done).map((bet) => (
                                <Grid xs={12}>
                                    <BetCard bet={bet} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthorizedLayout>
    );
}

export default BetsPage;