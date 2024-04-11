'use client';
import AuthorizedLayout from "@/components/AuthorizedLayout";
import {Button, ButtonGroup} from "@mui/joy";
import {useRouter} from "next/navigation";
import usePersonalCommunities from "@/hooks/usePersonalCommunities";
import EntityList from "@/components/EntityList";
import {useMemo} from "react";
import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";


const CommunitiesPage = () => {

    const router = useRouter();
    const {getter} = usePersonalCommunities();

    const cols = useMemo<GridColDef[]>(() => [
        {
            field: 'name',
            headerName: 'Name',
            width: 200
        },
        {
            field: 'memberCount',
            headerName: 'Mitglieder'
        },
        {
            field: '_actions',
            headerName: 'Aktionen',
            renderCell: ({row}: GridRenderCellParams) => (
                <Button onClick={() => router.push(`/communities/details?id=${row.id}`)}>Öffnen</Button>
            )
        }
    ], []);

    return (
        <AuthorizedLayout>
            <h1>Communities</h1>
            {getter.length < 5 && (
                <ButtonGroup>
                    <Button color="primary" onClick={() => router.push("/communities/search")}>Suchen</Button>
                    <Button color="primary" onClick={() => router.push("/communities/create")}>Erstellen</Button>
                </ButtonGroup>
            )}
            <EntityList columns={cols} rows={getter} />
        </AuthorizedLayout>
    );
}

export default CommunitiesPage;