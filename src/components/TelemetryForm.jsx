import React, { useState } from "react";
import {
  User,
  MapPin,
  Disc,
  Clock,
  Calendar,
  RotateCcw,
  Gauge,
  TrendingDown,
  Activity,
  AlertTriangle,
  ChevronDown,
  Sliders,
  Sparkles
} from "lucide-react";

// Presets data for quick telemetry filling
const TELEMETRY_PRESETS = [
  {
    name: "Monza Soft Sprint (Pitting Next)",
    data: {
      Driver: "Max Verstappen",
      Race: "Italian GP (Monza)",
      Compound: "SOFT",
      LapNumber: 22,
      Stint: 1,
      TyreLife: 21,
      Position: 1,
      LapTime: 82.5,
      Year: 2026,
      LapTime_Delta: 1.45,
      Cumulative_Degradation: 68.2,
      PitStop: 0,
      RaceProgress: 0.42,
      Normalized_TyreLife: 0.84,
      Position_Change: 0,
      TyreStress: 88.5,
      PerformanceDrop: 1.85,
      PositionRisk: 15.0,
      TyreLifePerStint: 25
    }
  },
  {
    name: "Monaco Hard Marathon (No Pit)",
    data: {
      Driver: "Lewis Hamilton",
      Race: "Monaco GP",
      Compound: "HARD",
      LapNumber: 42,
      Stint: 1,
      TyreLife: 18,
      Position: 4,
      LapTime: 75.8,
      Year: 2026,
      LapTime_Delta: 0.12,
      Cumulative_Degradation: 22.4,
      PitStop: 0,
      RaceProgress: 0.54,
      Normalized_TyreLife: 0.36,
      Position_Change: 2,
      TyreStress: 42.0,
      PerformanceDrop: 0.25,
      PositionRisk: 30.0,
      TyreLifePerStint: 50
    }
  },
  {
    name: "Silverstone Medium Stint (Degrading)",
    data: {
      Driver: "Lando Norris",
      Race: "British GP (Silverstone)",
      Compound: "MEDIUM",
      LapNumber: 18,
      Stint: 1,
      TyreLife: 17,
      Position: 2,
      LapTime: 91.2,
      Year: 2026,
      LapTime_Delta: 0.85,
      Cumulative_Degradation: 48.9,
      PitStop: 0,
      RaceProgress: 0.35,
      Normalized_TyreLife: 0.56,
      Position_Change: -1,
      TyreStress: 65.0,
      PerformanceDrop: 0.95,
      PositionRisk: 45.0,
      TyreLifePerStint: 30
    }
  },
  {
    name: "Spa Rain Cross-over (Pitting Next)",
    data: {
      Driver: "Charles Leclerc",
      Race: "Belgian GP (Spa)",
      Compound: "WET",
      LapNumber: 12,
      Stint: 1,
      TyreLife: 11,
      Position: 3,
      LapTime: 114.6,
      Year: 2026,
      LapTime_Delta: 3.2,
      Cumulative_Degradation: 75.0,
      PitStop: 0,
      RaceProgress: 0.27,
      Normalized_TyreLife: 0.73,
      Position_Change: 0,
      TyreStress: 90.0,
      PerformanceDrop: 3.4,
      PositionRisk: 50.0,
      TyreLifePerStint: 15
    }
  }
];

export default function TelemetryForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    Driver: "Max Verstappen",
    Race: "Italian GP (Monza)",
    Compound: "SOFT",
    LapNumber: 22,
    Stint: 1,
    TyreLife: 21,
    Position: 1,
    LapTime: 82.5,
    Year: 2026,
    LapTime_Delta: 1.45,
    Cumulative_Degradation: 68.2,
    PitStop: 0,
    RaceProgress: 0.42,
    Normalized_TyreLife: 0.84,
    Position_Change: 0,
    TyreStress: 88.5,
    PerformanceDrop: 1.85,
    PositionRisk: 15.0,
    TyreLifePerStint: 25
  });

  const [errors, setErrors] = useState({});

  const drivers = [
    "Max Verstappen",
    "Lewis Hamilton",
    "Lando Norris",
    "Charles Leclerc",
    "Oscar Piastri",
    "Carlos Sainz",
    "George Russell",
    "Fernando Alonso",
    "Sergio Perez",
    "Pierre Gasly",
    "Esteban Ocon",
    "Alex Albon",
    "Yuki Tsunoda font"
  ];

  const races = [
    "Italian GP (Monza)",
    "Monaco GP",
    "British GP (Silverstone)",
    "Belgian GP (Spa)",
    "Japanese GP (Suzuka)",
    "Singapore GP",
    "United States GP (Austin)",
    "Abu Dhabi GP",
    "Bahrain GP",
    "Spanish GP"
  ];

  const compounds = ["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"];

  const handlePresetSelect = (preset) => {
    setForm(preset.data);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Numerical conversion
    if (e.target.type === "number" || name === "Stint" || name === "LapNumber" || name === "TyreLife" || name === "Position" || name === "PitStop" || name === "Year" || name === "TyreLifePerStint") {
      finalValue = value === "" ? "" : parseFloat(value);
    } else if (name === "LapTime_Delta" || name === "Cumulative_Degradation" || name === "RaceProgress" || name === "Normalized_TyreLife" || name === "Position_Change" || name === "TyreStress" || name === "PerformanceDrop" || name === "PositionRisk" || name === "LapTime") {
      finalValue = value === "" ? "" : parseFloat(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: finalValue
    }));

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Ensure positive numbers for key telemetry metrics
    if (form.LapNumber < 1) newErrors.LapNumber = "Must be > 0";
    if (form.TyreLife < 0) newErrors.TyreLife = "Cannot be negative";
    if (form.Position < 1 || form.Position > 20) newErrors.Position = "Must be 1-20";
    if (form.LapTime <= 0) newErrors.LapTime = "Must be > 0";
    if (form.Year < 2000) newErrors.Year = "Invalid year";
    if (form.RaceProgress < 0 || form.RaceProgress > 1) newErrors.RaceProgress = "Progress scale is 0 to 1";
    if (form.Normalized_TyreLife < 0 || form.Normalized_TyreLife > 1) newErrors.Normalized_TyreLife = "Life scale is 0 to 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  // Color mappings for F1 tyre labels
  const getTyreColorClass = (comp) => {
    switch (comp) {
      case "SOFT":
        return "border-ferrari-red text-ferrari-red bg-ferrari-red/5 shadow-[0_0_10px_rgba(225,6,0,0.15)]";
      case "MEDIUM":
        return "border-neon-yellow text-neon-yellow bg-neon-yellow/5 shadow-[0_0_10px_rgba(249,255,0,0.15)]";
      case "HARD":
        return "border-white text-white bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.15)]";
      case "INTERMEDIATE":
        return "border-emerald-500 text-emerald-500 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      case "WET":
        return "border-electric-blue text-electric-blue bg-electric-blue/5 shadow-[0_0_10px_rgba(0,207,255,0.15)]";
      default:
        return "border-zinc-700 text-zinc-400";
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
      {/* Decorative top tech header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-ferrari-red" />
          <h2 className="text-lg font-display font-bold uppercase tracking-wider text-white">
            TELEMETRY INGESTION PANEL
          </h2>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 uppercase">
          SECURE CONNECTION // DATABRICKS READY
        </div>
      </div>

      {/* Quick Presets Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-mclaren-orange" />
          <span>Select Race Strategy Preset:</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TELEMETRY_PRESETS.map((preset, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="px-3 py-2 rounded-xl text-left bg-zinc-950/60 border border-zinc-800/80 hover:border-mclaren-orange/50 hover:bg-zinc-900 transition-all text-[11px] font-mono text-zinc-300 truncate"
            >
              <div className="font-semibold text-zinc-400 text-[10px] uppercase truncate">
                Preset {index + 1}
              </div>
              <div className="truncate text-white font-medium">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: DRIVER & RACE PROFILE */}
        <div>
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-ferrari-red rounded-full" />
            01. Driver & Race Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Driver */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <User className="w-4 h-4" />
              </div>
              <select
                name="Driver"
                value={form.Driver}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium transition-all focus:border-ferrari-red appearance-none cursor-pointer"
              >
                {drivers.map((d) => (
                  <option key={d} value={d} className="bg-zinc-950 text-white">
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
                <ChevronDown className="w-4 h-4" />
              </div>
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Driver Profile
              </label>
            </div>

            {/* Race */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                name="Race"
                value={form.Race}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium transition-all focus:border-ferrari-red appearance-none cursor-pointer"
              >
                {races.map((r) => (
                  <option key={r} value={r} className="bg-zinc-950 text-white">
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-500">
                <ChevronDown className="w-4 h-4" />
              </div>
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Race Circuit
              </label>
            </div>

            {/* Year */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="Year"
                value={form.Year}
                onChange={handleChange}
                min="2000"
                max="2100"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Race Year
              </label>
              {errors.Year && <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.Year}</span>}
            </div>

            {/* Position */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Gauge className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="Position"
                value={form.Position}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Current Position
              </label>
              {errors.Position && <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.Position}</span>}
            </div>

            {/* Position Change */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Sliders className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="Position_Change"
                value={form.Position_Change}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Position Change (Delta)
              </label>
            </div>

            {/* Position Risk */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="PositionRisk"
                value={form.PositionRisk}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Position Risk (%)
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: TYRE ANALYTICS */}
        <div>
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-mclaren-orange rounded-full" />
            02. Tyre & Compound Telemetry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Compound */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Disc className="w-4 h-4" />
              </div>
              <select
                name="Compound"
                value={form.Compound}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 bg-zinc-950/80 rounded-xl border text-sm font-semibold transition-all appearance-none cursor-pointer ${getTyreColorClass(
                  form.Compound
                )}`}
              >
                {compounds.map((c) => (
                  <option key={c} value={c} className="bg-zinc-950 text-white">
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </div>
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Tyre Compound
              </label>
            </div>

            {/* Tyre Life */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="TyreLife"
                value={form.TyreLife}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Tyre Life (Laps Run)
              </label>
              {errors.TyreLife && <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.TyreLife}</span>}
            </div>

            {/* Normalized Tyre Life */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Sliders className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                name="Normalized_TyreLife"
                value={form.Normalized_TyreLife}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Normalized Tyre Life (0-1)
              </label>
              {errors.Normalized_TyreLife && (
                <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.Normalized_TyreLife}</span>
              )}
            </div>

            {/* Tyre Life Per Stint */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="TyreLifePerStint"
                value={form.TyreLifePerStint}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Stint Target Lap Capacity
              </label>
            </div>

            {/* Cumulative Degradation */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <TrendingDown className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.1"
                name="Cumulative_Degradation"
                value={form.Cumulative_Degradation}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Cumulative Degradation (%)
              </label>
            </div>

            {/* Tyre Stress */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Activity className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.1"
                name="TyreStress"
                value={form.TyreStress}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Tyre Thermal/Physical Stress (%)
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: TIMING & PERFORMANCE */}
        <div>
          <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
            03. Timing, Stint & Performance Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lap Number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Gauge className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="LapNumber"
                value={form.LapNumber}
                onChange={handleChange}
                min="1"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Current Race Lap
              </label>
              {errors.LapNumber && <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.LapNumber}</span>}
            </div>

            {/* Stint */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="Stint"
                value={form.Stint}
                onChange={handleChange}
                min="1"
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Stint Number
              </label>
            </div>

            {/* Lap Time */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.001"
                name="LapTime"
                value={form.LapTime}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Lap Time (Seconds)
              </label>
              {errors.LapTime && <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.LapTime}</span>}
            </div>

            {/* LapTime Delta */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.001"
                name="LapTime_Delta"
                value={form.LapTime_Delta}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Lap Time Delta (vs Target)
              </label>
            </div>

            {/* Performance Drop */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <TrendingDown className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="0.01"
                name="PerformanceDrop"
                value={form.PerformanceDrop}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Performance Drop (sec/lap)
              </label>
            </div>

            {/* Pit Stop (Historical pits in this race) */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <RotateCcw className="w-4 h-4" />
              </div>
              <input
                type="number"
                name="PitStop"
                value={form.PitStop}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 text-white rounded-xl border border-zinc-800 text-sm font-medium focus:border-ferrari-red"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Pits Completed Already
              </label>
            </div>

            {/* Race Progress */}
            <div className="relative md:col-span-3">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Gauge className="w-4 h-4" />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                name="RaceProgress"
                value={form.RaceProgress}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950/80 rounded-xl border border-zinc-800 accent-ferrari-red cursor-pointer h-12"
              />
              <label className="absolute -top-2 left-3 px-1.5 bg-[#050505] text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Race Distance Completed (Scale 0 to 1): {(form.RaceProgress * 100).toFixed(0)}%
              </label>
              {errors.RaceProgress && (
                <span className="text-[10px] text-red-500 font-mono mt-1 block">{errors.RaceProgress}</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button Section */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full group relative overflow-hidden rounded-xl font-display font-bold py-4 uppercase tracking-widest text-sm transition-all duration-300 ${
              isLoading
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-gradient-to-r from-ferrari-red to-mclaren-orange text-white border border-transparent shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] cursor-pointer"
            }`}
          >
            {/* Hover ripple element */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                  ANALYZING STRATEGY TELEMETRY...
                </>
              ) : (
                <>
                  RUN PREDICTIVE RUNTIME
                </>
              )}
            </span>

            {/* Glowing borders */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </button>
        </div>
      </form>
    </div>
  );
}
