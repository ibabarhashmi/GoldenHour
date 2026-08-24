"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../lib/use-t";

function fmt(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

/** Judge-facing stopwatch for the /compare page. */
export function Stopwatch() {
  const { t } = useT();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      setElapsed(Date.now() - startRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p
        suppressHydrationWarning
        className="tnum min-w-44 rounded-sm bg-ink px-4 py-2 font-data text-4xl text-clinical"
        role="timer"
      >
        {fmt(elapsed)}
      </p>
      <button
        type="button"
        onClick={() => {
          if (running) {
            setRunning(false);
          } else {
            startRef.current = Date.now() - elapsed;
            setRunning(true);
          }
        }}
        className="h-12 rounded-sm bg-stable px-5 text-sm font-semibold text-white hover:bg-[#115733]"
      >
        {running ? t("compare.timer.stop") : t("compare.timer.start")}
      </button>
      <button
        type="button"
        onClick={() => {
          setRunning(false);
          setElapsed(0);
        }}
        className="gh-btn gh-btn-outline h-12 px-5 text-sm"
      >
        {t("compare.timer.reset")}
      </button>
    </div>
  );
}
