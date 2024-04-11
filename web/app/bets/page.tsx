'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import usePersonalBets from "@/hooks/usePersonalBets";
import {Divider, Grid} from "@mui/joy";
import GameCard from "@/components/GameCard";
import BetCard from "@/components/BetCard";


const BetsPage = () => {

    const {getter} = usePersonalBets();




    return (
        <AuthorizedLayout>
            <Grid container direction="row" justifyContent="center">
                <Grid xs={7}><h1 style={{textAlign: 'center'}}>Wetten</h1></Grid>
                <Grid xs={6}>
                    <Grid xs={6} container direction="column" spacing={2}>
                        {getter.reverse().map((bet) => (
                            <Grid xs={12}>
                                <BetCard bet={bet} />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </AuthorizedLayout>
    );
}

export default BetsPage;