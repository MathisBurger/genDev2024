'use client';
import EntityList from "@/components/EntityList";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {GridColDef, GridPaginationModel} from "@mui/x-data-grid";
import {Community} from "@/typings/community";
import useApiService from "@/hooks/useApiService";
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, FormControl, FormLabel, Grid, Input, Stack} from "@mui/joy";


const SearchPage = () => {

    const apiService = useApiService();

    const [model, setModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 25
    });

    const [communities, setCommunities] = useState<Community[]>([]);
    const [totalNumberOfCommunities, setTotalNumberOfCommunities] = useState<number>(0);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        apiService.getAllCommunities(model.pageSize, model.page, search === "" ? undefined : search).then((res) => setCommunities(res.data as Community[]));
    }, [model, search]);

    useEffect(() => {
        apiService.getCommunityCount(search === "" ? undefined : search).then((res) => setTotalNumberOfCommunities(res));
    }, [search]);

    const cols = useMemo<GridColDef[]>(() => [
        {
            field: 'name',
            headerName: "Name",
            width: 650
        },
        {
            field: 'memberCount',
            headerName: "Mitglieder",
            width: 200
        }
    ], []);

    const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setModel({pageSize: model.pageSize, page: 0});
        setSearch(`${data.get("search")}`)
    }

    return (
        <AuthorizedLayout>
            <Stack spacing={2}>
                <h1>Communities suchen</h1>
                <form onSubmit={onSearchSubmit}>
                    <Grid direction="row" spacing={2} container>
                        <Grid xs={10}>
                            <Input type="text" name="search" placeholder="Suche" />
                        </Grid>
                        <Grid xs={2}>
                            <Button type="submit">Suchen</Button>
                        </Grid>
                    </Grid>
                </form>
                <EntityList
                    columns={cols}
                    rows={communities}
                    pagination
                    paginationMode="server"
                    paginationModel={model}
                    onPaginationModelChange={setModel}
                    rowCount={totalNumberOfCommunities}
                    pageSizeOptions={[25, 50, 100]}
                />
            </Stack>
        </AuthorizedLayout>
    )
}

export default SearchPage;