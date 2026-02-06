# Mission Control - Emergency Medical Logistics Dashboard

A high-fidelity Emergency Medical Logistics Dashboard built with Next.js (App Router), Tailwind CSS, and Lucide React icons. Features real-time dispatch mapping, clinical AI audit panels, and comprehensive API configuration.

## Features

### 🗺️ Live Dispatch (`/dispatch`)
- **Interactive Map View**: React-Leaflet integration with dark theme (CartoDB Dark Matter)
- **Weather Integration**: Real-time Seattle weather data from Open-Meteo API
- **Traffic Simulation**: TomTom Routing API integration for traffic congestion
- **Life-Cost Index Card**: Floating card displaying `LC = (Time × Weather) + Severity`
- **Real-time Stats**: Active routes, average ETA, and critical cargo tracking

### 🧠 Clinical Audit (`/audit`)
- **SHAP Waterfall Plot**: Visual representation of feature contributions
  - Blue bars for time-saving features (e.g., High Severity)
  - Red bars for delay features (e.g., Traffic)
- **Decision Tree Visualization**: Rule-based logic path visualization
- **Model Metrics**: Accuracy, time saved, and decision statistics

### ⚙️ Settings (`/settings`)
- **API Configuration**: Manage TomTom API keys
- **Service Status**: Monitor external API connections
- **Environment Variables**: Guide for production deployment

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Maps**: React-Leaflet with Leaflet
- **APIs**:
  - Open-Meteo (Weather)
  - TomTom Routing API (Traffic)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd medical-logistics-router
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your TomTom API key:
```env
NEXT_PUBLIC_TOMTOM_KEY=your_tomtom_api_key_here
```

### Getting a TomTom API Key

1. Visit [TomTom Developer Portal](https://developer.tomtom.com/)
2. Sign up for a free account
3. Create a new application
4. Copy your API key to `.env.local`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
medical-logistics-router/
├── src/
│   ├── app/
│   │   ├── dispatch/       # Live Map View page
│   │   ├── audit/          # Clinical XAI View page
│   │   ├── settings/       # API Configuration page
│   │   ├── layout.tsx      # Root layout with Navbar
│   │   ├── page.tsx        # Landing page
│   │   └── globals.css     # Global styles and theme
│   └── components/
│       ├── Navbar.tsx      # Top navigation component
│       ├── MapView.tsx     # React-Leaflet map component
│       ├── LifeCostCard.tsx # Life-Cost Index card
│       ├── ShapPlot.tsx    # SHAP Waterfall visualization
│       └── DecisionTree.tsx # Decision tree visualization
├── .env.local.example      # Environment variables template
├── next.config.ts         # Next.js configuration
└── README.md               # This file
```

## Design System

### Color Palette
- **Background**: `#0a0a0a` (Dark Aerospace)
- **Cyan Accent**: `#00f5ff` (Primary actions, highlights)
- **Emergency Red**: `#ff3131` (Critical alerts, delays)
- **Card Background**: `#1a1a1a`
- **Border**: `#2a2a2a`

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Go to Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_TOMTOM_KEY` = `your_tomtom_api_key_here`
5. Click "Deploy"

### Environment Variables in Vercel

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_TOMTOM_KEY` | Your TomTom API key | Required for traffic routing features |

**Note**: The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

## License

This project is private and proprietary.
