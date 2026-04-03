import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function InteractionTable({ interactions }) {
  if (!interactions || interactions.length === 0) return <div>No interactions available</div>;

  const columns = [
    { field: "source", headerName: "Source", width: 150 },
    { field: "target", headerName: "Target", width: 150 },
    { field: "ligand", headerName: "Ligand", width: 150 },
    { field: "receptor", headerName: "Receptor", width: 150 },
    { field: "mean", headerName: "Mean", width: 100, type: "number" },
    { field: "pval", headerName: "P-value", width: 120, type: "number" },
  ];

  const rows = interactions.map((row, idx) => ({ id: idx, ...row }));

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
      />
    </div>
  );
}