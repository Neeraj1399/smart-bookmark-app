📚 Smart Bookmarks
A high-performance, real-time digital vault for managing web discoveries. Built with Next.js 14, Supabase, and Framer Motion.

🚀 Features
Google OAuth Integration: Seamless signup and login via Google.

Real-time Synchronization: Bookmark list updates instantly across all open tabs without refreshing.

Private Storage: Row Level Security (RLS) ensures users only see their own bookmarks.

Engagement Tracking: Real-time click counter to track your most-visited links.

Dynamic Library: Filter by category (Work, Study, etc.) and sort by popularity or date.

Polished UI: Dark mode support and fluid animations using Framer Motion.

🛠️ Tech Stack
Framework: Next.js (App Router)

Database & Auth: Supabase

Styling: Tailwind CSS

Animations: Framer Motion

🧠 Problems & Solutions
During the development of this project, I encountered several technical challenges. Here is how I navigated them:

1. The "Sign-Up" Confusion
   Problem: The requirements asked for both "Sign Up" and "Log In". Initially, I planned to build two separate forms.

Solution: I realized that with Google OAuth, the "Sign Up" and "Log In" flows are technically identical. If a user doesn't exist, Supabase creates them automatically on their first sign-in. I decided to use a single "Continue with Google" button to reduce user friction while still fulfilling the requirement.

2. Real-time Layout Shifts
   Problem: When a new bookmark was added via the database subscription, the list would "jump" abruptly, creating a poor user experience.

Solution: I implemented Framer Motion's AnimatePresence and layout prop. This allows the list items to slide gracefully into place when a new record is detected by the Supabase Realtime channel.

3. Data Privacy (RLS)
   Problem: Even if the UI filtered bookmarks by user_id, a malicious user could technically query the database for other people's data.

Solution: I enabled Row Level Security (RLS) in Supabase. I wrote a policy that checks the auth.uid() against the user_id column, ensuring that data is protected at the database level, not just the UI level.

4. Search Debouncing
   Problem: Every keystroke in the search bar triggered a re-filter of the list, which caused slight lag when the library grew large.

Solution: I implemented a useEffect with a setTimeout to "debounce" the search term. The app now waits 300ms after the user stops typing before filtering the list, significantly improving performance.

🛠️ Installation & Setup
Clone the repo: git clone https://github.com/your-username/smart-bookmarks.git

Install dependencies: npm install

Env Variables: Create a .env.local file with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

Run: npm run dev
