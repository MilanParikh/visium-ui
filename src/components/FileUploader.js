// src/components/FileUploader.js
import React, { useState } from "react";

export default function FileUploader({ onDataLoad }) {
  const [loading, setLoading] = useState(false);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        onDataLoad(data);
      } catch (err) {
        alert("Invalid JSON file.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input type="file" accept=".json" onChange={handleFile} />
      {loading && <span style={{ marginLeft: 8 }}>Loading...</span>}
    </div>
  );
}