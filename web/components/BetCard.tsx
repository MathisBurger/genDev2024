import {PersonalBet} from "@/typings/bet";
import {Button, Card, CardContent, Divider, Grid} from "@mui/joy";

interface BetCardProps {
    bet: PersonalBet;
}


const BetCard = ({bet}: BetCardProps) => {


    return (
        <Card>
            <CardContent>
                <Grid container direction="row" spacing={2} justifyContent="center">
                    <Grid xs={9} justifyContent="center">
                        <h2 style={{margin: 0, padding: 0, textAlign: "center"}}>{bet.game.teamHome} gegen {bet.game.teamAway}</h2>
                    </Grid>
                    <Grid xs={9} sx={{padding: 0}}>
                        <h4 style={{textAlign: 'center', margin: 0, padding: 0}}>Deine Wette:</h4>
                    </Grid>
                    <Grid xs={9} sx={{padding: 0}}>
                        <h2 style={{margin: 0, padding: 0, textAlign: "center"}}>{bet.goalsHome} : {bet.goalsAway}</h2>
                    </Grid>
                    {bet.game.goalsAway !== undefined && (
                        <>
                            <Divider />
                            <Grid xs={9} sx={{padding: 0}}>
                                <h4 style={{textAlign: 'center', margin: 0, padding: 0}}>Ergebnis:</h4>
                            </Grid>
                            <Grid xs={9} sx={{padding: 0}}>
                                <h2 style={{margin: 0, padding: 0, textAlign: "center"}}>{bet.game.goalsHome ?? "-"} : {bet.game.goalsAway ?? "-"}</h2>
                            </Grid>
                            <Grid xs={12}>
                                <p>Punkte: <strong style={{color: 'green'}}>{bet.betPoints}</strong></p>
                            </Grid>
                        </>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}

export default BetCard;