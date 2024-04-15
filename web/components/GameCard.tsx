'use client';
import {MinifiedGame} from "@/typings/game";
import {Button, ButtonGroup, Card, CardContent, Grid} from "@mui/joy";
import usePersonalBets from "@/hooks/usePersonalBets";
import {usePathname, useRouter} from "next/navigation";


interface GameCardProps {
    game: MinifiedGame;
    small?: boolean;
}

const GameCard = ({game, small}: GameCardProps) => {

    const {getter} = usePersonalBets();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <Card>
            <CardContent>
                <Grid container direction="row" spacing={2} justifyContent="center">
                    <Grid xs={9} justifyContent="center" style={small ? {padding: 0, margin: 0} : undefined}>
                        <h2 style={{margin: 0, padding: 0, textAlign: "center", fontSize: small ? '1em' : undefined}}>{game.teamHome} gegen {game.teamAway}</h2>
                    </Grid>
                    <Grid xs={9} style={small ? {padding: 0, margin: 0} : undefined}>
                        <h2 style={{margin: 0, padding: 0, textAlign: "center", fontSize: small ? '1em' : undefined}}>{game.goalsHome ?? "-"} : {game.goalsAway ?? "-"}</h2>
                    </Grid>
                    <Grid xs={10} style={small ? {padding: 0, margin: 0} : undefined}>
                        <p style={{textAlign: "center", fontSize: small ? '0.5em' : undefined}}>{new Date(game.startsAt).toLocaleDateString("de-DE")} {new Date(game.startsAt).toLocaleTimeString("de-DE")}</p>
                    </Grid>
                    {(!getter.map((b) => b.game.id).includes(game.id) && new Date().getTime() < new Date(game.startsAt).getTime() && !pathname.startsWith("/admin")) && !small && (
                        <Grid xs={3}>
                            <Button
                                fullWidth
                                onClick={() => router.push(`/bets/place?gameId=${game.id}&gameName=${game.teamHome + " gegen " + game.teamAway}`)}
                            >Wette platzieren</Button>
                        </Grid>
                    )}
                    {pathname === "/admin" && (
                        <Grid xs={5}>
                            <ButtonGroup>
                                <Button
                                    color="primary"
                                    disabled={game.done}
                                    onClick={() => router.push(`/admin/renameGame?gameId=${game.id}&gameName=${game.teamHome + " gegen " + game.teamAway}`)}
                                >
                                    Umbenennen
                                </Button>
                                <Button
                                    color="primary"
                                    fullWidth
                                    disabled={game.done}
                                    onClick={() => router.push(`/admin/updateGame?gameId=${game.id}&gameName=${game.teamHome + " gegen " + game.teamAway}&homeGoals=${game.goalsHome}&awayGoals=${game.goalsAway}`)}
                                >Aktualisieren</Button>
                                <Button
                                    color="danger"
                                    disabled={game.done}
                                    onClick={() => router.push(`/admin/endGame?gameId=${game.id}&gameName=${game.teamHome + " gegen " + game.teamAway}&homeGoals=${game.goalsHome}&awayGoals=${game.goalsAway}`)}
                                >Beenden
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
}

export default GameCard;