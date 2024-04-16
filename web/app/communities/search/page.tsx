'use client';
import EntityList from "@/components/EntityList";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {GridColDef, GridPaginationModel, GridRenderCellParams} from "@mui/x-data-grid";
import {Community} from "@/typings/community";
import useApiService from "@/hooks/useApiService";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, ButtonGroup, Grid, Input, Stack} from "@mui/joy";
import usePersonalCommunities from "@/hooks/usePersonalCommunities";
import ResponseCode from "@/service/ResponseCode";
import useSnackbar from "@/hooks/useSnackbar";
import {useRouter} from "next/navigation";


const SearchPage = () => {

    const apiService = useApiService();

    const [model, setModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 25
    });

    const [communities, setCommunities] = useState<Community[]>([]);
    const [totalNumberOfCommunities, setTotalNumberOfCommunities] = useState<number>(0);
    const [search, setSearch] = useState<string>("");
    const {getter, setter} = usePersonalCommunities();
    const snackbar = useSnackbar();
    const router = useRouter();

    useEffect(() => {
        apiService.getAllCommunities(model.pageSize, model.page, search === "" ? undefined : search).then((res) => setCommunities(res.data as Community[]));
    }, [model, search]);

    useEffect(() => {
        apiService.getCommunityCount(search === "" ? undefined : search).then((res) => setTotalNumberOfCommunities(res));
    }, [search]);

    const onJoin = async (id: number) => {
        const joinResp = await apiService.joinCommunity(id);
        if (joinResp.status !== ResponseCode.OK) {
            snackbar.error(joinResp.data as string);
            return;
        }
        const personalComms = await apiService.getPersonalCommunities();
        setter(personalComms.data as Community[]);
    }

    const cols = useMemo<GridColDef[]>(() => [
        {
            field: 'name',
            headerName: "Name",
            width: 200
        },
        {
            field: 'memberCount',
            headerName: "Mitglieder",
            width: 100
        },
        {
            field: '_actions',
            headerName: 'Aktionen',
            width: 200,
            renderCell: ({row}: GridRenderCellParams) => getter.length < 5 ? (
                    <ButtonGroup sx={{marginTop: '7px'}} color="primary">
                        <Button onClick={() => router.push(`/communities/details?id=${row.id}`)}>Öffnen</Button>
                        <Button onClick={() => onJoin(row.id)}>Beitreten</Button>
                    </ButtonGroup>
            ) : (
                <Button onClick={() => router.push(`/communities/details?id=${row.id}`)}>Öffnen</Button>
            )
        }
    ], [getter]);

    const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setModel({pageSize: model.pageSize, page: 0});
        setSearch(`${data.get("search")}`)
    }

    const filteredCommunities = useMemo<Community[]>(
        () => {
            const Ids = getter.map((g) => g.id);
            return communities.filter((c) => !Ids.includes(c.id))
        },
        [getter, communities]
    );

    return (
        <AuthorizedLayout>
            <Stack spacing={2}>
                <h1>Communities suchen</h1>
                <form onSubmit={onSearchSubmit}>
                    <Grid direction="row" spacing={2} container>
                        <Grid xs={8} lg={10}>
                            <Input type="text" name="search" placeholder="Suche" />
                        </Grid>
                        <Grid xs={2} lg={2}>
                            <Button type="submit">Suchen</Button>
                        </Grid>
                    </Grid>
                </form>
                <EntityList
                    columns={cols}
                    rows={filteredCommunities}
                    pagination
                    paginationMode="server"
                    paginationModel={model}
                    onPaginationModelChange={setModel}
                    rowCount={totalNumberOfCommunities - getter.length}
                    pageSizeOptions={[25, 50, 100]}
                />
            </Stack>
        </AuthorizedLayout>
    )
}

export default SearchPage;