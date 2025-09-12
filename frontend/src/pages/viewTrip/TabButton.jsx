// src/pages/ViewTrip/components/TabButton.jsx
import React from "react";

export default function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 -mb-px border-b-2 ${active ? "border-primary-600 text-primary-700" : "border-transparent text-gray-600 hover:text-gray-800"}`}
    >
      {children}
    </button>
  );
}
