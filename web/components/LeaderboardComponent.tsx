import {List, ListDivider, ListItem, ListItemButton} from "@mui/joy";
import {useMemo} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useCookies} from "react-cookie";


export interface LeaderboardElement {
    placement: number;
    user: {
        username: string;
        points: number;
        preliminaryPoints: number;
    }
}

interface LeaderboardComponentProps {
    elements: LeaderboardElement[];
   topPageIncrease: () => void;
   bottomPageIncrease: () => void;
}

const LeaderboardComponent = ({elements, topPageIncrease, bottomPageIncrease}: LeaderboardComponentProps) => {

    const [cookies] = useCookies(['application_user']);

    const topElements = useMemo<LeaderboardElement[]>(() => {
        const filtered= [];
        let i = 0;
        while (elements.length-1 > i+1 && i+1 === elements[i].placement) {
            filtered.push(elements[i]);
            i++;
        }
        return filtered;
    }, [elements]);

    const bottomElements = useMemo<LeaderboardElement[]>(() => {
        const filtered= [];
        let i = elements.length-1;
        while (0 < i && elements[i-1].placement+1 === elements[i].placement) {
            filtered.push(elements[i]);
            i--;
        }
        if (elements.length > 0) {
            filtered.push(elements[i]);
        }
        return filtered.reverse();
    }, [elements]);

    const youElement = useMemo<LeaderboardElement[]>(
        () => elements.filter((e) => e.user.username === cookies.application_user),
        [elements, topElements, bottomElements]);


    const renderRow = (els: any[]) => (
        <ListItem sx={{padding: 0, margin: 0}}>
            <List orientation="horizontal" sx={{padding: 0, margin: 0}}>
                {els.map((element) => (
                    <>
                        <ListItem sx={{width: '200px', height: '10px', padding: 0, margin: 0}}>
                            <p style={{margin: 0}}>{element}</p>
                        </ListItem>
                        <ListDivider />
                    </>
                ))}
            </List>
        </ListItem>
    );

    return (
        <List>
            {renderRow(["Platzierung", "Nutzername", "Punkte"])}
            <ListDivider sx={{margin: 0}} />
            {topElements.map((element) => (
                <>
                    {renderRow([element.placement, element.user.username, element.user.preliminaryPoints])}
                    <ListDivider sx={{margin: 0}} />
                </>
            ))}
            <ListItem>
                <ListItemButton sx={{display: 'grid', placeItems: 'center'}} onClick={topPageIncrease}>
                    <ExpandMoreIcon color="primary" fontSize="large" />
                </ListItemButton>
            </ListItem>
            {youElement.map((e) => renderRow([e.placement, e.user.username, e.user.preliminaryPoints]))}
            <ListItem>
                <ListItemButton sx={{display: 'grid', placeItems: 'center'}} onClick={bottomPageIncrease}>
                    <ExpandLessIcon color="primary" fontSize="large" />
                </ListItemButton>
            </ListItem>
            {bottomElements.map((element) => (
                <>
                    {renderRow([element.placement, element.user.username, element.user.preliminaryPoints])}
                    <ListDivider sx={{margin: 0}} />
                </>
            ))}
        </List>
    );
}

export default LeaderboardComponent;