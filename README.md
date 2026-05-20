# Led by the Lambs — Travel Planning App

A full-stack travel planning CRM for Justin & Casondra Lamb, built with Next.js and deployed on Vercel.

---

## ✈️ Features

- **Dashboard** — stats overview and recent client activity
- **Client CRM** — full client profiles with trip details, contact info, quotes, and notes
- **New Request** — intake form to add new clients
- **Quotes & Invoicing** — line-item quote builder with draft/sent status
- **AI Planner (Admin)** — per-client AI planning assistant powered by Claude, pre-filled with client context

---

## 🚀 Deploy to Vercel (15 minutes)

### Step 1 — Get your Gemini API key (free)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign up or log in
3. Navigate to **API Keys** and create a new key
4. Copy it — you'll need it in Step 4

### Step 2 — Push to GitHub
1. Create a new repo at [github.com/new](https://github.com/new) — name it `led-by-the-lambs`
2. In this project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/led-by-the-lambs.git
   git push -u origin main
   ```

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up (free) with your GitHub account
2. Click **Add New → Project**
3. Import your `led-by-the-lambs` repo
4. Click **Deploy** — Vercel auto-detects Next.js, no config needed

### Step 4 — Add your API key
1. In your Vercel project, go to **Settings → Environment Variables**
2. Add:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from Step 1 — no credit card needed
3. Click **Save**
4. Go to **Deployments** and click **Redeploy** to pick up the new env var

### Step 5 — Done!
Your app is live at `https://led-by-the-lambs.vercel.app` (or similar). Share that URL with no one — it's your admin tool.

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Copy env template and add your API key
cp .env.example .env.local
# Edit .env.local and paste your GEMINI_API_KEY

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
led-by-the-lambs/
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── route.js     ← Secure API route (key never exposed to browser)
│   ├── layout.js            ← Fonts, metadata
│   └── page.js              ← Full app UI
├── .env.example             ← Copy to .env.local
├── next.config.js
└── package.json
```

---

## 🔒 Security Note

Your Gemini API key (free) lives only in Vercel's environment variables — it is **never** sent to the browser. The `/api/ai` route acts as a secure proxy between the UI and the Anthropic API.

---

## 🛠 Next Steps

- **Database:** Add Supabase or PlanetScale for persistent client/quote storage
- **Auth:** Add NextAuth.js so only you and Casondra can log in
- **Client portal:** A separate public intake form URL for new clients
- **PDF export:** One-click branded quote PDFs
