// src/pages/ViewTrip/components/RawJson.jsx
import React from "react";

export default function RawJson({ data }) {
  return (
    <pre className="bg-gray-100 p-4 rounded-lg text-sm text-left overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
