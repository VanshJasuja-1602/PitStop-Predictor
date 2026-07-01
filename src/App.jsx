import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  ChevronsDown,
  Gauge,
  Info,
  Play,
  RotateCcw,
  Zap,
  ShieldCheck,
  Disc,
  Clock,
  Settings,
  Flame,
  ArrowRight
} from "lucide-react";

import F1Header from "./components/F1Header";
import RaceLights from "./components/RaceLights";
import FeatureCard from "./components/FeatureCard";
import TelemetryForm from "./components/TelemetryForm";
import ResultDisplay from "./components/ResultDisplay";
import ModelDetails from "./components/ModelDetails";

export default function App() {
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSequenceActive, setIsSequenceActive] = useState(false);
  const [currentInputs, setCurrentInputs] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // References for scrolling
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const predictRef = useRef(null);
  const modelRef = useRef(null);

  // Check if live Databricks credentials are set
  useEffect(() => {
    const endpoint = import.meta.env.VITE_DATABRICKS_ENDPOINT_URL;
    const token = import.meta.env.VITE_DATABRICKS_TOKEN;
    if (endpoint && token) {
      setIsLiveMode(true);
    } else {
      setIsLiveMode(false);
    }
  }, []);

  // Track cursor position for the glowing mouse aura
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (sectionId) => {
    const refs = {
      hero: heroRef,
      features: featuresRef,
      predict: predictRef,
      model: modelRef
    };
    const targetRef = refs[sectionId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (formData) => {
    setCurrentInputs(formData);
    setPredictionResult(null);
    setErrorMsg(null);
    // Trigger the F1 racing start lights sequence
    setIsSequenceActive(true);
  };

  // Called when the 5 racing lights go out
  const runPrediction = async () => {
    setIsSequenceActive(false);
    setIsLoading(true);

    try {
      if (isLiveMode) {
        // Map payload fields to match the exact schema expected by the Databricks model
        const mlflowRecord = { ...currentInputs };
        
        // Map "LapTime" to "LapTime (s)" as required by the model signature
        mlflowRecord["LapTime (s)"] = mlflowRecord.LapTime;
        delete mlflowRecord.LapTime;

        const payload = {
          dataframe_records: [mlflowRecord]
        };

        let requestUrl = import.meta.env.VITE_DATABRICKS_ENDPOINT_URL;

        // Bypassing browser CORS limitations in local development via Vite proxy
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
          try {
            const urlObj = new URL(requestUrl);
            requestUrl = `/api/databricks${urlObj.pathname}${urlObj.search}`;
          } catch (e) {
            console.warn("Could not parse Databricks Serving Endpoint URL for proxy mapping:", e);
          }
        }

        const response = await axios.post(
          requestUrl,
          payload,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_DATABRICKS_TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        );

        // Process response
        let prediction = 0;
        let confidence = 0.95; // default fallback

        if (response.data && response.data.predictions && response.data.predictions.length > 0) {
          const predVal = response.data.predictions[0];
          
          if (Array.isArray(predVal)) {
            // It's a probability array, e.g., [0.15, 0.85]
            prediction = predVal[1] >= predVal[0] ? 1 : 0;
            confidence = predVal[prediction];
          } else if (typeof predVal === "object" && predVal !== null) {
            // It's a structured object returned by MLflow serving
            prediction = predVal.prediction ?? (predVal.label ?? 0);
            const probs = predVal.probabilities ?? (predVal.probability ?? null);
            if (Array.isArray(probs)) {
              confidence = probs[prediction];
            } else if (typeof predVal.confidence === "number") {
              confidence = predVal.confidence;
            } else if (typeof predVal.score === "number") {
              confidence = predVal.score;
            }
          } else {
            // It's a scalar value, e.g., 0 or 1
            prediction = parseInt(predVal) === 1 ? 1 : 0;
          }
        }

        setPredictionResult({
          prediction,
          confidence
        });
      } else {
        // Telemetry Simulation Mode (Local predictive strategy calculations)
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating network latency

        const {
          Compound,
          TyreLife,
          TyreStress,
          Cumulative_Degradation,
          Normalized_TyreLife,
          PerformanceDrop,
          LapTime_Delta,
          TyreLifePerStint,
          RaceProgress
        } = currentInputs;

        let decisionScore = 0;

        // 1. Wear & Degradation impacts (40%)
        decisionScore += (Cumulative_Degradation / 100) * 0.4;
        decisionScore += Normalized_TyreLife * 0.2;

        // 2. Target capacity ratio (30%)
        const expectedLife = TyreLifePerStint || 30;
        const stintRatio = TyreLife / expectedLife;
        if (stintRatio >= 0.9) {
          decisionScore += 0.35;
        } else if (stintRatio >= 0.75) {
          decisionScore += 0.2;
        }

        // 3. Thermal Stress (15%)
        decisionScore += (TyreStress / 100) * 0.15;

        // 4. Performance deltas (15%)
        if (PerformanceDrop > 1.0 || LapTime_Delta > 0.8) {
          decisionScore += 0.15;
        }

        // 5. Compound adjustments
        if (Compound === "SOFT") {
          decisionScore += 0.1; // Softs drop off faster
        } else if (Compound === "HARD") {
          decisionScore -= 0.15; // Hards are durable
        }

        const threshold = 0.52;
        const prediction = decisionScore >= threshold ? 1 : 0;

        // Calculate confidence
        const rawDiff = Math.abs(decisionScore - threshold) / threshold;
        const confidence = Math.min(0.99, Math.max(0.60, 0.65 + rawDiff * 0.35));

        setPredictionResult({
          prediction,
          confidence
        });
      }
    } catch (err) {
      console.error("Databricks connection failed. Falling back to local Telemetry Simulation.", err);
      
      let errMsg = "Databricks live endpoint connection failed. Reverting to local telemetry calculations.";
      if (err.response && err.response.data) {
        if (typeof err.response.data.message === "string") {
          errMsg = `Databricks API Error: ${err.response.data.message}`;
        } else if (typeof err.response.data.error === "string") {
          errMsg = `Databricks API Error: ${err.response.data.error}`;
        } else if (typeof err.response.data.error_code === "string") {
          errMsg = `Databricks API Error (${err.response.data.error_code}): ${err.response.data.message || ""}`;
        } else {
          errMsg = `Databricks API Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
        }
      } else if (err.message) {
        errMsg = `Network/CORS Error: ${err.message}`;
      }
      setErrorMsg(errMsg);
      
      // Fallback calculations so UI is never broken
      const { TyreLife, Cumulative_Degradation, TyreStress } = currentInputs || { TyreLife: 0, Cumulative_Degradation: 0, TyreStress: 0 };
      const score = (Cumulative_Degradation / 100) * 0.5 + (TyreStress / 100) * 0.3;
      const prediction = score > 0.5 ? 1 : 0;
      
      setPredictionResult({
        prediction,
        confidence: 0.85
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Speed lines animation generator helper
  const speedLinesArray = Array.from({ length: 12 });

  return (
    <div className="min-h-screen carbon-grid text-white relative font-sans select-none overflow-x-hidden pb-12">
      {/* Background Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-50"
        style={{
          background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(225, 6, 0, 0.04), rgba(0, 207, 255, 0.02), transparent 80%)`
        }}
      />

      {/* Speed lines animation overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-30">
        <div className="speed-overlay" />
        {speedLinesArray.map((_, i) => (
          <div
            key={i}
            className="speed-line animate-speed-lines"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <F1Header isLiveMode={isLiveMode} scrollToSection={scrollToSection} />

      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-screen pt-32 flex flex-col justify-center items-center px-6 overflow-hidden z-20"
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left space-y-6">
            {/* Strategy badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-mclaren-orange bg-mclaren-orange/10 border border-mclaren-orange/20 px-3 py-1.5 rounded-full w-fit mx-auto lg:mx-0 uppercase tracking-widest"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Telemetry Strategy Engine Active</span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black tracking-wider uppercase leading-none"
            >
              PITSTOP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ferrari-red via-mclaren-orange to-neon-yellow drop-shadow-lg">
                PREDICTOR
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-zinc-300 font-sans font-light leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Predict Formula 1 pit stop decisions using Machine Learning models trained on historical race strategy data. Analyze tyre degradation, delta splits, and thermal strain on the fly.
            </motion.p>

            {/* Buttons CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => scrollToSection("predict")}
                className="group px-8 py-4 bg-gradient-to-r from-ferrari-red to-mclaren-orange text-white font-display font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(225,6,0,0.4)] hover:shadow-[0_0_40px_rgba(225,6,0,0.7)] hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <span>Start Prediction</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="px-8 py-4 bg-zinc-950/80 hover:bg-zinc-900 text-white border border-zinc-800 hover:border-zinc-700 font-display font-bold text-sm uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer"
              >
                Learn More
              </button>
            </motion.div>
          </div>

          {/* F1 Hero Image with animations */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Animated backdrop glow */}
            <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-ferrari-red to-electric-blue blur-[120px] opacity-25 animate-pulse-slow" />

            <motion.div
              initial={{ opacity: 0, x: 100, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              className="relative z-10 w-full max-w-lg cursor-grab active:cursor-grabbing"
            >
              <img
                src="/f1_car_hero.png"
                alt="Futuristic Formula 1 Race Car Telemetry"
                className="w-full h-auto drop-shadow-[0_15px_50px_rgba(225,6,0,0.3)] filter brightness-110 object-contain"
              />
              {/* Telemetry data overlays */}
              <div className="absolute top-4 left-4 p-2.5 bg-zinc-950/80 border border-zinc-800 rounded font-mono text-[9px] text-zinc-400 space-y-1">
                <div className="text-emerald-400 font-bold">DRS: ACTIVE</div>
                <div>SPD: 342 KM/H</div>
                <div>GEAR: 8</div>
              </div>
              <div className="absolute bottom-4 right-4 p-2.5 bg-zinc-950/80 border border-zinc-800 rounded font-mono text-[9px] text-zinc-400 space-y-1">
                <div className="text-ferrari-red font-bold">OIL TEMP: 114C</div>
                <div>E-K: 98% charge</div>
                <div>SYS: OK</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => scrollToSection("features")}
          className="absolute bottom-8 flex flex-col items-center gap-1 cursor-pointer text-zinc-500 hover:text-white transition-colors"
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.3em]">Scroll Grid</span>
          <ChevronsDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section
        ref={featuresRef}
        id="features"
        className="max-w-7xl mx-auto px-6 py-24 relative z-20 scroll-mt-20"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-wider text-white">
            TELEMETRY SYSTEMS
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-ferrari-red to-mclaren-orange mx-auto my-4" />
          <p className="text-sm text-zinc-400 font-sans font-light">
            An advanced strategy prediction system built on telemetry feeds. Our statistical modeling engine targets
            performance analytics metrics and tyre thermal strain thresholds to output race strategy decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Tyre Performance Analysis"
            description="Real-time estimation of rubber wear, degradation rates, and thermal thresholds per compound."
            icon={Disc}
            accentColor="red"
          />
          <FeatureCard
            title="Race Progress Monitoring"
            description="Continuous lap tracking, distance evaluation, and telemetry delta streams."
            icon={Gauge}
            accentColor="orange"
          />
          <FeatureCard
            title="Strategy Prediction"
            description="Statistical prediction of optimal pit windows based on surrounding competitor spacing."
            icon={Zap}
            accentColor="blue"
          />
          <FeatureCard
            title="Driver Performance Insights"
            description="Quantify driver stress, historical lap delta variance, and positional risk vectors."
            icon={Settings}
            accentColor="yellow"
          />
          <FeatureCard
            title="Historical Race Analytics"
            description="Leverages database parameters spanning years of timing sheets, stints, and compound deltas."
            icon={Clock}
            accentColor="blue"
          />
          <FeatureCard
            title="Real-time Model Inference"
            description="Low-latency REST telemetry analysis served live via Databricks Model Serving endpoints."
            icon={ShieldCheck}
            accentColor="red"
          />
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (PROCESS STEPPER) */}
      <section className="bg-zinc-950/40 border-y border-white/5 py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-black uppercase tracking-wider text-white">
              PREDICTIVE PIPELINE FLOW
            </h2>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">
              Data synchronization from trackside to decision display
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-ferrari-red via-mclaren-orange to-electric-blue z-0 pointer-events-none" />

            {[
              {
                step: "01",
                title: "Telemetry Intake",
                desc: "Real-time feeds track tyre compounds, lap count, delta timing, and degradation metrics.",
                color: "border-ferrari-red text-ferrari-red"
              },
              {
                step: "02",
                title: "Feature Synthesis",
                desc: "Calculate dynamic variables including thermal stress coefficients, spacing risk, and stint decay ratios.",
                color: "border-mclaren-orange text-mclaren-orange"
              },
              {
                step: "03",
                title: "Predictive Inference",
                desc: "The secure features payload queries the Databricks MLflow serving endpoint in milliseconds.",
                color: "border-electric-blue text-electric-blue"
              },
              {
                step: "04",
                title: "Race Control Action",
                desc: "Decision recommendations (BOX vs STAY OUT) are instantly outputted to the timing dashboard.",
                color: "border-neon-yellow text-neon-yellow"
              }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className={`w-20 h-20 rounded-2xl bg-zinc-950 border-2 ${step.color} flex items-center justify-center font-display font-extrabold text-2xl shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="font-display font-bold uppercase text-sm text-white tracking-wider">
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light max-w-[220px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREDICTION SECTION */}
      <section
        ref={predictRef}
        id="predict"
        className="max-w-5xl mx-auto px-6 py-24 relative z-20 scroll-mt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-black uppercase tracking-wider text-white">
            GRID STRATEGY ENGINE
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-ferrari-red to-mclaren-orange mx-auto my-4" />
          <p className="text-sm text-zinc-400 font-sans font-light">
            Configure telemetry inputs below to query the predictive analytics model.
          </p>
        </div>

        {/* Prediction Panel Container */}
        <div className="space-y-8">
          <TelemetryForm onSubmit={handleFormSubmit} isLoading={isLoading || isSequenceActive} />

          {/* Live countdown F1 lights sequence shown when sequence is active */}
          <AnimatePresence>
            {isSequenceActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <RaceLights isActive={isSequenceActive} onSequenceComplete={runPrediction} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs rounded-xl flex items-center gap-2">
              <Info className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Prediction Result Display */}
          <AnimatePresence>
            {predictionResult && !isSequenceActive && (
              <ResultDisplay result={predictionResult} inputs={currentInputs} />
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. ABOUT MODEL SECTION */}
      <section
        ref={modelRef}
        id="model"
        className="max-w-5xl mx-auto px-6 py-12 relative z-20 scroll-mt-20"
      >
        <ModelDetails />
      </section>

      {/* 6. FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-white/5 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Tag */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-ferrari-red to-mclaren-orange flex items-center justify-center font-display font-extrabold text-white text-base italic shadow-md">
                F1
              </div>
              <h4 className="text-base font-display font-black tracking-wider uppercase">
                PITSTOP <span className="text-ferrari-red">PREDICTOR</span>
              </h4>
            </div>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed font-light">
              Official-grade predictive analytics platform designed to solve Grand Prix tyre longevity and race pit decision mechanics.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-4">
              Project Infrastructure
            </h5>
            <ul className="space-y-2 text-xs font-mono text-zinc-500">
              <li>
                <a onClick={() => scrollToSection("hero")} className="hover:text-white transition-colors cursor-pointer">
                  Grid Dashboard
                </a>
              </li>
              <li>
                <a onClick={() => scrollToSection("predict")} className="hover:text-white transition-colors cursor-pointer">
                  Strategy Engine
                </a>
              </li>
              <li>
                <a onClick={() => scrollToSection("model")} className="hover:text-white transition-colors cursor-pointer">
                  Performance Metrics
                </a>
              </li>
            </ul>
          </div>

          {/* Stack tech */}
          <div>
            <h5 className="text-xs font-display font-bold uppercase tracking-wider text-white mb-4">
              Model Serving
            </h5>
            <ul className="space-y-2 text-xs font-mono text-zinc-500">
              <li>Databricks Model Serving</li>
              <li>MLflow Registry v2.6</li>
              <li>Axios Telemetry Interface</li>
              <li>Decision Tree Classifier</li>
            </ul>
          </div>

          {/* Project & developer Links */}
          <div className="space-y-4">
            <h5 className="text-xs font-display font-bold uppercase tracking-wider text-white">
              Developer Portal
            </h5>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.kaggle.com/code/vanshjasuja16/f1-strategy-pit-stop-prediction"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-ferrari-red to-mclaren-orange rounded-xl text-xs font-display font-black uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.03] text-center cursor-pointer shadow-[0_0_15px_rgba(225,6,0,0.35)] hover:shadow-[0_0_25px_rgba(225,6,0,0.7)] border border-transparent"
              >
                <span>Model Preview</span>
              </a>
              <a
                href="https://vanshjasuja16.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-electric-blue to-neon-yellow rounded-xl text-xs font-display font-black uppercase tracking-widest text-zinc-950 transition-all duration-300 hover:scale-[1.03] text-center cursor-pointer shadow-[0_0_15px_rgba(0,207,255,0.35)] hover:shadow-[0_0_25px_rgba(0,207,255,0.7)] border border-transparent"
              >
                <span>Know About Developer</span>
              </a>
            </div>
            <div className="flex gap-3 pt-1">
              <a
                href="https://github.com/VanshJasuja-1602/PitStop-Predictor"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-white rounded-xl text-[11px] font-display font-black uppercase tracking-wider text-white hover:bg-zinc-800 transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/vanshjasuja16"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0077B5] hover:bg-[#0082c8] rounded-xl text-[11px] font-display font-black uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-[0_0_12px_rgba(0,119,181,0.3)] hover:shadow-[0_0_22px_rgba(0,119,181,0.6)] border border-transparent"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* copyright and disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-900 gap-4">
          <div className="text-[10px] font-mono text-zinc-600">
            &copy; {new Date().getFullYear()} PITSTOP PREDICTOR | DEVELOPED BY <span className="text-neon-yellow font-semibold uppercase">Vansh Jasuja</span>. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[9px] font-mono text-zinc-700 text-center md:text-right max-w-md">
            DISCLAIMER: This application is a personal Machine Learning showcase and is not affiliated with, approved by, or connected to the Formula 1 Group, FIA, or any racing teams.
          </div>
        </div>
      </footer>
    </div>
  );
}
