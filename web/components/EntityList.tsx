'use client';
import {DataGrid, DataGridProps, GridToolbar} from "@mui/x-data-grid";
import {useMemo} from "react";

interface EntityListProps extends DataGridProps {
    noSlot?: boolean;
}

const EntityList = ({
    rows,
    columns,
    pagination,
    paginationMode,
    pageSizeOptions,
    paginationModel,
    onPaginationModelChange,
    rowCount,
    sx,
    noSlot,
    hideFooter
}: EntityListProps) => {

    const iDedRows = useMemo<any[]>(
        () => (rows ?? []).map((r, index) => ({...r, ghostId: index+1})),
        [rows]
    );

    return (
        <DataGrid
            columns={columns}
            rows={iDedRows}
            getRowId={(row) => row.ghostId}
            slots={noSlot ? undefined : {toolbar: GridToolbar}}
            paginationModel={paginationModel}
            pagination={pagination ?? true}
            pageSizeOptions={pageSizeOptions ?? [25, 50, 100]}
            paginationMode={paginationMode}
            onPaginationModelChange={onPaginationModelChange}
            rowCount={rowCount ?? iDedRows.length}
            autoHeight={true}
            hideFooter={hideFooter}
            sx={sx}
        />
    );
}

export default EntityList;