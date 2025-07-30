import { useState } from "react";

export default function DiceRoller() {

  return (
    <div className="flex flex-col items-center space-y-2">
        <img
          src="/dado-rotando.gif"
          alt="Rolling dice"
          className="size-64 object-contain"
        />
    </div>
  );
}

