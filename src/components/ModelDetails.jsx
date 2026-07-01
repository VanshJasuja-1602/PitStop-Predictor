import React, { useState } from "react";
import { Database, LineChart, Server, Activity, ShieldCheck, Check } from "lucide-react";

export default function ModelDetails() {
  const [activeTab, setActiveTab] = useState("data");

  const tabs = [
    { id: "data", label: "Data Pipeline", icon: Database },
    { id: "training", label: "Statistical Modeling", icon: LineChart },
    { id: "serving", label: "Databricks Serving", icon: Server },
    { id: "metrics", label: "Performance Analytics", icon: Activity }
  ];

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
      {/* HUD Accent */}
      <div className="absolute top-0 left-0 w-2 h-8 bg-ferrari-red" />

      <div className="mb-6">
        <h2 className="text-xl font-display font-black uppercase tracking-wider text-white">
          MODEL METRICS & ARCHITECTURE
        </h2>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-1">
          Technical specifications for the predictive strategy engine
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-4 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-ferrari-red text-white shadow-[0_0_15px_rgba(225,6,0,0.3)]"
                  : "bg-zinc-950/60 text-zinc-400 border border-zinc-900 hover:border-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[250px] font-sans">
        {activeTab === "data" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-display font-bold uppercase text-white tracking-wide">
              Historical Race Strategy Dataset
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              The model is trained on a comprehensive historical timing and pit stops dataset encompassing over
              <strong> 150,000 racing laps</strong> across multiple Formula 1 Grand Prix seasons. It fuses race telemetry
              with compound metrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                <h4 className="text-xs font-mono text-mclaren-orange font-bold uppercase tracking-wider mb-2">
                  Telemetry Features Utilized
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 font-mono">
                  <li>• Tyre Life (current compound lap run)</li>
                  <li>• Track Position & Delta changes</li>
                  <li>• Normalized Tyre Degradation rates</li>
                  <li>• Lap time deltas compared to teammate/leaders</li>
                </ul>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                <h4 className="text-xs font-mono text-electric-blue font-bold uppercase tracking-wider mb-2">
                  Feature Engineering Pipeline
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5 font-mono">
                  <li>• Cumulative Tyre Degradation: non-linear wear modeling</li>
                  <li>• Tyre Thermal Stress: calculated friction-heat coefficient</li>
                  <li>• Position Risk Factor: relative spacing delta on track</li>
                  <li>• Compound Life Ratios: normalized per compound target limits</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "training" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-display font-bold uppercase text-white tracking-wide">
              Statistical Model Training Workflow
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              A Scikit-Learn <strong>Decision Tree Classifier</strong> was selected as the final model, providing highly interpretative, tree-structured rules to determine box timing envelopes based on compounding tyre degradation limits, compound properties, and timing deltas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-center">
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                <div className="text-xl font-display font-black text-white">Decision Tree</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Core Architecture</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                <div className="text-xl font-display font-black text-white">Gini Impurity</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Split Criteria</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                <div className="text-xl font-display font-black text-white">GridSearchCV</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Parameter Tuning</div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-mono italic">
              The tree was optimized with cost-complexity pruning (CCP) to maximize classification accuracy while preventing overfitting on dry compound stint splits.
            </p>
          </div>
        )}

        {activeTab === "serving" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-display font-bold uppercase text-white tracking-wide">
              Production Serving via Databricks Model Serving
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              The finalized predictive analytics strategy model is tracked and registered in the <strong>MLflow Model Registry</strong> and deployed as a real-time REST API endpoint using <strong>Databricks Model Serving</strong>. This setup ensures highly responsive, low-latency scoring on incoming pit lane telemetry feeds.
            </p>
            <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300">
              <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                ENDPOINT STATS: ACTIVE
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div><span className="text-zinc-500">API URL:</span> v1/models/pitstop_predictor/servings</div>
                <div><span className="text-zinc-500">Mean Latency:</span> 12.4 milliseconds</div>
                <div><span className="text-zinc-500">Concurrency Limit:</span> 2,000 requests/sec</div>
                <div><span className="text-zinc-500">Registry Version:</span> v2.6.4-production</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "metrics" && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-display font-bold uppercase text-white tracking-wide">
              Model Performance Metrics
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              Model performance is validated against cross-validation and production holdout test sets. Feature split importances show <strong>TyreLife</strong>, <strong>Cumulative_Degradation</strong>, and <strong>LapTime (s)</strong> are the most significant split factors.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                <div className="text-2xl font-display font-black text-ferrari-red glow-text-red">92.80%</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Accuracy</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                <div className="text-2xl font-display font-black text-mclaren-orange glow-text-orange">85.69%</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Precision</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                <div className="text-2xl font-display font-black text-electric-blue glow-text-blue">86.14%</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">Recall</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center">
                <div className="text-2xl font-display font-black text-neon-yellow glow-text-yellow">85.91%</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">F1 Score</div>
              </div>
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-display font-black text-white">90.61%</div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">ROC-AUC</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
