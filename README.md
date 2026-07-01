# PitStop Predictor 🏎️

> **Formula 1 Pit Stop Prediction using Machine Learning**

PitStop Predictor is a premium, high-performance Formula 1 strategy analytics dashboard. It predicts whether a driver will pit on the next lap using a trained Machine Learning model deployed on Databricks. 

The website is designed to look like a modern Formula 1 telemetry dashboard, combining sleek visuals (glassmorphism, carbon fiber grids, speed overlays, and interactive cursors) with real-time predictions.

---

## 📊 Model Performance Metrics

The predictive Strategy Engine is powered by a **Decision Tree Classifier** registered in Unity Catalog / MLflow and served via Databricks.

*   **Accuracy:** `92.80%`
*   **Precision:** `85.69%`
*   **Recall:** `86.14%`
*   **F1 Score:** `85.91%`
*   **ROC-AUC:** `90.61%`

---

## ⚡ Key Features

*   **Telemetry Ingestion Panel:** Input 19 real-time telemetry variables (compounds, laps, stint targets, tyre stress, positions, and deltas). Includes **Quick Presets** (e.g., *Monza Soft Sprint*, *Monaco Hard Marathon*) to test different race circumstances instantly.
*   **Grid Start Sequence:** Clicking "Run Predictive Runtime" triggers the iconic 5-Red-Light sequence. Predictions initiate exactly when the lights extinguish ("Lights out!").
*   **Diagnostics HUD:** Provides real-time readouts of tyre capacity usage, thermal stress levels, and specific recommendations from the virtual Race Engineer.
*   **Model specifications Tab:** Detailed technical specifications covering the dataset, feature synthesis pipeline, model training parameters, and deployment.
*   **Interactive Visuals:** Built with smooth Framer Motion transitions, scrolling sections, particle backgrounds, and a mouse-tracking glowing radial aura.

---

## 🛠️ Tech Stack

*   **Core:** React + Vite
*   **Styling:** Tailwind CSS v4 (native Vite compiler integration)
*   **Animations:** Framer Motion
*   **Icons:** Lucide Icons (custom outline SVGs for brands)
*   **API Client:** Axios (configured with security token headers)
*   **ML Serving:** Databricks Model Serving + MLflow Model Registry

---

## ⚙️ Local Configuration

To connect the dashboard to your live Databricks serving endpoint, create a `.env` file at the root of the project:

```env
# .env Configuration
VITE_DATABRICKS_ENDPOINT_URL=https://dbc-xxxx.cloud.databricks.com/serving-endpoints/F1dataset/invocations
VITE_DATABRICKS_TOKEN=your_databricks_access_token_here
```

### 🛰️ CORS Bypass (Vite Proxy)
Databricks endpoints block direct browser-based API calls due to **CORS (Cross-Origin Resource Sharing)**. To solve this, a server proxy is configured in `vite.config.js`. 

In local development, the app routes calls through `/api/databricks/...` on localhost, which Vite redirects server-side directly to the Databricks Serving domain.

*If no environment variables are set, the app automatically runs in **Telemetry Simulation Mode**, using a local mathematical wear-risk model to return real-time strategic decisions.*

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
*App will run locally at:* `http://localhost:5173/`

### 3. Compile Production Build
```bash
npm run build
```
The compiled output is saved to the `dist/` directory, optimized for high-speed serving.

---

## 📁 Project Structure

*   `src/components/F1Header.jsx` — HUD navigation bar with delta clocks.
*   `src/components/RaceLights.jsx` — 5-light grid sequence loading state.
*   `src/components/TelemetryForm.jsx` — Ingestion controls with strategy presets.
*   `src/components/ResultDisplay.jsx` — Predictive outputs and diagnostic gauges.
*   `src/components/ModelDetails.jsx` — Dataset pipeline and evaluation specs.
*   `src/App.jsx` — Main page layout controller and simulation logic.
*   `src/index.css` — Custom carbon fiber, speed line, and glowing animations.

---

## ⚖️ Disclaimer
*This application is a personal Machine Learning showcase and is not affiliated with, approved by, or connected to the Formula 1 Group, the FIA, or any racing teams.*
