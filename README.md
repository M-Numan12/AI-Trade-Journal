# 🤖 TradeMind AI - The World's First AI-Powered Trading Coach & Journal

[![Next.js](https://img.shields.io/badge/Next.js-16.2-blueviolet?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-123547?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**TradeMind AI** is a premium, state-of-the-art AI-powered trading journal and mental mentoring coach. Retail trading is 90% psychological; TradeMind AI was designed to help independent traders audit their emotional states, eliminate revenge trading, and maintain absolute discipline through advanced AI chart parsing and direct mentor coaching.

---

## 🌟 Key Features

### 1. 📷 AI Chart Vision OCR
* **Instant Screenshot Analysis:** Drag-and-drop or upload trading screenshots (TradingView, MetaTrader, etc.).
* **Auto-Parameter Mapping:** Automatically detects and extracts:
  * Currency/Crypto Pair (e.g., `EURUSD`, `BTCUSDT`, `XAUUSD`)
  * Order Type (`BUY` / `SELL`)
  * Lot Size, Entry Price, Stop Loss (SL), Take Profit (TP)
  * Realized P&L and Outcome (`WIN`, `LOSS`, `BREAKEVEN`)
* **AI Analysis Feedback:** Generates instant constructive feedback, risk-to-reward audits, and tags specific structural mistakes (e.g. *Chasing Market*, *Revenge Trading*).

### 2. 🧠 Psychology & Discipline Logs
* **Mood Tracking:** Record your mental state *before* entering a trade (`Confident`, `Fear`, `FOMO`, `Angry`, `Excited`).
* **Emotional Audit:** Log your emotional state *after* the trade closes (`Satisfied`, `Regret`, `Frustrated`, `Greedy`).
* **Discipline Scoring:** Self-rate your checklist execution on a scale of 1-10 to detect patterns of impulsive or revenge trading.

### 3. 💬 24/7 Interactive AI Mentor Chat
* **Personal Trading Coach:** An automated AI mentor trained on trading psychology, risk management, and market dynamics.
* **Friendly Roman Urdu / Hindi / English Support:** The coach understands and interacts in natural bilingual terms (e.g. *"Bhai, aapne revenge trading control karni hai..."*), making it highly engaging and conversational.
* **Instant Performance Audit:** Ask questions like *"Meri performance summarize karo"* or *"How to avoid FOMO entries?"* to get custom feedback based on your actual journal history.

### 4. 📊 Performance Analytics Dashboard
* **Equity & P&L Curve:** A dynamic, beautiful Area Chart (powered by Recharts) showing your cumulative account growth.
* **Core KPI Metrics:** Real-time visibility of **Net Profit/Loss**, **Win Rate**, **Average Risk:Reward Ratio**, and **Total Logged Trades**.
* **Asset Analytics:** Automatically isolates your **Best Performing Asset** and **Worst Performing Asset** to tell you exactly where you are losing/earning money.

### 5. 💳 Subscription & Monetization Model
* Ready-to-use structural plans (**Free Plan**, **Pro Coach Plan**, **Premium Sync Plan**) with landing page pricing grids and integrated premium Lemon Squeezy checkouts.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Server actions, modern routing & layout control |
| **Frontend UI** | **React 19 & React-DOM** | High-performance state handling |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS with native PostCSS imports |
| **Database** | **SQLite** | Zero-config, lightweight relational SQL database |
| **ORM** | **Prisma** | Modern database client & migration framework |
| **Authentication**| **JWT + Bcrypt.js** | Secure cookies, middleware-controlled private pages |
| **Charts** | **Recharts** | Interactive SVG charts & equity curve renders |
| **Icons** | **Lucide React** | Sleek & clean minimal modern iconography |

---

## 🚀 Getting Started & Local Setup

Follow these simple steps to run **TradeMind AI** on your local machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AI-Trade-Journal.git
cd AI-Trade-Journal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add a secret key for JWT authentication:
```env
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY_HERE"
```

### 4. Initialize Database (Prisma)
Initialize the SQLite database schema and generate the client:
```bash
npx prisma db push
```

*(Optional) If you want to open the interactive database studio viewer:*
```bash
npx prisma studio
```

### 5. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 📂 Project Structure

```text
├── prisma/
│   ├── schema.prisma     # Relational database models (User, Trade, PsychologyLog, AiAnalysis)
│   └── dev.db            # Local SQLite database
├── src/
│   ├── app/
│   │   ├── (dashboard)/  # Grouped dashboard layout & authenticated workspace pages
│   │   │   ├── dashboard/   # Performance statistics & chart analytics page
│   │   │   ├── journal/     # Manual logging & drag-and-drop screenshot vision OCR
│   │   │   ├── mentor/      # Roman Urdu / English AI trading coach chat system
│   │   │   └── psychology/  # Mindset & discipline logging page
│   │   ├── api/          # Serverless route handlers (auth, trades, mentor, psychology)
│   │   ├── login/        # User authentication sign in page
│   │   ├── signup/       # User registration sign up page
│   │   ├── globals.css   # Custom Glassmorphism styles, scrollbars, and keyframes
│   │   └── page.tsx      # Premium landing page layout (Hero, features, pricing tables)
│   ├── components/       # Shared UI components
│   └── lib/
│       └── ai.ts         # AI Vision parsing models and Coach prompt triggers
```

---

## 🎨 Premium UI Design & Theme

TradeMind AI implements **Rich Space Aesthetics** featuring:
* **Deep Space Background:** A gorgeous `#030014` dark template accented with dynamic violet & teal radial gradient glow backdrops.
* **Glassmorphism panels:** `glass-panel` custom styling with `backdrop-filter` and soft borders.
* **Responsive Layouts:** Seamless compatibility from small smartphone viewports up to large desktop screens.
* **Micro-Animations:** Fluid transitions, floating interactive action points, and sleek loading skeletons.

---

## 🤝 Contributing & License
Contributions are welcome! Please feel free to open a Pull Request or report bugs.
This project is open-source and available under the [MIT License](LICENSE).
