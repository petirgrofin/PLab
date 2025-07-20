import { REGION_IDS } from "../Constants/regions";

function makeLensShapes(cxA, cxB, cy, r) {
  // Finding the intersections is possible through basic triangle geometry
  const dx = cxB - cxA;
  const a = dx / 2;

  // Disjoint circles => no visible overlap; return empty paths.
  if (dx >= 2 * r) return { lens: "", left: "", right: "" };

  const h = Math.sqrt(r * r - a * a);
  const px = (cxA + cxB) / 2;
  const py = cy;

  const intersection1 = { x: px, y: py + h };
  const intersection2 = { x: px, y: py - h };

  const lensPath = `
    M ${intersection1.x} ${intersection1.y}
    A ${r} ${r} 0 0 1 ${intersection2.x} ${intersection2.y}
    A ${r} ${r} 0 0 1 ${intersection1.x} ${intersection1.y}
    Z
  `;

  const leftPath = `
    M ${intersection2.x} ${intersection2.y}
    A ${r} ${r} 0 1 0 ${intersection1.x} ${intersection1.y}
    A ${r} ${r} 0 0 1 ${intersection2.x} ${intersection2.y}
    Z
  `;

  const rightPath = `
    M ${intersection1.x} ${intersection1.y}
    A ${r} ${r} 0 1 0 ${intersection2.x} ${intersection2.y}
    A ${r} ${r} 0 0 1 ${intersection1.x} ${intersection1.y}
    Z
  `;

  return {
    lens: lensPath.trim(),
    left: leftPath.trim(),
    right: rightPath.trim(),
  };
}

export function constructVennDiagram(config) {
  const { width, height, radius, overlap } = config;

  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  const { lens, left, right } = makeLensShapes(cxA, cxB, cy, radius);

  return [
    { id: REGION_IDS.Outside, type: "rect", width, height },
    { id: REGION_IDS.OnlyA, type: "path", d: left },
    { id: REGION_IDS.OnlyB, type: "path", d: right },
    { id: REGION_IDS.Intersection, type: "path", d: lens },
  ];
}