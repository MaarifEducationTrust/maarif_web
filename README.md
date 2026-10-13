# Madrasa Full-Stack Website (مدرسہ ویب سائٹ)

A complete, formal, trustworthy, responsive bilingual website and administrative content management system for an Islamic Educational Institution (Madrasa).

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase (PostgreSQL with Row Level Security)**. Designed for automated deployment to **GitHub Pages** with support for custom domains, full English & Urdu bilingual typography (with automatic LTR & RTL direction switching), external media streaming (including Google Drive file links), and verified QR code donations.

---

## 🌟 Key Features

1. **Authentic Institutional Design & Aesthetics**
   - Palette tailored for classical Islamic institutions: Deep emerald green (`#064e3b`), clean white, subtle warm neutrals, and refined muted gold accents (`#d97706`).
   - Clean English typography using Google Font **Plus Jakarta Sans** and authentic Urdu Nastaliq typography using **Noto Nastaliq Urdu** & **Amiri**.
   - Subtle geometric Islamic lattice backgrounds and watermarks without loud commercial charity templates or flashy distraction.

2. **Full Bilingual Support (English & Urdu)**
   - Instant 1-click language switcher in the header and mobile navigation drawer.
   - Dynamic direction switching: English uses Left-to-Right (`ltr`), while Urdu automatically activates Right-to-Left (`rtl`) layout and Nastaliq typography.
   - Persistent language preference saved in `localStorage`.
   - Comprehensive translation dictionaries for UI chrome and bilingual database fields for institutional content (`_en` and `_ur`).

3. **5 Public Website Pages + Interactive Modals**
   - **Page 1: Home**
     - Hero banner with customizable headline, badge, and main institution photograph.
     - About the Madrasa: Brief history, Mission, Vision, and Educational Objectives.
     - Introductory Video: Responsive embed supporting YouTube and Google Drive previews.
     - Featured Educational Offerings preview.
     - Verified Student & Staff impact metrics loaded live from Supabase.
     - Current Needs & appeals preview.
     - Institutional transparency and legal certificates highlight.
     - Direct Donation section with QR code and bank details.
   - **Page 2: Educational Programs (`/programs`)**
     - Filterable catalog of academic offerings (Hifz-ul-Quran, Nazra Quran with Tajweed, Deeni Taleem, Adult Evening classes).
     - Detailed modal with age eligibility, timings, and curriculum highlights.
   - **Page 3: Current Needs & Challenges (`/needs`)**
     - Respectful, transparent appeals for infrastructure (clean drinking water, library books, orphan sponsorships).
     - Status filtering (Active, Resolved, All).
     - Detailed modal with requested estimates, context, and supporting documentation links.
     - Zero fabricated donation counts or fake progress bars.
   - **Page 4: Students & Community (`/students`)**
     - Verified aggregate numbers from Supabase (student count, faculty, free boarding rates).
     - Learning environment, daily discipline, and tarbiyah values overview.
     - Approved educational activities and graduation ceremonies (Dastar-e-Fazilat, Qirat competitions).
     - Prominent child privacy notice adhering to protection standards.
   - **Page 5: Legal Documents & Transparency (`/documents`)**
     - Institutional certificates (Trust/Society Registration, PAN tax exemption, Board affiliation).
     - Category filter, issue dates, and document IDs.
     - 1-click "Open in New Tab" and internal modal preview.
     - Private/confidential records remain strictly hidden from anonymous visitors.
   - **Verified Donation System**
     - 1-click modal accessible from navigation, hero, and appeal cards.
     - Official Madrasa QR Code display and download action.
     - 1-click copy for UPI ID, Account Number, and IFSC code.
     - Step-by-step guidance for Google Pay, PhonePe, Paytm, and BHIM apps.
     - Master toggle to enable/disable donations institution-wide.

4. **Administration Portal (`/admin`)**
   - Separate, secure administrative suite protected by Supabase Auth and database RLS.
   - **Dashboard**: Real-time counters of published programs, active appeals, metrics, and documents.
   - **Institution Info & Contacts**: Update Madrasa name (en/ur), logo URL, phone, email, campus address, social links.
   - **Homepage Sections**: Reorder sections, toggle visibility, and update introductory video and hero headlines.
   - **Educational Programs CRUD**: Full create, edit, delete, and draft/publish controls.
   - **Current Needs CRUD**: Manage appeals, estimates, and resolution statuses.
   - **Impact Metrics CRUD**: Manage aggregate numbers with Lucide icon selector.
   - **Student Activities CRUD**: Manage events, competitions, and dates.
   - **Legal Documents CRUD**: Add certificates with public/private visibility controls.
   - **Donation Settings**: Update QR code image URL, UPI ID, Bank details, and donor guidance.
   - **Mock/Offline Resilience**: If Supabase credentials are not yet entered, the portal automatically loads rich fallback seed data and allows full local testing with instant reactive updates!

5. **External Media Management & Google Drive Streaming**
   - Automatically detects and converts Google Drive share links (`drive.google.com/file/d/FILE_ID/...`) into high-speed embeddable image and video links.
   - Handles YouTube video links (`youtube.com/watch?v=...`, `youtu.be/...`).
   - Safe protocol validation preventing `javascript:` and unsafe URLs.
   - Graceful fallback placeholder with direct "Open Link" button if an external URL is blocked.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4 with custom typography and Islamic geometric lattice utilities
- **Icons:** Lucide React
- **Routing:** React Router 7 (HashRouter for 100% reliability on GitHub Pages and custom subpaths)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **CI/CD:** GitHub Actions workflow deploying static artifacts to GitHub Pages

---

## 📁 Project Structure

```text
c4-madrasa-rabbani-baug/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD pipeline
├── public/
│   ├── 404.html                    # SPA redirect fallback for GitHub Pages
│   ├── favicon.svg                 # Institutional crest favicon
│   ├── robots.txt                  # Search engine directives (blocks admin)
│   └── sitemap.xml                 # Search engine sitemap
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── ProtectedRoute.tsx  # Authentication route guard
│   │   ├── common/
│   │   │   ├── DonationModal.tsx   # Verified QR donation modal
│   │   │   ├── IconRenderer.tsx    # Dynamic Lucide icon renderer
│   │   │   ├── SafeImage.tsx       # Google Drive & fallback image handler
│   │   │   └── VideoEmbed.tsx      # YouTube & Drive video embed player
│   │   └── layout/
│   │       ├── AdminLayout.tsx     # Admin dashboard navigation layout
│   │       ├── Footer.tsx          # Public institutional footer
│   │       └── Header.tsx          # Public bilingual header with RTL support
│   ├── context/
│   │   └── AuthContext.tsx         # Supabase Auth provider + mock preview
│   ├── i18n/
│   │   ├── LanguageContext.tsx     # Language state, direction & field picker
│   │   └── translations.ts         # English & Urdu static UI dictionaries
│   ├── lib/
│   │   ├── db.ts                   # Unified data service (Supabase + fallback)
│   │   ├── initialData.ts          # Authentic fallback seed data
│   │   ├── media.ts                # Google Drive & external URL converters
│   │   └── supabase.ts             # Supabase client initialization
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminActivities.tsx # Student activities CRUD
│   │   │   ├── AdminDashboard.tsx  # Admin overview & metrics
│   │   │   ├── AdminDocuments.tsx  # Legal documents CRUD
│   │   │   ├── AdminDonation.tsx   # Donation QR & Bank details CRUD
│   │   │   ├── AdminHomepage.tsx   # Homepage sections & video CRUD
│   │   │   ├── AdminLogin.tsx      # Admin authentication screen
│   │   │   ├── AdminProblems.tsx   # Current needs CRUD
│   │   │   ├── AdminPrograms.tsx   # Educational programs CRUD
│   │   │   ├── AdminSettings.tsx   # General Madrasa identity CRUD
│   │   │   └── AdminStatistics.tsx # Student statistics CRUD
│   │   ├── Home.tsx                # Homepage
│   │   ├── LegalDocuments.tsx      # Public legal documents page
│   │   ├── NotFound.tsx            # Custom 404 page
│   │   ├── Problems.tsx            # Current needs & support page
│   │   ├── Programs.tsx            # Educational programs catalog
│   │   └── Students.tsx            # Student life & verified stats page
│   ├── types/
│   │   └── index.ts                # Complete TypeScript data contracts
│   ├── App.tsx                     # Application router and layout tree
│   ├── index.css                   # Tailwind v4 entrypoint & RTL typography
│   └── main.tsx                    # React DOM entrypoint
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # Database schema + RLS policies
│   └── seed.sql                    # Initial bilingual seed records
├── .env.example                    # Environment variable template
├── index.html                      # HTML template with Google Fonts & SPA script
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🗄️ Supabase Database & Security Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New project** and give your database a name (e.g., `madrasa-website`).
3. Set a strong database password and choose your preferred region.

### Step 2: Run the SQL Schema & RLS Migration
1. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **New query**.
3. Open [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) in this repository, copy its entire contents, and paste into the Supabase SQL Editor.
4. Click **Run**. This will create all 8 tables and enable Row Level Security (RLS) policies.

### Step 3: Insert Initial Bilingual Seed Data
1. In the Supabase SQL Editor, click **New query**.
2. Open [`supabase/seed.sql`](supabase/seed.sql), copy its entire contents, paste, and click **Run**.
3. Your database is now populated with authentic, editable placeholder records for Madrasa Rabbani Baug!

### Step 4: Create the Initial Administrator Account
1. In your Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add user** -> **Create user**.
3. Enter the administrator's email (e.g. `admin@madrasarabbani.org`) and a strong password. Toggle "Auto Confirm User" to on.
4. Copy the generated User UID (UUID).
5. Go back to the **SQL Editor** and run the following command to grant administrative privileges:
   ```sql
   INSERT INTO public.admin_profiles (id, email, role, full_name)
   VALUES ('YOUR_USER_UID_HERE', 'admin@madrasarabbani.org', 'admin', 'Head Administrator');
   ```
6. This user can now securely log in at `/admin/login` and manage all website content.

---

## 💻 Local Development

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   *(Note: If you leave `.env` empty, the website will automatically run in Mock/Offline mode with full local preview!)*
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.
6. Access the admin portal at `http://localhost:5173/#/admin`.

---

## 🚀 GitHub Pages Deployment Guide

The repository includes a ready-to-run GitHub Actions CI/CD workflow at `.github/workflows/deploy.yml`.

### Step 1: Push Code to GitHub
Push your repository to GitHub on the `main` branch:
```bash
git init
git add .
git commit -m "Initial commit of Madrasa full-stack website"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Repository Secrets
1. In your GitHub repository, go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Add:
   - Name: `VITE_SUPABASE_URL` | Value: Your Supabase Project URL
4. Add another secret:
   - Name: `VITE_SUPABASE_ANON_KEY` | Value: Your Supabase Public Anon Key

### Step 3: Enable GitHub Pages
1. In your GitHub repository, go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Every time you push to the `main` branch, GitHub Actions will automatically compile the React app and deploy it to GitHub Pages for free!

---

## 🌐 Custom Domain & HTTPS Configuration

To connect your institution's custom domain (e.g., `madrasarabbani.org` or `www.madrasarabbani.org`):

### 1. In GitHub Repository Settings:
1. Go to **Settings** -> **Pages** -> **Custom domain**.
2. Enter your domain (e.g., `madrasarabbani.org`) and click **Save**.
3. Check the box for **Enforce HTTPS** (GitHub automatically provisions a free Let's Encrypt TLS certificate).

### 2. In Your DNS Provider (Cloudflare, Namecheap, GoDaddy, Google Domains, etc.):
Add the following DNS records:

- **Apex Domain (`madrasarabbani.org`):**
  Create four `A` records pointing to GitHub Pages IP addresses:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`

- **Subdomain (`www.madrasarabbani.org`):**
  Create a `CNAME` record:
  - Host: `www`
  - Value: `YOUR_GITHUB_USERNAME.github.io.`

---

## 📸 Media Guidelines (Google Drive & Photos)

- **Google Drive Images:** Ensure the file sharing setting is set to **"Anyone with the link can view"**. You can directly paste sharing links such as `https://drive.google.com/file/d/1A2B3C4D.../view?usp=sharing` into any Image URL field in the admin panel. The website will automatically render the high-resolution direct CDN image.
- **Videos:** Direct YouTube links (`https://www.youtube.com/watch?v=...`) or Google Drive preview links will be cleanly embedded with privacy-enhanced playback and fallback external links.
