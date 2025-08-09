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
| Authentication    | Supabase Auth                         |
| Visualization     | Recharts                              |
| UI Components     | ShadCN/ui                             |
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
├── polls
│   ├── create # create polls
│   │   
│   ├── [id] # view a poll [id]
│   │   └── vote # vote on poll [id]
│   │       
│   └── user
│       └── [id] # user view owned polls
│           └── votes #user view own votes
```


📡  Endpoints

Route Method Description
```
/ GET Fetch paginated polls
/polls/create POST Create new poll
/polls/[id] GET Get single poll with votes
/polls/[id]/vote POST Submit vote
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
   git clone https://github.com/coddd3r/poll-site.git
   cd poll-site
Install dependencies:
```
npm install
```
Set up environment variables:
``````cp .env.example .env.local
Fill in your Supabase credentials:
env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
``````


Run the development server:

bash
npm run dev
