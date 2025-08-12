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
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 shadow-lg rounded-lg w-full">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border border-gray-300 px-4 py-1 text-left">Estudiantes</th>
            <th className="border border-gray-300 px-4 py-1 text-left">Practica atletismo <InlineMath math={"(A)"}/></th>
            <th className="border border-gray-300 px-4 py-1 text-left">Practica baloncesto <InlineMath math={"(B)"}/></th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([name, [atletismo, baloncesto]], index) => (
            <tr
              key={name}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="border border-gray-300 px-4 py-1 font-medium">{name}</td>
              <td className="border border-gray-300 px-4 py-1">{atletismo}</td>
              <td className="border border-gray-300 px-4 py-1">{baloncesto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BasicTable;
