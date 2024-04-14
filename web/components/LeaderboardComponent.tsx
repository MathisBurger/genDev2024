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
   maxCount: number;
}

const LeaderboardComponent = ({elements, topPageIncrease, bottomPageIncrease, maxCount}: LeaderboardComponentProps) => {

    const [cookies] = useCookies(['application_user']);

    const displayButtons = useMemo<boolean>(() => elements.length<maxCount, [elements, maxCount]);

    const topElements = useMemo<LeaderboardElement[]>(() => {
        const filtered: LeaderboardElement[] = [];
        let i = 0;
        while (
            elements.length > i+1
            && (
                i+1 === elements[i].placement
                || (i-1 >= 0 && elements[i-1].user.preliminaryPoints === elements[i].user.preliminaryPoints)
            )
            ) {
            if (i-1 >= 0 && elements[i-1].user.preliminaryPoints === elements[i].user.preliminaryPoints) {
                filtered.push({...elements[i], placement: filtered[i-1].placement});
            } else {
                filtered.push(elements[i]);
            }
            i++;
        }
        return filtered.splice(0, filtered.length-(filtered.length % 10 -3));
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
        return filtered.reverse().filter((f) => !topElements.map(e => e.user.username).includes(f.user.username));
    }, [elements]);

    const youElement = useMemo<LeaderboardElement[]>(
        () => {
            const youElements = elements.filter((e) => !topElements.map(el => el.user.username).includes(e.user.username) && !bottomElements.map(el => el.user.username).includes(e.user.username));
            if (youElements.length === 0) {
                return [];
            }
            if (youElements[0].user.preliminaryPoints === topElements[topElements.length-1].user.preliminaryPoints) {
                return [{...youElements[0], placement: topElements[topElements.length-1].placement}]
            }
            return youElements;
        },
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
            {displayButtons && (
                <ListItem>
                    <ListItemButton sx={{display: 'grid', placeItems: 'center'}} onClick={topPageIncrease}>
                        <ExpandMoreIcon color="primary" fontSize="large" />
                    </ListItemButton>
                </ListItem>
            )}
            {youElement.map((e) => renderRow([e.placement, e.user.username, e.user.preliminaryPoints]))}
            {displayButtons && (
                <ListItem>
                    <ListItemButton sx={{display: 'grid', placeItems: 'center'}} onClick={bottomPageIncrease}>
                        <ExpandLessIcon color="primary" fontSize="large" />
                    </ListItemButton>
                </ListItem>
            )}
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