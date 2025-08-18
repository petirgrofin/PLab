import { useState, useId, useCallback, useMemo, useEffect } from "react";
import { useComponentContext } from "../lessons/ComponentContext";

/**
 * MultiSelectExercise
 * ------------------------------------------------------
 * Accessible multi‑select (checkbox‑style) exercise block.
 * Lets learners select *all* options that satisfy a prompt.
 * Validation (checking correctness) is intentionally left to the parent.
 *
 * Supports text or image options. Layout automatically switches to a responsive
 * grid when any option has an image (imgSrc). Otherwise a vertical list.
 *
 * Props ------------------------------------------------
 * - prompt          : ReactNode | string – Question stem.
 * - options         : Array<Option>
 *                     type Option = {
 *                       id: string;
 *                       label?: ReactNode;     // text / math / JSX
 *                       imgSrc?: string;       // optional image URL
 *                       imgAlt?: string;       // required if imgSrc provided
 *                     }
 * - value           : string[] | undefined – Controlled selected ids.
 * - defaultValue    : string[] – Initial selection (uncontrolled).
 * - disabled        : boolean – Lock interaction.
 * - onChange(ids)   : callback fired with *new* selected id array.
 * - showLetters     : boolean – Show A, B, C… badges.
 * - minSelections   : number | undefined – UI hint only (not enforced unless enforceSelectionCount=true)
 * - maxSelections   : number | undefined – UI hint only (same as above)
 * - enforceSelectionCount : boolean – If true, prevents exceeding maxSelections.
 * - className       : string – Extra wrapper classes.
 *
 * Accessibility notes ----------------------------------
 * We expose role="group" + individual role="checkbox" elements (buttons) w/
 * aria-checked. Screen readers announce each selectable choice.
 * Keyboard: Enter / Space toggles.
 */
export function MultiSelectExercise({
  prompt,
  options = [],
  value,
  defaultValue = [],
  disabled = false,
  onChange,
  showLetters = true,
  minSelections,
  maxSelections,
  enforceSelectionCount = false,
  className = "",
}) {
  const groupId = useId();
  const isControlled = value !== undefined; // allow empty array
  const [internal, setInternal] = useState(defaultValue);
  const selected = isControlled ? value : internal;

  const hasImages = useMemo(() => options.some((o) => !!o.imgSrc), [options]);

  const canSelectMore = (id) => {
    if (!enforceSelectionCount || maxSelections === undefined) return true;
    if (selected.includes(id)) return true; // toggling off is always allowed
    return selected.length < maxSelections;
  };

  const toggle = useCallback(
    (id) => {
      if (disabled) return;
      if (!canSelectMore(id)) return;
      let next;
      if (selected.includes(id)) {
        next = selected.filter((x) => x !== id);
      } else {
        next = [...selected, id];
      }
      if (!isControlled) setInternal(next);
      onChange?.(next);;
    },
    [disabled, selected, isControlled, onChange]
  );

  const selectionHint = useMemo(() => {
    if (minSelections === undefined && maxSelections === undefined) return null;
    const parts = [];
    if (minSelections !== undefined) parts.push(`al menos ${minSelections}`);
    if (maxSelections !== undefined) parts.push(`máximo ${maxSelections}`);
    return parts.length ? `Selecciona ${parts.join(", ")}.` : null;
  }, [minSelections, maxSelections]);

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <div id={`${groupId}-label`} className="mb-4 text-lg font-semibold">
        {prompt}
      </div>
      {selectionHint && (
        <p className="mb-2 text-sm text-gray-600">{selectionHint}</p>
      )}
      <div
        role="group"
        aria-labelledby={`${groupId}-label`}
        className={hasImages ? "grid grid-cols-2 sm:grid-cols-4 gap-4" : "flex flex-col gap-2"}
      >
        {options.map((opt, i) => {
          const isSel = selected.includes(opt.id);
          const blocked = !canSelectMore(opt.id) && !isSel;
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={isSel}
              aria-disabled={disabled || blocked}
              disabled={disabled || blocked}
              onClick={() => toggle(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(opt.id);
                }
              }}
              className={[
                "relative w-full text-left border rounded-lg px-4 py-3 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                disabled || blocked
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-blue-500",
                isSel
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-400"
                  : "border-gray-300 bg-white",
                hasImages ? "h-32 flex flex-col items-center justify-center" : "",
              ].join(" ")}
            >
              <span className="flex items-start gap-3 w-full h-full">
                {showLetters && !hasImages && (
                  <span
                    className={[
                      "inline-flex items-center justify-center w-6 h-6 rounded-full border text-sm font-bold shrink-0",
                      isSel
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                )}
                {opt.imgSrc ? (
                  <span className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <img
                      src={opt.imgSrc}
                      alt={opt.imgAlt ?? "opción"}
                      className="max-h-20 object-contain"
                    />
                    {opt.label && (
                      <span className="text-sm leading-tight text-center w-full">
                        {opt.label}
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{opt.label}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------
 * Demo / Storybook helper w/ text‑only options
 * ------------------------------------------------------ */
export function DemoMultiSelectTextQ() {
  const [selected, setSelected] = useState([]);
  const { setExerciseResponse } = useComponentContext();
  
  useEffect(() => {
    setExerciseResponse({multiSelect: true, id: "Q", response: selected});
  }, [selected]);
  
  const options = [
    { id: "A", label: "Cristal rojo" },
    { id: "B", label: "Cristal rojo 2" },
    { id: "C", label: "Cristal azul" },
    { id: "D", label: "Cristal verde" },
  ];
  return (
    <div className="p-4">
      <MultiSelectExercise
        prompt="Selecciona todas las opciones que cumplan la condición (ejemplo)."
        options={options}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}

export function DemoMultiSelectTextR() {
  const [selected, setSelected] = useState([]);
  const { setExerciseResponse } = useComponentContext();
  
  useEffect(() => {
    setExerciseResponse({multiSelect: true, id: "R", response: selected});
  }, [selected]);

  const options = [
    { id: "A", label: "Cristal morado 2" },
    { id: "B", label: "Cristal morado" },
    { id: "C", label: "Cristal azul" },
    { id: "D", label: "Cristal verde" },
  ];
  return (
    <div className="p-4">
      <MultiSelectExercise
        prompt="Selecciona todas las opciones que cumplan la condición (ejemplo)."
        options={options}
        value={selected}
        onChange={setSelected}
      />
      <div className="mt-4 text-sm text-gray-600">
        Seleccionadas: <strong>{selected.join(", ") || "(ninguna)"}</strong>
      </div>
    </div>
  );
}

/* ------------------------------------------------------
 * Demo / Storybook helper w/ image options
 * ------------------------------------------------------ */

export function DemoMultiSelectImages({ srcs, id }) {
  const [selected, setSelected] = useState([]);
  const { setExerciseResponse } = useComponentContext();

  // Expect srcs to be an array of 4 image URLs (or more if you add options)
  const options = [
    { id: "A", label: "A", imgSrc: srcs[0], imgAlt: "Opción A" },
    { id: "B", label: "B", imgSrc: srcs[1], imgAlt: "Opción B" },
    { id: "C", label: "C", imgSrc: srcs[2], imgAlt: "Opción C" },
    { id: "D", label: "D", imgSrc: srcs[3], imgAlt: "Opción D" },
  ];

  useEffect(() => {
    setExerciseResponse({multiSelect: true, id: id, response: selected});
  }, [selected]);

  return (
    <div className="p-4">
      <MultiSelectExercise
        prompt="Selecciona todas las imágenes que cumplen la condición"
        options={options}
        value={selected}
        onChange={setSelected}
        showLetters={false} // image grid already labeled
      />
      <div className="mt-4 text-sm text-gray-600">
        Seleccionadas: <strong>{selected.join(", ") || "(ninguna)"}</strong>
      </div>
    </div>
  );
}

/* ------------------------------------------------------
 * Helper: compute correctness (optional)
 * ------------------------------------------------------ */
export function checkMultiSelectCorrect(selectedIds, correctIds) {
  // Returns {isCorrect:boolean, missing:string[], extra:string[]}
  const selectedSet = new Set(selectedIds);
  const correctSet = new Set(correctIds);
  const missing = [...correctSet].filter((id) => !selectedSet.has(id));
  const extra = [...selectedSet].filter((id) => !correctSet.has(id));
  const isCorrect = missing.length === 0 && extra.length === 0;
  return { isCorrect, missing, extra };
}
