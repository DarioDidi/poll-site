A full-stack polling application with live results visualization, built with Next.js, Supabase, and Redux. Users can create, vote, and track polls in real-time with dynamic data visualizations.

## ✨ Features

- 🗳️ Create and vote on polls with live results
- 📊 Interactive chart visualizations (bar/pie charts)
- 🔍 Advanced search and filtering
- 🌙 Dark/light theme switching
- 🔐 Secure authentication (email login)
- 📱 Fully responsive design
- ⏱️ Real-time updates via Supabase subscriptions
- 📅 Date filtering and poll status tracking

## 🛠️ Technology Stack

| Category          | Technologies                          |
|-------------------|---------------------------------------|
| Frontend          | Next.js 14, TypeScript, Tailwind CSS  |
| State Management  | Redux Toolkit                         |
| Database          | Supabase (PostgreSQL)                 |
| Authentication    | JWT Auth                         |
| Visualization     | Recharts                              |
| UI Components     | Radix-ui                             |
| Deployment        | Vercel                                |

### Site Routes

```
├── auth 
│   ├── confirm # Email confimation route
│   │   # 
│   ├── error # auth error display
│   │   
│   ├── forgot-password # password recovery
│   │  
│   ├── login # user login
│   │  
│   ├── sign-up # user registration
│   │  
│   ├── sign-up-success # registration success page
│   │   
│   └── update-password # password change
│       
├── / # base page with all polls
├── create # create a poll
├── polls 
│   └── [id] # view a poll by [id]
│       └── vote # vote on a poll [id]
└── user
    └── [id] # view polls created by user [id]
        └── votes # view votes by user [id]
```


📡  Endpoints

Route Method Description
```
/ GET Fetch paginated polls
/create POST Create new poll
/polls/[id] GET Get single poll with votes
/polls/[id]/vote POST Submit vote
/user/[id] GET user's polls
/user/[id]/votes GET user's votes
/auth/* Supabase auth handlers
```

## 🚀 Getting Started
### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/DarioDidi/poll-site.git
   cd poll-site
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
4. Fill in your Supabase credentials:
   ```bash
   //.env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

5. Run the development server:
   ```bash
   npm run dev

