import React, { useState, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";

/*
  CoinFlipSimulator
  -----------------
  Simulate flipping a *fair* coin repeatedly and visualize empirical frequencies vs. theoretical 50%.

  Features
  ========
  • Flip once.
  • Flip 1,000 times (bulk simulation).
  • Optional custom # of flips input.
  • Live updating counts + relative frequencies.
  • D3 bar chart (counts) that re-renders / animates on update.
  • A thin running-proportion sparkline (H proportion) to illustrate convergence toward 0.5.
  • Reset button.

  Props (all optional)
  --------------------
  - initialHeads (number) default 0
  - initialTails (number) default 0
  - onChange({heads, tails, total, history}) called after every update
  - maxHistory (number) limit stored flip outcomes (default 5_000 to avoid memory blowup)

  Integration Notes
  -----------------
  • Uses TailwindCSS utility classes.
  • D3 renders into <svg> inside a responsive wrapper; width auto-sizes to parent.
  • If you mount inside a container with dynamic width, pass a key or wrap with a ResizeObserver to trigger re-measure.
*/

// ----- Utility random flip -----
function flipCoin(probabilityHeads) {
  return Math.random() < probabilityHeads ? "H" : "T"; // fair coin
}

// ----- Bar Chart Subcomponent (D3) -----
function CoinBarChart({ heads, tails, width = 300, height = 160, animate = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const data = [
      { label: "H", value: heads },
      { label: "T", value: tails },
    ];

    const svg = d3.select(ref.current);
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    // Root group
    let g = svg.selectAll("g.chart-root").data([null]);
    g = g.enter().append("g").attr("class", "chart-root").merge(g);
    g.attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerW])
      .padding(0.3);

    const maxVal = Math.max(1, d3.max(data, (d) => d.value) ?? 1); // avoid 0 range
    const y = d3.scaleLinear().domain([0, maxVal]).nice().range([innerH, 0]);

    // Axes (update)
    let gx = g.selectAll("g.x-axis").data([null]);
    gx = gx.enter().append("g").attr("class", "x-axis").merge(gx);
    gx.attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));

    let gy = g.selectAll("g.y-axis").data([null]);
    gy = gy.enter().append("g").attr("class", "y-axis").merge(gy);
    gy.call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")));

    // Bars
    const bars = g.selectAll("rect.bar").data(data, (d) => d.label);
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", innerH)
      .attr("height", 0)
      .attr("fill", (d) => (d.label === "H" ? "#FACC15" : "#9CA3AF")) // yellow-400 / gray-400
      .merge(bars)
      .transition()
      .duration(animate ? 300 : 0)
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => innerH - y(d.value));

    bars.exit().remove();

    // Value labels
    const labels = g.selectAll("text.bar-label").data(data, (d) => d.label);
    labels
      .enter()
      .append("text")
      .attr("class", "bar-label text-xs font-mono")
      .attr("text-anchor", "middle")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", innerH - 4)
      .text((d) => d.value)
      .merge(labels)
      .transition()
      .duration(animate ? 300 : 0)
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 4)
      .text((d) => d.value);

    labels.exit().remove();
  }, [heads, tails, width, height, animate]);

  return <svg ref={ref} className="w-full h-auto" role="img" aria-label="Coin flip counts bar chart" />;
}

// ----- Running Proportion Sparkline -----
function ProportionSparkline({ history, width = 300, height = 40 }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");

    const margin = { top: 2, right: 2, bottom: 2, left: 2 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    let g = svg.selectAll("g.spark-root").data([null]);
    g = g.enter().append("g").attr("class", "spark-root").merge(g);
    g.attr("transform", `translate(${margin.left},${margin.top})`);

    // Compute running proportion of heads
    const props = [];
    let h = 0;
    history.forEach((side, i) => {
      if (side === "H") h += 1;
      props.push({ idx: i + 1, p: h / (i + 1) });
    });

    const x = d3.scaleLinear().domain([1, Math.max(1, history.length)]).range([0, innerW]);
    const y = d3.scaleLinear().domain([0, 1]).range([innerH, 0]);

    // Reference line at 0.5
    let refLine = g.selectAll("line.ref-50").data([null]);
    refLine = refLine
      .enter()
      .append("line")
      .attr("class", "ref-50 stroke-slate-300")
      .merge(refLine);
    refLine
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", y(0.5))
      .attr("y2", y(0.5))
      .attr("stroke-dasharray", "2,2")
      .attr("stroke-width", 1);

    // Line path
    const line = d3
      .line()
      .x((d) => x(d.idx))
      .y((d) => y(d.p));

    let path = g.selectAll("path.spark-line").data([props]);
    path = path
      .enter()
      .append("path")
      .attr("class", "spark-line")
      .merge(path);
    path
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#4F46E5") // indigo-600
      .attr("stroke-width", 1.5);
  }, [history, width, height]);

  return <svg ref={ref} className="w-full h-auto" aria-label="Running proportion of heads sparkline" />;
}

// ----- Main Simulator Component -----
export default function CoinFlipSimulator({
  initialHeads = 0,
  initialTails = 0,
  onChange,
  maxHistory = 5000,
  probabilityHeads = 0.5
}) {
  const [heads, setHeads] = useState(initialHeads);
  const [tails, setTails] = useState(initialTails);
  const [history, setHistory] = useState([]); // array of 'H' | 'T'
  const [customN, setCustomN] = useState(100);

  const total = heads + tails;
  const pH = total === 0 ? 0 : heads / total;
  const pT = total === 0 ? 0 : tails / total;

  // Central update routine
  const runFlips = useCallback(
    (n) => {
      if (n <= 0) return;
      let h = 0;
      for (let i = 0; i < n; i++) if (flipCoin(probabilityHeads) === "H") h += 1;
      const t = n - h;
      setHeads((prev) => prev + h);
      setTails((prev) => prev + t);
      setHistory((prev) => {
        const newOutcomes = Array.from({ length: n }, (_, i) => (i < h ? "H" : "T"));
        // The above doesn't preserve *order* of flips from random; fix: actually simulate order.
        // We'll do a proper order simulation below.
        return prev; // placeholder (will be replaced below in next effect) <-- replaced in improved version below
      });
    },
    []
  );

  /*  The above quick version aggregated counts but didn't store per-flip randomness properly.
      Let's override with a more accurate implementation in a dedicated function so we can push
      true per-flip outcomes & update counts incrementally.
  */
  const runFlipsAccurate = useCallback(
    (n) => {
      if (n <= 0) return;
      setHistory((prev) => {
        const newHist = [...prev];
        let addH = 0;
        let addT = 0;
        for (let i = 0; i < n; i++) {
          const r = flipCoin(probabilityHeads);
          newHist.push(r);
          if (r === "H") addH += 1; else addT += 1;
        }
        // truncate history if too long
        if (newHist.length > maxHistory) {
          newHist.splice(0, newHist.length - maxHistory);
        }
        // update counts AFTER building newHist
        setHeads((prev) => prev + addH);
        setTails((prev) => prev + addT);
        return newHist;
      });
    },
    [maxHistory]
  );

  // We'll expose a single wrapper that uses the accurate version.
  const flipOnce = useCallback(() => runFlipsAccurate(1), [runFlipsAccurate]);
  const flipMany = useCallback((n) => runFlipsAccurate(n), [runFlipsAccurate]);

  // Fire onChange callback
  useEffect(() => {
    if (onChange) onChange({ heads, tails, total, history });
  }, [heads, tails, total, history, onChange]);

  // Render
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 font-nunito">
      {/*<h2 className="text-lg font-bold">Coin Flip Simulator</h2>
      <p className="text-center text-sm text-slate-600 max-w-prose">
        Flip a fair coin repeatedly and watch the observed frequencies approach 50% each (Law of Large Numbers).
      </p>*/}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <button
          type="button"
          onClick={flipOnce}
          className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-semibold shadow-sm"
        >
          Lanzar una vez
        </button>
        <button
          type="button"
          onClick={() => flipMany(1000)}
          className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
        >
          Lanzar 1,000 veces
        </button>
        {/*<div className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            value={customN}
            onChange={(e) => setCustomN(Math.max(1, Number(e.target.value)))}
            className="w-20 px-1 py-0.5 border rounded text-xs text-center"
          />
          <button
            type="button"
            onClick={() => flipMany(customN)}
            className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 text-xs"
          >
            Flip N
          </button>
        </div>*/}
        <button
          type="button"
          onClick={() => {
            setHeads(0);
            setTails(0);
            setHistory([]);
          }}
          className="px-2 py-1 rounded border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs"
        >
          Reiniciar
        </button>
      </div>

      {/* Counts + probs */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-2 rounded border bg-white shadow-sm">
          <div className="font-bold">Cabeza</div>
          <div>{heads}</div>
          <div className="text-xs text-slate-500">{(pH * 100).toFixed(1)}%</div>
        </div>
        <div className="p-2 rounded border bg-white shadow-sm">
          <div className="font-bold">Escudo</div>
          <div>{tails}</div>
          <div className="text-xs text-slate-500">{(pT * 100).toFixed(1)}%</div>
        </div>
        <div className="p-2 rounded border bg-white shadow-sm">
          <div className="font-bold">Total</div>
          <div>{total}</div>
          <div className="text-xs text-slate-500">—</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="w-full p-4 border rounded bg-white shadow-sm">
        <CoinBarChart heads={heads} tails={tails} />
      </div>

      {/* Sparkline 
      <div className="w-full p-2 border rounded bg-white shadow-sm">
        <div className="text-[10px] text-slate-500 mb-1 text-center">Running proportion of Heads (line) vs 0.5 (dashed)</div>
        <ProportionSparkline history={history} />
      </div>*/}
    </div>
  );
}

/* -----------------------------
   Example usage:

   <CoinFlipSimulator />

   <CoinFlipSimulator
     initialHeads={0}
     initialTails={0}
     onChange={({heads, tails, total}) => console.log(heads, tails, total)}
   />
*/
