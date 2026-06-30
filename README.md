# 🏍️ RideX — Premium Riding Gear & Accessories Store

> A full-stack e-commerce platform for premium motorcycle riding gear. Built with **Next.js 15**, **Express.js**, **Prisma**, and **PostgreSQL (Supabase)** — featuring AI-powered size advice, a customer chatbot, an admin dashboard, and dark/light mode.

---

## 🚀 Live Features

### 🛒 Customer Storefront
- **Home** — Animated hero sections with gear highlights and AI chatbot CTA
- **Shop** — Filterable, searchable catalog with category, price range & sort options
- **Product Details** — Image gallery, AI size advisor, product Q&A chatbot, reviews, and add-to-cart
- **Cart** — Quantity management, shipping estimates (GST included), and checkout flow
- **Checkout** — Address auto-fill via OpenStreetMap (Nominatim), Razorpay mock gateway + Cash on Delivery
- **Orders** — Real-time status tracker (Placed → Paid → Shipped → Delivered) with tracking numbers
- **About** — Brand mission and story section
- **Contact** — Contact form with dynamic address & helpline from admin settings

### 🔐 Admin Dashboard (`/admin/*`)
- Protected routes — only accessible to users with `ADMIN` role
- **Products** — Add, edit, and manage inventory with multi-image support
- **Categories** — Create/edit categories with a destructive deletion warning modal
- **Orders** — View all orders, update status and add tracking numbers
- **Contact** — Update store address, phone, email, and social links
- **About** — Edit brand hero section and story copy
- **Config** — Change the site title and navbar/footer brand name in real-time

### 🤖 AI Features
- **AI Size Advisor** — Recommends the right gear size based on height, weight, and chest measurement
- **Product Q&A** — Answers product-specific customer questions using OpenAI
- **Global AI Chatbot** — General riding gear assistant available across all pages

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| **Backend** | Express.js, TypeScript, Prisma ORM |
| **Database** | PostgreSQL via Supabase |
| **Auth** | JWT (Access + Refresh Token pattern) |
| **AI** | OpenAI Chat Completions API (GPT-4o-mini) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Geocoding** | OpenStreetMap Nominatim (free, no API key) |

---

## 📁 Project Structure

```
vehicle_commerce/
├── backend/                   # Express.js REST API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data (categories, products, users)
│   ├── src/
│   │   ├── config/            # DB connection
│   │   ├── controllers/       # Route handlers (auth, products, cart, orders, ai...)
│   │   ├── middleware/        # JWT auth guard, admin guard
│   │   ├── routes/            # Express routers
│   │   └── index.ts           # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                  # Next.js 15 App
    ├── src/
    │   ├── app/               # App Router pages
    │   │   ├── admin/         # Admin dashboard pages
    │   │   ├── products/[slug]# Product detail page
    │   │   ├── shop/          # Catalog page
    │   │   ├── cart/          # Shopping cart
    │   │   ├── checkout/      # Checkout flow
    │   │   ├── orders/        # Order history
    │   │   ├── about/         # About Us
    │   │   └── contact/       # Contact page
    │   ├── components/        # Shared components (Navbar, Footer, AIChatbox...)
    │   ├── context/           # React Context (Auth, Cart, Theme, SiteConfig)
    │   └── services/          # API fetch wrapper
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or a free [Supabase](https://supabase.com) project)
- OpenAI API Key (optional — AI features degrade gracefully without it)

---

### 1. Clone the Repository

```bash
git clone https://github.com/faheel0502-dotcom/RideX.git
cd RideX
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
PORT=5000
CLIENT_URL="http://localhost:3000"
ACCESS_TOKEN_SECRET="your_access_token_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
OPENAI_API_KEY="sk-..."         # Optional – leave blank to disable AI
```

Run database migrations and seed data:

```bash
npx prisma migrate deploy
npx prisma generate
npm run seed
```

Start the dev server:

```bash
npm run dev
# Backend running at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

Start the dev server:

```bash
npm run dev
# Frontend running at http://localhost:3000
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@ridex.com` | `AdminPassword123` |
| **User** | `user@ridex.com` | `UserPassword123` |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login and receive tokens |
| `GET` | `/api/v1/products` | List products (with filters) |
| `GET` | `/api/v1/products/:slug` | Get single product |
| `GET` | `/api/v1/categories` | List all categories |
| `GET` | `/api/v1/cart` | Get current user's cart |
| `POST` | `/api/v1/orders/checkout` | Place an order |
| `GET` | `/api/v1/orders` | Get current user's orders |
| `POST` | `/api/v1/ai/size` | AI size recommendation |
| `POST` | `/api/v1/ai/chat` | AI product Q&A |
| `GET` | `/api/v1/config` | Get site config |
| `PUT` | `/api/v1/config` | Update site config *(Admin only)* |

---

## 🚀 Deployment (Vercel + Railway/Render)

### Backend (Railway or Render)
1. Push the `backend/` folder to a separate repo or deploy as a monorepo service
2. Set all environment variables from the `.env` template above
3. Set the **Build Command** to: `npm run build`
4. Set the **Start Command** to: `npm start`
5. After deploy, note your backend URL (e.g. `https://ridex-api.railway.app`)

### Frontend (Vercel)
1. Import your GitHub repo into [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add the environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api/v1
   ```
4. Click **Deploy** ✅

---

## 📸 Screenshots

> Screenshots and demo video coming soon.

---

## 📄 License

This project is for educational and portfolio purposes.

---

**Built with ❤️ by [faheel0502](https://github.com/faheel0502-dotcom)**
