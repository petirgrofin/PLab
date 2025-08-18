import React from "react";
import { InlineMath } from "react-katex";

const BasicTable = () => {
  const data = {
    Lucas: ["Sí", "Sí"],
    Mateo: ["No", "No"],
    Carlos: ["Sí", "Sí"],
    Felipe: ["No", "Sí"],
    Luis: ["Sí", "No"],
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">
              Estudiantes
            </th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">
              Practica atletismo <InlineMath math={"(A)"} />
            </th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">
              Practica baloncesto <InlineMath math={"(B)"} />
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([name, [atletismo, baloncesto]], index) => (
            <tr
              key={name}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                {name}
              </td>
              <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                {atletismo}
              </td>
              <td className="border border-gray-300 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                {baloncesto}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BasicTable;
