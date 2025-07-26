import React, { useState } from "react";

export default function FreeResponse() {
  const [input, setInput] = useState("");

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Respuesta"
      className="border border-gray-300 rounded px-3 py-2 w-32 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
