# 📬 CC Feedback System

A modern, glassmorphic feedback collection and management application built with React, Vite, and Supabase.

## ✨ Features

- **User Feedback Form** - Anonymous feedback submission with categories
- **Admin Dashboard** - View, manage, and review all feedback
- **Real-time Updates** - Live sync with Supabase
- **Modern UI** - Glassmorphic design with smooth animations
- **Authentication** - Secure admin login with Supabase Auth
- **Responsive Design** - Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Supabase project with authentication enabled

### Setup

1. Clone the repository
```bash
git clone https://github.com/AwaisIshaq7/CC-Feedback-System.git
cd CC-Feedback-System
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` with your Supabase credentials
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start development server
```bash
npm run dev
```

## 📊 Database Setup

In your Supabase dashboard, create a `feedback` table with these columns:
- `id` (UUID, Primary Key)
- `message` (Text)
- `category` (Text)
- `is_reviewed` (Boolean, default: false)
- `created_at` (Timestamp, default: now())

## 🎨 Technologies

- React 19
- Vite
- Supabase
- CSS3 (Glassmorphism)
- JavaScript ES6+

## 📝 License

MIT License - feel free to use this project!
