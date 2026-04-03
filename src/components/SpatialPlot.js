// src/components/SpatialPlot.js
import React, { useEffect, useState } from "react";
import { Autocomplete, Box, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import Plot from "react-plotly.js";

export default function SpatialPlot({ data }) {
  const pathwayKeys = ["pathway_leiden_cluster", "gene_exp_leiden_cluster"];
  const spots = data?.spots || [];
  const firstSpot = spots[0] || {};
  const geneKeys = Object.keys(firstSpot).filter(
    (k) => !["x", "y", ...pathwayKeys].includes(k)
  );

  const [listType, setListType] = useState("pathways");
  const [colorBy, setColorBy] = useState(pathwayKeys[0]);

  const availableKeys = listType === "pathways" ? pathwayKeys : geneKeys;
  const colorType = listType === "pathways" ? "categorical" : "continuous";

  useEffect(() => {
    if (availableKeys.length === 0) return;

    if (!availableKeys.includes(colorBy)) {
      setColorBy(availableKeys[0]);
    }
  }, [availableKeys, colorBy]);

  const categoricalPalette = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
    "#393b79",
    "#637939",
    "#8c6d31",
    "#843c39",
    "#7b4173",
    "#3182bd",
  ];

  const selectedValues = spots.map((spot) => spot[colorBy]);

  let plotData = [];
  const layout = {
    width: 700,
    height: 700,
    xaxis: { title: "X" },
    yaxis: { title: "Y", scaleanchor: "x" },
    title: "Spatial Plot",
  };

  if (colorType === "categorical") {
    const categoryOrder = [...new Set(selectedValues.map((value) => String(value ?? "Unknown")))];

    plotData = categoryOrder.map((category, index) => {
      const categoryPoints = spots.filter(
        (spot, spotIndex) => String(selectedValues[spotIndex] ?? "Unknown") === category
      );

      return {
        x: categoryPoints.map((spot) => spot.x),
        y: categoryPoints.map((spot) => spot.y),
        mode: "markers",
        type: "scatter",
        name: category,
        legendgroup: category,
        marker: {
          size: 8,
          color: categoricalPalette[index % categoricalPalette.length],
          line: { width: 0 },
        },
        customdata: categoryPoints.map(() => [category]),
        hovertemplate:
          "X: %{x}<br>Y: %{y}<br>" + colorBy + ": %{customdata[0]}<extra></extra>",
      };
    });
  } else {
    plotData = [
      {
        x: spots.map((spot) => spot.x),
        y: spots.map((spot) => spot.y),
        mode: "markers",
        type: "scatter",
        marker: {
          size: 8,
          color: selectedValues.map((value) => Number(value)),
          colorscale: "Viridis",
          showscale: true,
          colorbar: { title: colorBy },
        },
        hovertemplate:
          "X: %{x}<br>Y: %{y}<br>" + colorBy + ": %{marker.color}<extra></extra>",
      },
    ];
  }

  return (
    <div>
      {!data && <div>Upload a dataset first</div>}
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Color by
        </Typography>

        <ToggleButtonGroup
          size="small"
          exclusive
          value={listType}
          onChange={(_, newListType) => {
            if (newListType) {
              setListType(newListType);
            }
          }}
        >
          <ToggleButton value="pathways">Pathways</ToggleButton>
          <ToggleButton value="genes">Genes</ToggleButton>
        </ToggleButtonGroup>

        <Autocomplete
          size="small"
          options={availableKeys}
          value={colorBy}
          onChange={(event, newValue) => {
            if (newValue) {
              setColorBy(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Search..." />
          )}
          sx={{ minWidth: 260 }}
        />
      </Box>

      <Plot
        data={plotData}
        layout={layout}
      />
    </div>
  );
}