import React, { useState, useMemo, useCallback } from "react";

/*
  DiceSampleSpaceSelector
  -----------------------
  Interactive 6×6 grid representing the sample space for rolling a fair die twice.
  Each cell corresponds to the ordered pair (d1, d2) where d1 is the result of the *first* roll (row)
  and d2 is the result of the *second* roll (column).

  Students can **click cells to toggle selection** in order to mark the outcomes that belong to an event.
  For example: select all cells whose sum is > 9 (i.e., {(4,6),(5,5),(5,6),(6,4),(6,5),(6,6)}).

  This component is intentionally **agnostic about correctness**. It simply reports which cells are selected.
  Your parent component / exercise logic can evaluate correctness once the learner submits.

  Props
  -----
  - onSubmit(selected)  -> callback receiving an array of { d1:number, d2:number }.
  - onChange(selected)  -> called every time the selection changes.
  - showSums (bool)     -> if true, each cell shows the sum in addition to the ordered pair. default: false.
  - compact (bool)      -> more compact visual (smaller cells, hides ordered pair text). default: false.
  - initialSelected     -> array of {d1,d2} to pre-select (e.g., to restore state or show a teacher demo).

  Styling
  -------
  TailwindCSS utility classes are used. Adjust the --cell-size CSS variable via the wrapper class if desired.
*/

const DICE_VALUES = [1, 2, 3, 4, 5, 6];

function keyFor(d1, d2) {
  return `${d1}-${d2}`;
}

export default function DiceSampleSpaceSelector({
  onSubmit,
  onChange,
  showSums = false,
  compact = false,
  initialSelected = [],
}) {
  const [selected, setSelected] = useState(() => {
    const s = new Set();
    initialSelected.forEach(({ d1, d2 }) => s.add(keyFor(d1, d2)));
    return s;
  });

  // local toggle for showing sums (user UI control)
  const [showSumsLocal, setShowSumsLocal] = useState(showSums);

  const toggle = useCallback((d1, d2) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const k = keyFor(d1, d2);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }, []);

  // Fire onChange when selection changes.
  const selectedArray = useMemo(() => {
    const arr = [];
    selected.forEach((k) => {
      const [d1, d2] = k.split("-").map(Number);
      arr.push({ d1, d2 });
    });
    return arr.sort((a, b) => (a.d1 - b.d1) || (a.d2 - b.d2));
  }, [selected]);

  React.useEffect(() => {
    if (onChange) onChange(selectedArray);
  }, [selectedArray, onChange]);

  const handleSubmit = useCallback(() => {
    if (onSubmit) onSubmit(selectedArray);
    else console.log("DiceSampleSpaceSelector submit:", selectedArray);
  }, [onSubmit, selectedArray]);

  const cellBase = compact ? "w-8 h-8 text-[10px]" : "w-10 h-10 text-xs";
  const cellSelected = "bg-indigo-300 border-indigo-600 text-indigo-900 font-bold";
  const cellUnselected = "bg-white hover:bg-indigo-50 border-slate-300";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 font-nunito">
      {/* Controls / instructions */}
      <p className="text-center text-sm text-slate-600 max-w-prose">
        Click cells to select outcomes that belong to an event. Row = first die, Column = second die.
      </p>
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            className="accent-indigo-600"
            checked={showSumsLocal}
            onChange={(e) => setShowSumsLocal(e.target.checked)}
          />
          Show sums
        </label>
      </div>

      {/* Grid wrapper */}
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              {/* corner empty cell */}
              <th className="p-1 text-[10px] text-slate-500"></th>
              {DICE_VALUES.map((d2) => (
                <th key={`h-${d2}`} className="p-1 text-[10px] text-slate-500 font-normal">
                  {d2}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DICE_VALUES.map((d1) => (
              <tr key={`r-${d1}`}> 
                {/* Row header */}
                <th className="p-1 text-[10px] text-slate-500 font-normal">{d1}</th>
                {DICE_VALUES.map((d2) => {
                  const k = keyFor(d1, d2);
                  const isSel = selected.has(k);
                  const sum = d1 + d2;
                  return (
                    <td key={k} className="p-0">
                      <button
                        type="button"
                        aria-pressed={isSel}
                        onClick={() => toggle(d1, d2)}
                        className={`m-0 ${cellBase} flex flex-col items-center justify-center border rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 ${
                          isSel ? cellSelected : cellUnselected
                        }`}
                      >
                        {compact ? (
                          sum
                        ) : (
                          <>
                            <span>{`(${d1},${d2})`}</span>
                            {showSumsLocal && <span className="text-[10px] opacity-80">{sum}</span>}
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary + actions */}
      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setSelected(new Set())}
          className="px-2 py-1 rounded border border-slate-300 hover:bg-slate-100 text-xs"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs"
        >
          Submit Selection
        </button>
      </div>
    </div>
  );
}

/* -----------------------------
   Example usage / teacher demo:

   <DiceSampleSpaceSelector
     showSums={false}
     onSubmit={(sel) => console.log('Selected outcomes:', sel)}
   />

   // Preselect all outcomes with sum > 9:
   const sumGt9 = [];
   for (let d1=1; d1<=6; d1++) {
     for (let d2=1; d2<=6; d2++) {
       if (d1 + d2 > 9) sumGt9.push({d1,d2});
     }
   }
   <DiceSampleSpaceSelector initialSelected={sumGt9} showSums />
*/
