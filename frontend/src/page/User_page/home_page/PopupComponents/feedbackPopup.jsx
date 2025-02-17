import React from "react";

export default function feedbackPopup({ trigger, children }) {
  if (!trigger) return null;
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-7 rounded-lg shadow-lg relative ">
        {children}
      </div>
    </div>
  );
}
