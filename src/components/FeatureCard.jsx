import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ title, description, icon: Icon, accentColor }) {
  // Map our custom accent colors to their respective Tailwind classes for glows/borders
  const accentStyles = {
    red: {
      border: "hover:border-ferrari-red/50",
      bgGlow: "group-hover:bg-ferrari-red/10",
      textGlow: "glow-text-red",
      iconColor: "text-ferrari-red",
    },
    orange: {
      border: "hover:border-mclaren-orange/50",
      bgGlow: "group-hover:bg-mclaren-orange/10",
      textGlow: "glow-text-orange",
      iconColor: "text-mclaren-orange",
    },
    blue: {
      border: "hover:border-electric-blue/50",
      bgGlow: "group-hover:bg-electric-blue/10",
      textGlow: "glow-text-blue",
      iconColor: "text-electric-blue",
    },
    yellow: {
      border: "hover:border-neon-yellow/50",
      bgGlow: "group-hover:bg-neon-yellow/10",
      textGlow: "glow-text-yellow",
      iconColor: "text-neon-yellow",
    },
  };

  const style = accentStyles[accentColor] || accentStyles.red;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative p-6 rounded-2xl glass-panel border border-white/5 overflow-hidden transition-all duration-300 ${style.border}`}
    >
      {/* Dynamic background glow */}
      <div
        className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-500 opacity-20 group-hover:opacity-60 ${style.bgGlow}`}
      />

      {/* Decorative track lines */}
      <div className="absolute right-0 bottom-0 w-24 h-24 border-r border-b border-white/5 group-hover:border-white/10 rounded-br-2xl transition-colors duration-300 pointer-events-none" />

      {/* Card Header with Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-300 ${style.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-900">
          Telemetry Active
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-display font-bold text-white mb-2 uppercase tracking-wide group-hover:text-white transition-colors duration-200">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed font-sans font-light">
        {description}
      </p>

      {/* Bottom telemetry detail */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>STRAT_MOD: V2.6</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-ping" />
          CALIBRATED
        </span>
      </div>
    </motion.div>
  );
}
