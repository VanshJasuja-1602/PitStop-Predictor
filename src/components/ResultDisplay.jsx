import React from "react";
import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, Gauge, ShieldAlert, Zap } from "lucide-react";

export default function ResultDisplay({ result, inputs }) {
  if (!result) return null;

  const { prediction, confidence, calculatedMetrics } = result;

  // Destructure telemetry inputs for rendering in diagnostics
  const tyreLife = inputs.TyreLife;
  const targetLife = inputs.TyreLifePerStint || 30;
  const lifePercentage = Math.min(100, Math.max(0, (tyreLife / targetLife) * 100));
  const compound = inputs.Compound || "SOFT";
  const stress = inputs.TyreStress || 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full rounded-3xl p-6 md:p-8 border relative overflow-hidden ${
        prediction === 1
          ? "bg-red-950/20 border-ferrari-red/30 shadow-[0_0_40px_rgba(225,6,0,0.15)]"
          : "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
      }`}
    >
      {/* HUD borders */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-zinc-700" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-700" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-zinc-700" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-zinc-700" />

      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6 text-xs font-mono text-zinc-500 uppercase tracking-widest">
        <span>PREDICTION ENGINE RESULT</span>
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-mclaren-orange" />
          DECISION CODE: F1-{prediction === 1 ? "PIT-1" : "STAY-0"}
        </span>
      </div>

      {/* Main Verdict */}
      <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
          {prediction === 1 ? (
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="p-4 rounded-full bg-ferrari-red/10 border border-ferrari-red/40 text-ferrari-red shadow-[0_0_20px_rgba(225,6,0,0.3)]"
            >
              <AlertOctagon className="w-10 h-10" />
            </motion.div>
          ) : (
            <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          )}

          <div>
            <h3
              className={`text-2xl font-display font-black uppercase tracking-wider ${
                prediction === 1 ? "text-ferrari-red glow-text-red" : "text-emerald-400 glow-text-green"
              }`}
            >
              {prediction === 1 ? "PIT STOP EXPECTED" : "NO PIT STOP EXPECTED"}
            </h3>
            <p className="text-zinc-400 text-sm font-sans font-light mt-1 max-w-md">
              {prediction === 1
                ? "Machine Learning telemetry indicates critical tyre wear or a high risk drop-off. Prepare the pit crew for tyre swap."
                : "Tyre telemetry and race delta indicators remain within acceptable strategic envelopes. Continue stint."}
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex flex-col items-center justify-center bg-zinc-950/80 px-6 py-5 rounded-2xl border border-zinc-800 shadow-inner w-full lg:w-auto min-w-[200px]">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
            PREDICTION CONFIDENCE
          </div>
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-zinc-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                className={`transition-all duration-1000 ${
                  prediction === 1 ? "stroke-ferrari-red" : "stroke-emerald-400"
                }`}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={2 * Math.PI * 38 * (1 - confidence)}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xl font-display font-black text-white">
                {(confidence * 100).toFixed(0)}%
              </span>
              <span className="block text-[8px] font-mono text-zinc-500 uppercase">
                Accuracy Index
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Diagnostic metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-zinc-800">
        {/* Metric 1: Tyre Degradation Level */}
        <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span>Tyre Wear Index</span>
            <span className={prediction === 1 ? "text-ferrari-red" : "text-emerald-400"}>
              {lifePercentage.toFixed(0)}% Capacity Used
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                prediction === 1 ? "bg-ferrari-red shadow-[0_0_10px_#e10600]" : "bg-emerald-400"
              }`}
              style={{ width: `${lifePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-2">
            <span>Laps: {tyreLife}</span>
            <span>Target Max: {targetLife}</span>
          </div>
        </div>

        {/* Metric 2: Thermal Stress */}
        <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span>Thermal Strain</span>
            <span className={stress > 75 ? "text-mclaren-orange" : "text-electric-blue"}>
              {stress.toFixed(1)}% Stress
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                stress > 75 ? "bg-mclaren-orange" : "bg-electric-blue"
              }`}
              style={{ width: `${stress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-500 mt-2">
            <span>Core Temp: NORMAL</span>
            <span>Surface: {stress > 80 ? "HIGH" : "OPTIMAL"}</span>
          </div>
        </div>

        {/* Metric 3: Strategy Recommendation */}
        <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
            <span>Race Engineer Verdict</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert className="w-4 h-4 text-mclaren-orange shrink-0" />
            <span className="text-xs font-mono font-medium">
              {prediction === 1
                ? `Box this lap. Fit new ${compound === "SOFT" ? "MEDIUM" : "HARD"} set.`
                : "Stay out. Focus on management & delta targets."}
            </span>
          </div>
          <div className="text-[9px] text-zinc-500 font-mono mt-2">
            DECISION ENGINE CALCULATION IN 0.082s
          </div>
        </div>
      </div>
    </motion.div>
  );
}
