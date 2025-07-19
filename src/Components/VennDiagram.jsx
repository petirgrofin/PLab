function makeLensShapes(cxA, cxB, cy, r) {

    // Finding the intersections is possible through basic triangle geometry
    const dx = cxB - cxA;
    const a = dx / 2;

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
      right: rightPath.trim()
    };
}

const VennDiagram = ({selectedRegions, setSelectedRegions}) => {

  const width = 500; // 565
  const height = 300;
  const radius = 100;
  const overlap = 60;

  const cxA = width / 2 - overlap;
  const cxB = width / 2 + overlap;
  const cy = height / 2;

  const { lens, left, right } = makeLensShapes(cxA, cxB, cy, radius);

  // Sorting layers based on selectedRegion for visual "raise"
  const shapes = [
    { id: "AdB", d: left, fill: selectedRegions.includes("AdB") ? "gray" : "white"},
    { id: "BdA", d: right, fill: selectedRegions.includes("BdA") ? "gray" : "white" },
    { id: "AiB", d: lens, fill: selectedRegions.includes("AiB") ? "gray" : "white"}
  ];

  function onRegionClick(regionId){
    if (selectedRegions.includes(regionId)){
      setSelectedRegions(selectedRegions.filter((region) => {return region !== regionId}));
    }
    else{
      setSelectedRegions([...selectedRegions, regionId])
    }
  }

  return (
    <svg className="m-auto" width={width} height={height}>
      <rect onClick={() => {onRegionClick("(AuB)'")}} style={{cursor: "pointer"}} width={width} height={height} fill={`${selectedRegions.includes("(AuB)'") ? 'gray' : 'white'}`} strokeWidth={2} stroke="black"></rect>
      {shapes.map(({ id, d, fill }) => (
        <path
          key={id}
          d={d}
          fill={fill}
          stroke={"black"}
          strokeWidth={2}
          onClick={() => {onRegionClick(id)}}
          style={{ cursor: "pointer" }}
        />
      ))}
    </svg>
  );
};

export default VennDiagram;
