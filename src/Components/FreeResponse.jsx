import { useComponentContext } from '../lessons/ComponentContext';
import React, { useState } from "react";

export default function FreeResponse() {
  const [input, setInput] = useState("");
  const { setExerciseResponse } = useComponentContext();

  const handleChange = (e) => {
    const value = e.target.value;
    // Solo permitir números y punto decimal
    if (/^[0-9.]*$/.test(value)) {
      setInput(value);
      setExerciseResponse({ freeResponse: true, response: value });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Respuesta"
        className="border border-gray-300 rounded px-3 py-2 w-32 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <small className="text-gray-500 text-xs mt-1">
        Formato: número entre 0 y 1, redondeado a 2 decimales (ej. 0.17)
      </small>
    </div>
  );
}
