## TUM Campus Heilbronn – Buddy Program Prototype

This is a **fully working prototype** of a Buddy Program website for TUM Campus Heilbronn, built with **React + Vite** and **Tailwind CSS**.  
All data is stored **in-memory** for demo purposes – no backend or database is required.

### 1. Features

- **User profiles**
  - Senior and junior buddies with name, age, study program, interests, bio and visual avatar.
  - Prefilled test data: **5 seniors** and **10 juniors** with diverse programs and interests.
- **Matching system**
  - Matching score from **0–100** for each senior–junior pair:
    - **50%** shared interests (Jaccard similarity × 50).
    - **30%** study program match (same = 30, related = 15, different = 0).
    - **20%** bio keyword match (Jaccard similarity × 20).
  - For the demo, the first junior is treated as the currently logged-in user.
  - Dashboard & profile views show **top 3 senior suggestions** with scores and explanations.
- **Activities**
  - Create / join activities with title, description, date/time, location, interests and participants.
  - Pre-filled with **3 example activities**.
  - UI highlights which activities match the junior’s and seniors’ interests.
- **Messaging**
  - Simple chat interface between the current junior and senior buddies.
  - Messages are ordered chronologically and stored in memory while the page is open.
- **Dashboard**
  - Shows profile summary, suggested buddies, joined activities, and recent messages.
- **Frontend**
  - Responsive layout using **React** and **Tailwind CSS**.
  - Navigation bar with **Dashboard, Activities, Messages, Profile**.

### 2. Project structure

- `index.html` – Vite entry point.
- `src/main.jsx` – React root mounting.
- `src/App.jsx` – Main app shell, state management and routing between tabs.
- `src/data.js` – In-memory "database" with buddies, activities and initial messages.
- `src/matching.js` – Matching score calculation and explanation helpers.
- `src/components/Layout.jsx` – Top navigation and page layout.
- `src/components/Dashboard.jsx` – Overview with matching and quick stats.
- `src/components/ActivitiesView.jsx` – List + create/join activities.
- `src/components/MessagesView.jsx` – Messaging UI between buddies.
- `src/components/ProfileView.jsx` – Detailed profile + matching explanation.
- `src/components/ProfileCard.jsx` – Reusable profile summary card.
- `tailwind.config.js` / `postcss.config.js` / `src/index.css` – Tailwind setup and base styles.

### 3. Running the prototype locally

1. **Install dependencies** (already done once when scaffolding, but repeat if needed):

   ```bash
   npm install
   ```

2. **Start the dev server**:

   ```bash
   npm run dev
   ```

3. **Open the app**:

   - Vite will print a local URL, usually `http://localhost:5173`.
   - Open it in your browser.

### 4. Demo walkthrough

- **Dashboard tab**
  - Shows the first junior buddy as the current user.
  - Displays their profile summary and **top 3 senior matches** with score breakdown:
    - Interests (0–50),
    - Study program (0–30),
    - Bio keywords (0–20).
  - Shows joined activities and latest messages.

- **Activities tab**
  - See prefilled activities with labels for **interest matches**.
  - Join/leave activities; joined ones appear on the dashboard.
  - Create new activities using the form on the right (stored in memory only).

- **Messages tab**
  - Pick a senior buddy from the left list.
  - Chat using the message input at the bottom; messages appear in chronological order.

- **Profile tab**
  - View the current junior buddy’s full profile.
  - See again the **top 3 senior matches** with a textual explanation:
    - which interests overlap,
    - how study programs are related,
    - which bio keywords matched.

### 5. Notes & limitations

- This is a **frontend-only prototype**: no authentication, persistence, or real backend.
- Matching and data are computed **entirely in the browser** for demo purposes.
- To reset data, simply **refresh the page**.

