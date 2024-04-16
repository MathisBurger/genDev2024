'use client';
import {List, ListDivider, ListItem, ListItemButton} from "@mui/joy";
import {useCallback, useEffect, useMemo, useState} from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {useCookies} from "react-cookie";
import useApiService from "@/hooks/useApiService";
import {CommunityMember} from "@/typings/community";
import ResponseCode from "@/service/ResponseCode";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {leaderboardSortByCreation} from "@/utils/dateUtils";

export interface LeaderboardRank {
    community: {
        id: number
    };
    previousRank: number
}

export interface LeaderboardElement {
    placement: number;
    user: {
        username: string;
        points: number;
        preliminaryPoints: number;
        createdAt: string;
        previousRanks: LeaderboardRank[];
    }
}

interface LeaderboardComponentProps {
    elements: LeaderboardElement[];
   topPageIncrease: () => void;
   bottomPageIncrease: () => void;
   maxCount: number;
   communityId?: number;
   updateViaSocket?: () => void;
}

const LeaderboardComponent = ({elements, topPageIncrease, bottomPageIncrease, maxCount, communityId, updateViaSocket}: LeaderboardComponentProps) => {
    const [cookies] = useCookies(['application_user']);
    const [pinnedUsers, setPinnedUsers] = useState<CommunityMember[]>([]);
    const pinnedUsersUsernames = useMemo(() => pinnedUsers.map(u => u.username), [pinnedUsers]);
    const apiService = useApiService();

    useEffect(() => {
        if (communityId) {
            apiService.getPinnedUsers(communityId).then(res => setPinnedUsers(res.data as CommunityMember[]))
        }
    }, []);

    const isSpecialDisplay = useCallback((name: string) => {
        const specialNames = pinnedUsersUsernames.concat(cookies.application_user);
        return specialNames.includes(name);
    }, [cookies, pinnedUsersUsernames]);

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
        return leaderboardSortByCreation(filtered.splice(0, filtered.length-(filtered.length % 10 -3)));
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
        return leaderboardSortByCreation(filtered.reverse().filter((f) => !topElements.map(e => e.user.username).includes(f.user.username)));
    }, [elements]);

    const youElement = useMemo<LeaderboardElement[]>(
        () => {
            const youElements = elements.filter((e) => !topElements.map(el => el.user.username).includes(e.user.username) && !bottomElements.map(el => el.user.username).includes(e.user.username));
            if (youElements.length === 0) {
                return [];
            }
            const updatedElements: LeaderboardElement[] = [];
            for (let i=0; i<youElements.length; i++) {
                if (i===0 && topElements.length >0 && youElements[0].user.preliminaryPoints === topElements[topElements.length-1].user.preliminaryPoints) {
                    updatedElements.push({...youElements[0], placement: topElements[topElements.length-1].placement});
                    continue;
                }
                if (updatedElements.length > 0 && youElements[i].user.preliminaryPoints === updatedElements[i-1].user.preliminaryPoints) {
                    updatedElements.push({...youElements[i], placement: updatedElements[i-1].placement});
                    continue;
                }
                updatedElements.push(youElements[i])
            }
            return leaderboardSortByCreation(updatedElements);
        },
        [elements, topElements, bottomElements]);

    const pinUser = async (userToPin: string) => {
        if (communityId) {
            const result = await apiService.pinUser(communityId, userToPin);
            if (result.status === ResponseCode.OK) {
                setPinnedUsers(result.data as CommunityMember[]);
            }
        }
    }

    const unpinUser = async (userToPin: string) => {
        if (communityId) {
            const result = await apiService.unpinUser(communityId, userToPin);
            if (result.status === ResponseCode.OK) {
                setPinnedUsers(result.data as CommunityMember[]);
                if (updateViaSocket) {
                    updateViaSocket();
                }
            }
        }
    }


    const renderRow = (els: any[], renderFav?: boolean) => {
        const canBePinned = cookies.application_user !== els[1];
        const colorStyle = isSpecialDisplay(els[1]) ? '#c84df1' : undefined;

        return (
            <ListItem sx={{padding: 0, margin: 0}}>
                <List orientation="horizontal" sx={{padding: 0, margin: 0}}>
                    {els.map((element) => (
                        <>
                            <ListItem sx={{width: '150px', height: '10px', padding: 0, margin: 0}}>
                                <p style={{margin: 0, color: colorStyle}}>{element}</p>
                            </ListItem>
                            <ListDivider />
                        </>
                    ))}
                    <ListItem sx={{width: '50px', height: '10px', padding: 0, margin: 0}}>
                        {pinnedUsersUsernames.includes(els[1]) && renderFav && canBePinned && (
                            <ListItemButton onClick={() => unpinUser(els[1])}>
                                <StarIcon />
                            </ListItemButton>
                        )}
                        {!pinnedUsersUsernames.includes(els[1]) && renderFav && canBePinned && (
                            <ListItemButton onClick={() => pinUser(els[1])}>
                                <StarBorderIcon />
                            </ListItemButton>
                        )}
                    </ListItem>
                </List>
            </ListItem>
        );
    }

    return (
        <List sx={{maxWidth: '700px'}}>
            {renderRow(["Platzierung", "Nutzername", "Punkte", "Sichere Punkte"], false)}
            <ListDivider sx={{margin: 0}} />
            {topElements.map((element) => (
                <>
                    {renderRow([element.placement, element.user.username, element.user.preliminaryPoints, element.user.points], communityId !== undefined)}
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
            {youElement.map((e) => renderRow([e.placement, e.user.username, e.user.preliminaryPoints, e.user.points], communityId !== undefined))}
            {displayButtons && (
                <ListItem>
                    <ListItemButton sx={{display: 'grid', placeItems: 'center'}} onClick={bottomPageIncrease}>
                        <ExpandLessIcon color="primary" fontSize="large" />
                    </ListItemButton>
                </ListItem>
            )}
            {bottomElements.map((element) => (
                <>
                    {renderRow([element.placement, element.user.username, element.user.preliminaryPoints, element.user.points], communityId !== undefined)}
                    <ListDivider sx={{margin: 0}} />
                </>
            ))}
        </List>
    );
}

export default LeaderboardComponent;