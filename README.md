#  Watch & Read Library

A full-stack web application for tracking your personal media library: movies, TV shows, anime, dramas, manga, books, and more. 

🔗 **Live Demo:** [https://watch-read-library-v2.vercel.app/](https://watch-read-library-v2.vercel.app/)

---


##  Features

- **User Authentication:** Secure signup/login using JWT (JSON Web Tokens).
- **Interactive Dashboard:** Filter by category (Anime, Books, Manga, etc.), search by title, and toggle favorites.
- **Detailed Tracking:** Update progress (episodes, chapters, pages), add ratings (0-10), write reviews, and upload custom covers.
- **Dynamic UX:** Responsive modern dark-theme design with animated background gradients and micro-interactions.

---

##  Tech Stack

**Frontend:**
- React (Vite)
- CSS (custom dark styling)
- React Icons

**Backend:**
- Node.js & Express.js
- Prisma ORM
- PostgreSQL (hosted on Neon)
- Multer (file upload handling)
- bcryptjs & jsonwebtoken (security)

---

##  Local Installation & Setup

### Prerequisites
- Node.js installed
- PostgreSQL database URL

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file based on .env.example and add your DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run dev
