# CBDC-Ressources - Inventory
# Generated: 2026-03-14
# URL: https://cbdc-web-production.up.railway.app

## Project Overview
**Name:** CBDC-Ressources
**Type:** Web application - CBDC (Central Bank Digital Currency) resource hub
**Stack:** React + TypeScript + Express + Drizzle ORM
**Deployed:** Railway (https://cbdc-web-production.up.railway.app)

---

## Database Schema (5 Tables)

### 1. users
- id, username, email, password

### 2. cbdcs
- id, name, country, countryCode, status, description, launchDate, region

### 3. techVendors
- id, name, technology, country, projects, status, description

### 4. resources
- id, institution, title, description, link, type, date

### 5. blogPosts
- id, title, slug, content, excerpt, status, publishDate, author, category, tags, metaTitle, metaDescription, focusKeyword, readingTime, wordCount, cluster

---

## Data Resources

### CBDC Projects (30+ entries)
Examples:
| Project | Country | Bank | Year | Status | Technology |
|---------|---------|------|------|--------|------------|
| Wholesale Digital Euro | Euro Area | European Central Bank | 2022 | Pilot | DLT |
| Trigger Solution | Germany | Deutsche Bundesbank | 2024 | Pilot | Non-DLT |
| TIPS Hash-Link | Italy | Banca d'Italia | 2024 | Pilot | Non-DLT |
| Project Venus | France | Banque de France | 2022 | Pilot | DLT |
| Project Ubin+ | Singapore | Monetary Authority of Singapore | 2022 | Pilot | - |
| Project Prosperus | France/Tunisia | Banque de France/Central Bank of Tunisia | 2021 | Pilot | DLT |

### Tech Vendors (34 entries)
| Vendor | Technology | Country/Project | Status |
|--------|------------|-----------------|--------|
| Adhara Blockchain | DLT permissionné (Fnality) | Spain | Pilot |
| Bitt Inc. | DLT (Hyperledger Fabric) | Caribbean, Nigeria, Bahamas | Deployed |
| ConsenSys Software | Ethereum privé / Quorum | France, UAE, Hong Kong | PoC/Pilot |
| eCurrency Mint | Centralisé | Jamaica, Zimbabwe | Pilot/PoC |
| Giesecke+Devrient | DLT hybride (Filia) | Thailand, Ghana, Brazil | Pilot |
| Hyperledger Fabric | DLT permissionnée | Caribbean, Nigeria, Philippines | Deployed |
| R3 Corda | DLT (Corda) | Kazakhstan, UAE, Italy | Pilot |
| Ripple | XRP Ledger | Bhutan, Palau | Pilot |
| Soramitsu | Hyperledger Iroha | Cambodia, Laos | Deployed/Pilot |

### Blog Posts Clusters (6 clusters, 161 articles)
1. **Regulation & Compliance** - 31 articles
2. **Country Implementation** - 32 articles
3. **Financial Institutions** - 76 articles
4. **Technology & Infrastructure** - 10 articles
5. **Analysis & Insights** - 9 articles
6. **Future & Trends** - 3 articles

---

## Static Assets

### Images (attached_assets/)
- image_1748582744785.png
- image_1748583016150.png
- image_1748583427823.png
- image_1748611763937.png
- image_1748611994095.png
- image_1748623705405.png
- image_1748704002397.png
- image_1748767533504.png
- image_1748768266889.png
- image_1748773782791.png
- image_1749052435760.png
- image_1753860999991.png

### Documents
- modern-cbdc-guide.zip
- svgMap-master.zip
- wordpress-lot-aee589fb_1753786136617.csv
- cbdc vendors.csv

### Text Resources (Pasted files)
- Pasted--Fournisseur-Technologie-Pays-Projet-Statut-Description...
- Pasted--https-cbdcresources-com...
- Pasted-Institution-Titre-du-document-Description-Lien-FMI...
- Pasted--Nom-doc-Descr...
- Pasted--Pays-Ann-e-Utilisateurs-CBDC...
- Pasted-Pays-Institution-Type-de-CBDC...
- Pasted-The-Entire-USA-import-plotly...

---

## Source Files

### Client-side
- client/src/App.tsx
- client/src/main.tsx
- client/src/data/cbdc-data.ts
- client/src/pages/Home.tsx, Resources.tsx, TechVendors.tsx, CBDCAdoption.tsx, Blog.tsx, etc.
- client/src/components/CBDCChoroplethMap.tsx, CBDCTable.tsx, Hero.tsx, etc.
- client/src/components/ui/* (UI components)

### Server-side
- server/index.ts (entry point)
- server/storage.ts (data storage)
- server/routes.ts (API routes)
- server/blogData.ts (blog data processing)
- server/processBlogCSV.ts (CSV processing)
- server/sitemap.ts (SEO sitemap)
- server/robots.ts (SEO robots.txt)
- server/vite.ts (Vite integration)

### Shared
- shared/schema.ts (database schema)

### Config
- package.json
- drizzle.config.ts
- tailwind.config.ts
- vite.config.ts
- tsconfig.json
- Dockerfile
- railway.json

---

## External Dependencies

### UI Libraries
- @radix-ui/react-* (various components)
- @nextui-org/react
- framer-motion
- lucide-react
- recharts
- plotly.js

### Backend
- express
- drizzle-orm
- @neondatabase/serverless
- passport

### Build Tools
- vite
- esbuild
- typescript
- tailwindcss

---

## Routes/Pages
1. / - Home
2. /resources - Resources page
3. /vendors - Tech vendors page
4. /map - CBDC map
5. /blog - Blog listing
6. /blog/:slug - Individual blog post
7. /blog/cluster/:cluster - Blog by cluster

---

## Environment Variables Needed
- DATABASE_URL (PostgreSQL)
- PORT (default: 5000)
- NODE_ENV (production/development)

---

## Deployment Info
- Platform: Railway
- Project ID: ad17a3dd-3bf2-41f5-a659-9ca854a525dc
- Service: cbdc-web
- URL: https://cbdc-web-production.up.railway.app
- Database: PostgreSQL (Railway)

---

## GitHub Repo
- URL: https://github.com/itsaina/CBDC-Ressources
- Private repository
