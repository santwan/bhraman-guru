// src/pages/ViewTrip/components/HeaderActions.jsx
import React from "react";

export default function HeaderActions({ onBack, onSave, saving }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onBack} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
      <button
        onClick={onSave}
        disabled={saving}
        className={`px-4 py-2 rounded ${saving ? "bg-gray-300" : "bg-primary-600 hover:bg-primary-700 text-white"}`}
      >
        {saving ? "Saving..." : "Save Trip"}
      </button>
    </div>
  );
}
