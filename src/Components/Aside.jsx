import React from "react";

export function Aside({ isActive, onClose, children }) {
  return (
    <div>
      <div
        className={`fixed top-0 right-0 h-full w-2xl bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isActive ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded cursor-pointer"
        >
          ✕
        </button>
        <div className="m-6 p-4 overflow-y-auto h-full flex flex-col gap-4">{children}</div>
      </div>
      {isActive && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black opacity-40 z-40"
        ></div>
      )}
    </div>
  );
}
