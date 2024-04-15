import {Community} from "@/typings/community";
import {useEffect, useMemo, useState} from "react";
import {LeaderboardElement} from "@/components/LeaderboardComponent";
import useApiService from "@/hooks/useApiService";
import {useCookies} from "react-cookie";
import {Card, CardContent, List, ListDivider, ListItem, ListItemButton} from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";


interface DashboardLeaderboardProps {
    community?: Community;
}

const DashboardLeaderboard = ({community}: DashboardLeaderboardProps) => {

    const apiService = useApiService();
    const [entries, setEntries] = useState<LeaderboardElement[]>([]);
    const [cookies] = useCookies(['application_user']);

    const elements = useMemo<LeaderboardElement[]>(() => {
        const updatedElements: LeaderboardElement[] = [];
        for (let i=0; i<entries.length; i++) {
            if (i===0) {
                updatedElements.push(entries[i]);
                continue;
            }
            if (updatedElements.length > 0 && entries[i].user.preliminaryPoints === updatedElements[i-1].user.preliminaryPoints) {
                updatedElements.push({...entries[i], placement: updatedElements[i-1].placement});
                continue;
            }
            updatedElements.push(entries[i])
        }
        return updatedElements;
    }, [entries]);


    useEffect(() => {
        apiService.getDashboardLeaderboard(community?.id).then(res => setEntries(res.data as LeaderboardElement[]));

        const interval = setInterval(() => apiService.getDashboardLeaderboard(community?.id).then(res => setEntries(res.data as LeaderboardElement[])), 10_000);

        return () => clearInterval(interval);
    }, []);

    const renderRow = (els: any[]) => {
        const colorStyle = cookies.application_user === els[1] ? '#c84df1' : undefined;

        return (
            <ListItem sx={{padding: 0, margin: 0}}>
                <List orientation="horizontal" sx={{padding: 0, margin: 0}}>
                    {els.map((element) => (
                        <>
                            <ListItem sx={{width: '100px', height: '10px', padding: 0, margin: 0}}>
                                <p style={{margin: 0, color: colorStyle}}>{element}</p>
                            </ListItem>
                            <ListDivider />
                        </>
                    ))}
                </List>
            </ListItem>
        );
    }


    return (
        <Card>
            <CardContent>
                <h3>{`${community?.name ?? "Globales"} Leaderboard`}</h3>
                <List sx={{maxWidth: '300px'}}>
                    {renderRow(["Platzierung", "Nutzername", "Punkte"])}
                    <ListDivider sx={{margin: 0}} />
                    {elements.map((element) => (
                        <>
                            {renderRow([element.placement, element.user.username, element.user.preliminaryPoints])}
                            <ListDivider sx={{margin: 0}} />
                        </>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default DashboardLeaderboard;