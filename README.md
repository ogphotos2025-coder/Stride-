# Stride & Soul

> Discover the hidden link between your movement and mental well-being

## 📋 Overview

Stride & Soul is a wellness web application that helps users understand the correlation between their physical activity (step count) and emotional state through AI-powered insights. Unlike standard step trackers, this app provides context and personalized analysis to show how movement directly impacts mental health.

## ✨ Features

- **Mood Logging**: Simple emoji-based daily mood tracking
- **Step Integration**: Sync with Google Health Connect or Apple HealthKit
- **AI Journaling**: Brain dump with sentiment analysis powered by Gemini AI
- **Correlation Dashboard**: Weekly visualization comparing mood scores vs. step counts
- **Insight Engine**: Daily AI-generated insights explaining the mind-body connection
- **Privacy First**: Encrypted journal entries and secure data storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/stride-and-soul.git
cd stride-and-soul
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

4. **Set up Supabase database**

- Create a new Supabase project
- Run the SQL schema from `database/schema.sql` in the Supabase SQL editor
- Enable Row Level Security (RLS) policies

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
stride-and-soul/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/
│       └── analyze/
│           └── route.ts    # AI analysis endpoint
├── components/
│   ├── MoodLogger.tsx      # Mood selection component
│   ├── JournalEntry.tsx    # Journal text input
│   ├── StepCounter.tsx     # Step display & manual entry
│   ├── InsightCard.tsx     # AI insight display
│   └── WeeklyChart.tsx     # Correlation chart
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── gemini.ts           # Gemini AI integration
│   └── database.ts         # Database helper functions
├── types/
│   └── index.ts            # TypeScript type definitions
├── database/
│   └── schema.sql          # Supabase database schema
├── PRD.md                  # Product Requirements Document
├── AI_PROMPT.md            # AI system prompt documentation
└── package.json
```

## 🎯 Usage

1. **Sign up / Sign in** using your email
2. **Log your mood** by selecting an emoji
3. **Write a journal entry** (brain dump)
4. **Enter or sync your steps** for the day
5. **Get AI insights** analyzing the correlation
6. **View weekly chart** to track patterns over time

## 🔐 Security & Privacy

- All journal entries are encrypted at rest
- Row Level Security (RLS) ensures users only access their own data
- No data sharing with third parties
- Compliant with GDPR and privacy best practices

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Connect repository in Netlify
3. Add environment variables
4. Deploy

## 📊 Success Metrics (KPIs)

- **Retention**: % of users who log mood 4+ days per week
- **Correlation Clarity**: % of users who find insights helpful
- **Conversion**: % of users who increase step count by 10%+ after insights

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by Google Gemini AI
- Database by Supabase
- Icons by Lucide
- Charts by Recharts

## 📧 Support

For support, email support@strideandsoul.com or open an issue on GitHub.

---

Made with 💜 for better mental health through movement
