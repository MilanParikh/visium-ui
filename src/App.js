import React, { useState } from "react";
import FileUploader from "./components/FileUploader";
import SpatialPlot from "./components/SpatialPlot";
import InteractionTable from "./components/InteractionTable";
import { Tab, Tabs, Box } from "@mui/material";

function App() {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <h1>Visium Spatial Viewer</h1>
      <FileUploader onDataLoad={setData} />

      <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ marginTop: 2 }}>
        <Tab label="Spatial Plot" />
        <Tab label="Interactions" />
      </Tabs>

      <Box sx={{ marginTop: 2 }}>
        {tab === 0 && <SpatialPlot data={data} />}
        {tab === 1 && <InteractionTable interactions={data?.interactions} />}
      </Box>
    </Box>
  );
}

export default App;