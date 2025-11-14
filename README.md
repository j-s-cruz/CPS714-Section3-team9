# FitHub — Member Portal

Luxury fitness onboarding for Peak Performance Gym.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and copy the Project URL and anon public key.

3. Create a `.env.local` at the project root (see `.env.local.example`) and add:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In the Supabase SQL editor, run the SQL below to create the `profiles` and `memberships` tables with Row Level Security policies.

5. Start the dev server:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000` in your browser.


