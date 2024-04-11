'use client';
import {MinifiedGame} from "@/typings/game";
import {Button, Card, CardContent, Grid} from "@mui/joy";
import usePersonalBets from "@/hooks/usePersonalBets";
import {useRouter} from "next/navigation";


interface GameCardProps {
    game: MinifiedGame;
}

const GameCard = ({game}: GameCardProps) => {

    const {getter} = usePersonalBets();
    const router = useRouter();

    return (
        <Card>
            <CardContent>
                <Grid container direction="row" spacing={2} justifyContent="center">
                    <Grid xs={9} justifyContent="center">
                        <h2 style={{margin: 0, padding: 0, textAlign: "center"}}>{game.teamHome} gegen {game.teamAway}</h2>
                    </Grid>
                    <Grid xs={9}>
                        <h2 style={{margin: 0, padding: 0, textAlign: "center"}}>{game.goalsHome ?? "-"} : {game.goalsAway ?? "-"}</h2>
                    </Grid>
                    <Grid xs={10}>
                        <p style={{textAlign: "center"}}>{new Date(game.startsAt).toLocaleDateString("de-DE")} {new Date(game.startsAt).toLocaleTimeString("de-DE")}</p>
                    </Grid>
                    {(!getter.map((b) => b.game.id).includes(game.id) && new Date().getTime() < new Date(game.startsAt).getTime()) && (
                        <Grid xs={3}>
                            <Button
                                fullWidth
                                onClick={() => router.push(`/bets/place?gameId=${game.id}&gameName=${game.teamHome + " gegen " + game.teamAway}`)}
                            >Wette platzieren</Button>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}

export default GameCard;