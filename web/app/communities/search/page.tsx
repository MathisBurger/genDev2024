'use client';
import EntityList from "@/components/EntityList";
import {useEffect, useMemo, useState} from "react";
import {GridColDef, GridPaginationModel} from "@mui/x-data-grid";
import {Community} from "@/typings/community";
import useApiService from "@/hooks/useApiService";
import AuthorizedLayout from "@/components/AuthorizedLayout";


const SearchPage = () => {

    const apiService = useApiService();

    const [model, setModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 25
    });

    const [communities, setCommunities] = useState<Community[]>([]);
    const [totalNumberOfCommunities, setTotalNumberOfCommunities] = useState<number>(0);

    useEffect(() => {
        apiService.getAllCommunities(model.pageSize, model.page).then((res) => setCommunities(res.data as Community[]));
    }, [model]);

    useEffect(() => {
        apiService.getCommunityCount().then((res) => setTotalNumberOfCommunities(res));
    }, []);

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

    return (
        <AuthorizedLayout>
            <h1>Communities suchen</h1>
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
        </AuthorizedLayout>
    )
}

export default SearchPage;