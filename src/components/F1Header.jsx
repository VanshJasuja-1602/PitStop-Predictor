import React, { useState, useEffect } from "react";
import { Cpu, Wifi, WifiOff } from "lucide-react";

export default function F1Header({ isLiveMode, scrollToSection }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      const formatDigit = (num) => String(num).padStart(2, "0");
      const hours = formatDigit(date.getHours());
      const minutes = formatDigit(date.getMinutes());
      const seconds = formatDigit(date.getSeconds());
      const ms = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}.${ms}`);
    };
    const timer = setInterval(updateTime, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-ferrari-red to-mclaren-orange flex items-center justify-center font-display font-extrabold text-white text-base italic shadow-md shadow-ferrari-red/30">
            F1
          </div>
          <div>
            <h1 className="text-xl font-display font-black tracking-wider uppercase flex items-center gap-2">
              PITSTOP <span className="text-ferrari-red glow-text-red">PREDICTOR</span>
            </h1>
            <p className="text-[9px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
              Predictive Performance Analytics
            </p>
          </div>
        </div>

        {/* Live Telemetry Bar */}
        <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-zinc-950/80 rounded border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-zinc-500 uppercase">TRACK:</span>
            <span className="text-white font-medium">MONZA v20.26</span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div>
            <span className="text-zinc-500">TRACK TEMP:</span>{" "}
            <span className="text-mclaren-orange">42.8°C</span>
          </div>
          <div className="h-3 w-px bg-zinc-800" />
          <div>
            <span className="text-zinc-500">SESSION TIME:</span>{" "}
            <span className="text-electric-blue font-telemetry">{time}</span>
          </div>
        </div>

        {/* Navigation and Mode Badge */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <button
              onClick={() => scrollToSection("hero")}
              className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              Grid
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              Telemetry
            </button>
            <button
              onClick={() => scrollToSection("predict")}
              className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              Predictor
            </button>
            <button
              onClick={() => scrollToSection("model")}
              className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              Analytics
            </button>
          </nav>

          {/* Connection status */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border ${
              isLiveMode
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isLiveMode ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>DATABRICKS LIVE</span>
              </>
            ) : (
              <>
                <Cpu className="w-3 h-3 animate-pulse" />
                <span>TELEMETRY SIM</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
