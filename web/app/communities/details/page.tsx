'use client';
import {useSearchParams} from "next/navigation";
import useApiService from "@/hooks/useApiService";
import {useEffect, useMemo, useState} from "react";
import {Community, ExtendedCommunity} from "@/typings/community";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import EntityList from "@/components/EntityList";
import {GridColDef} from "@mui/x-data-grid";
import {Button, Grid} from "@mui/joy";
import usePersonalCommunities from "@/hooks/usePersonalCommunities";
import ResponseCode from "@/service/ResponseCode";
import useSnackbar from "@/hooks/useSnackbar";


const DetailsPage = () => {

    const id = useSearchParams().get('id') ?? '';
    const apiService = useApiService();
    const [community, setCommunity] = useState<ExtendedCommunity|null>(null);
    const {getter, setter} = usePersonalCommunities();
    const snackbar = useSnackbar();

    useEffect(() => {
        const fetcher = async () => {
            const resp = await apiService.getCommunity(parseInt(id, 10));
            if (resp.status !== 200) {
                console.log(resp.data);
            } else {
                setCommunity(resp.data as ExtendedCommunity);
            }
        }
        fetcher();
    }, [id, apiService]);

    const memberCols = useMemo<GridColDef[]>(() => [
        {
            field: 'username',
            headerName: 'Benutzername',
            width: 200
        }
    ], []);

    const onJoin = async () => {
        const joinResp = await apiService.joinCommunity(parseInt(id, 10));
        if (joinResp.status !== ResponseCode.OK) {
            snackbar.error(joinResp.data as string);
            return;
        }
        setCommunity(joinResp.data as ExtendedCommunity);
        const personalComms = await apiService.getPersonalCommunities();
        setter(personalComms.data as Community[]);
    }

    return (
        <AuthorizedLayout>
            {community === null ? (
                <h1>Community existiert nicht</h1>
            ) : (
                <>
                    <h1>{community.name}</h1>
                    {!getter.map(g => g.id).includes(community.id) && (
                        <Button onClick={onJoin}>Beitreten</Button>
                    )}
                    <Grid container direction="row" spacing={2}>
                        <Grid xs={3}>
                            <h2>Mitglieder</h2>
                            <EntityList columns={memberCols} rows={community.members} sx={{width: '300px', display: 'grid'}} noSlot hideFooter />
                        </Grid>
                        <Grid xs={9}>
                            <h2>Leaderboard</h2>
                        </Grid>
                    </Grid>
                </>
            )}
        </AuthorizedLayout>
    );
}

export default DetailsPage;