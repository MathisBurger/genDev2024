'use client';
import {DataGrid, DataGridProps, GridToolbar} from "@mui/x-data-grid";
import {useMemo} from "react";


const EntityList = ({
    rows,
    columns,
    pagination,
    paginationMode,
    pageSizeOptions,
    paginationModel,
    onPaginationModelChange,
    rowCount,
}: DataGridProps) => {

    const iDedRows = useMemo<any[]>(
        () => (rows ?? []).map((r, index) => ({...r, ghostId: index+1})),
        [rows]
    );

    return (
        <DataGrid
            columns={columns}
            rows={iDedRows}
            getRowId={(row) => row.ghostId}
            slots={{toolbar: GridToolbar}}
            paginationModel={paginationModel}
            pagination={pagination ?? true}
            pageSizeOptions={pageSizeOptions ?? [25, 50, 100]}
            paginationMode={paginationMode ?? "client"}
            onPaginationModelChange={onPaginationModelChange}
            rowCount={rowCount ?? iDedRows.length}
        />
    );
}

export default EntityList;