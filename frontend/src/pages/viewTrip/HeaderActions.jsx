import React from "react";

export default function HeaderActions({ onBack, onSave, saving }) {
  return (
    <div className="flex items-center gap-3">
      
      <button
        onClick={onBack}
        className="px-4 py-2  text-white transition-all duration-300 bg-amber-600 rounded hover:bg-amber-500/90 hover:scale-105"
      >
        Back
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className={`px-4 py-2 bg-green-600 hover:bg-green-500/90 transition-all duration-300 hover:scale-105 ${
          saving
            ? "bg-gray-300"
            : "bg-primary-600 hover:bg-primary-700 text-white"
        }`}
      >
        {saving ? "Saving..." : "Save Trip"}
      </button>
    </div>
  );
}
