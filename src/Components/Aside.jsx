import React from "react";
import { renderInlineMathText } from "../utils/LatexUtils";

function renderInfo(info) {
  if (!info){
    return null;
  }
  return info.map((item, index) => {
    if (item.type === "p") {
      return <p key={index} className="mb-2">{renderInlineMathText(item.value)}</p>;
    }

    if (item.type === "ul") {
      return (
        <ul key={index} className="list-disc list-inside mb-2">
          {item.items.map((li, liIndex) => (
            <li key={liIndex}>{renderInlineMathText(li)}</li>
          ))}
        </ul>
      );
    }

    return null;
  });
}

export function Aside({ isActive, onClose, title, info }) {
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
        <div className="m-6 p-4 overflow-y-auto h-full flex flex-col gap-4">
          <h2 className="font-bold text-2xl mb-2">{title}</h2>
          {renderInfo(info)}
        </div>
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
