import { useState, useId, useCallback } from "react";

/**
 * MultipleChoiceExercise
 * -----------------------------------------------
 * Lightweight, accessible single‑select (radio‑style) multiple‑choice block.
 * Parent app supplies the prompt and an array of options. Component can be
 * used in controlled or uncontrolled mode.
 *
 * Props
 * ------
 * - prompt        : ReactNode | string – Question stem.
 * - options       : Array<{ id:string; label:ReactNode }>
 * - value         : string | null | undefined – Controlled selected id.
 * - defaultValue  : string | null – Initial selection when uncontrolled.
 * - onChange(id)  : callback fired when selection changes.
 * - disabled      : boolean – Locks interaction.
 * - showLetters   : boolean – Show A, B, C… badges.
 * - className     : string – Extra wrapper classes.
 *
 * Usage (controlled):
 * const [answer,setAnswer] = useState(null);
 * <MultipleChoiceExercise prompt="1 + 2 = ?" options={opts} value={answer} onChange={setAnswer} />
 */
export function MultipleChoiceExercise({
  prompt,
  options = [],
  value,
  defaultValue = null,
  onChange,
  disabled = false,
  showLetters = true,
  className = "",
}) {
  const groupId = useId();
  const isControlled = value !== undefined; // allow null as legit value
  const [internal, setInternal] = useState(defaultValue);
  const selected = isControlled ? value : internal;

  const handleSelect = useCallback(
    (id) => {
      if (disabled) return;
      if (!isControlled) setInternal(id);
      onChange?.(id);
    },
    [disabled, isControlled, onChange]
  );

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <div id={`${groupId}-label`} className="mb-4 text-lg font-semibold">
        {prompt}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-label`}
        className="flex flex-col gap-2"
      >
        {options.map((opt, i) => {
          const isSel = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSel}
              disabled={disabled}
              onClick={() => handleSelect(opt.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(opt.id);
                }
              }}
              className={[
                "w-full text-left border rounded-lg px-4 py-3 transition",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500",
                isSel ? "border-blue-600 bg-blue-50 ring-2 ring-blue-400" : "border-gray-300 bg-white",
              ].join(" ")}
            >
              <span className="flex items-start gap-3">
                {showLetters && (
                  <span
                    className={[
                      "inline-flex items-center justify-center w-6 h-6 rounded-full border text-sm font-bold",
                      isSel
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300",
                    ].join(" ")}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                )}
                <span>{opt.label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------
 * Simple demo / storybook helper
 * ------------------------------------------------- */
export function DemoMultipleChoiceExercise() {
  const [answer, setAnswer] = useState(null);
  const options = [
    { id: "opt1", label: "2" },
    { id: "opt2", label: "3" },
    { id: "opt3", label: "4" },
    { id: "opt4", label: "5" },
  ];

  return (
    <div className="p-4">
      <MultipleChoiceExercise
        prompt="¿Cuál es 1 + 2?"
        options={options}
        value={answer}
        onChange={setAnswer}
      />
      <div className="mt-4 text-sm text-gray-600">
        Seleccionaste: <strong>{answer ?? "(ninguna)"}</strong>
      </div>
    </div>
  );
}

/* -------------------------------------------------
 * Helper: shuffle options (optional utility)
 * ------------------------------------------------- */
export function shuffleOptions(opts) {
  return [...opts].sort(() => Math.random() - 0.5);
}
