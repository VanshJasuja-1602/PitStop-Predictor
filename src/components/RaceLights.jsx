import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RaceLights({ isActive, onSequenceComplete }) {
  const [lightsCount, setLightsCount] = useState(0);
  const [lightsOut, setLightsOut] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setLightsCount(0);
      setLightsOut(false);
      return;
    }

    setLightsOut(false);
    setLightsCount(0);

    // Sequence to turn on lights 1 to 5
    const intervals = [];
    for (let i = 1; i <= 5; i++) {
      const timer = setTimeout(() => {
        setLightsCount(i);
      }, i * 600); // Turn on next light every 600ms
      intervals.push(timer);
    }

    // Hold all 5 lights on, then turn them off (lights out)
    const holdTimer = setTimeout(() => {
      setLightsOut(true);
      // Wait another 300ms of "green light/all out" before triggering prediction
      const completeTimer = setTimeout(() => {
        onSequenceComplete();
      }, 400);
      intervals.push(completeTimer);
    }, 5 * 600 + 800); // 5 lights + 800ms hold

    intervals.push(holdTimer);

    return () => {
      intervals.forEach((timer) => clearTimeout(timer));
    };
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-red-500/20 max-w-md mx-auto my-4 relative overflow-hidden">
      {/* Telemetry labels */}
      <div className="flex justify-between w-full text-xs font-mono text-zinc-500 mb-4 uppercase tracking-wider">
        <span>STRY SYSTEM: STBY</span>
        <span>SYS STATUS: {isActive ? "LIGHTS ON GRID" : "READY"}</span>
      </div>

      {/* Grid lights structure */}
      <div className="flex items-center gap-4 bg-zinc-950/80 px-6 py-4 rounded-xl border border-zinc-800 shadow-inner">
        {[1, 2, 3, 4, 5].map((lightIndex) => {
          const isOn = lightsCount >= lightIndex && !lightsOut;
          return (
            <div key={lightIndex} className="flex flex-col items-center gap-1">
              {/* Top two red bulb elements per F1 light pillar */}
              <div className="flex gap-1">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isOn
                      ? "bg-red-600 shadow-[0_0_15px_#e10600,inset_0_0_4px_#ffffff]"
                      : "bg-zinc-900 border border-zinc-800"
                  }`}
                />
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isOn
                      ? "bg-red-600 shadow-[0_0_15px_#e10600,inset_0_0_4px_#ffffff]"
                      : "bg-zinc-900 border border-zinc-800"
                  }`}
                />
              </div>
              <div className="flex gap-1">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isOn
                      ? "bg-red-600 shadow-[0_0_15px_#e10600,inset_0_0_4px_#ffffff]"
                      : "bg-zinc-900 border border-zinc-800"
                  }`}
                />
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isOn
                      ? "bg-red-600 shadow-[0_0_15px_#e10600,inset_0_0_4px_#ffffff]"
                      : "bg-zinc-900 border border-zinc-800"
                  }`}
                />
              </div>
              {/* Supporting bracket */}
              <div className="w-1.5 h-4 bg-zinc-800" />
            </div>
          );
        })}
      </div>

      {/* Grid status label */}
      <div className="mt-4 text-center">
        {isActive ? (
          lightsOut ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              className="text-emerald-400 font-display font-bold tracking-widest text-lg glow-text-green"
            >
              LIGHTS OUT! PIT PREDICTION INITIATED
            </motion.div>
          ) : (
            <div className="text-red-500 font-display font-semibold tracking-widest text-sm animate-pulse">
              PRE-STAGE: LIGHTS ENGAGING ({lightsCount}/5)
            </div>
          )
        ) : (
          <div className="text-zinc-400 font-display font-medium text-xs tracking-widest uppercase">
            STAGED FOR RACE SEQUENCE
          </div>
        )}
      </div>

      {/* Decorative HUD corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-700" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-700" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700" />
    </div>
  );
}
