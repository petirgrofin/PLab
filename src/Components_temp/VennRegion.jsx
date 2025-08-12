import { REGION_IDS } from "../Constants/regions";
/********************************************
 * VennRegion
 * ------------------------------------------
 * Minimal building block that renders either:
 *   - the outer rectangle ((AuB)')
 *   - a path region (AdB, BdA, AiB)
 *
 * Props:
 *   regionId: string (REGION_IDS.*)
 *   d?: string               (path data when regionId !== 'REGION_IDS.Outside')
 *   width?: number           (rect dims when regionId === 'REGION_IDS.Outside')
 *   height?: number
 *   x?: number               (default 0)
 *   y?: number               (default 0)
 *   selected: boolean        (is highlighted)
 *   interactive?: boolean    (default true) – attaches click handler & pointer cursor
 *   onSelect?: (regionId: string) => void
 */
export function VennRegion({
  regionId,
  d,
  width,
  height,
  x = 0,
  y = 0,
  selected = false,
  interactive = true,
  onSelect,
  fillColor = "white"
}) {
  const fill = selected ? "gray" : "white"
  const handleClick = () => {
    if (!interactive) return;
    onSelect?.(regionId);
  };
  const common = {
    onClick: handleClick,
    style: { cursor: interactive ? "pointer" : "default" },
    fill,
    stroke: "black",
    strokeWidth: 2,
  };
  return regionId === REGION_IDS.Outside ? (
    <rect {...common} x={x} y={y} width={width} height={height} />
  ) : (
    <path {...common} d={d} />
  );
}
