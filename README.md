# Link Shortener

A production-ready link shortener application built with Next.js 15, featuring analytics and IP geolocation.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, shareable links
- 📊 **Analytics**: Track clicks, countries, and user agents
- 🌍 **Geolocation**: Identify visitor countries using IP addresses
- ⚡ **Fast Redirects**: Lightning-fast URL redirections
- 🎨 **Modern UI**: Clean, responsive design with TailwindCSS
- 🔒 **URL Validation**: Secure URL validation and formatting

## Tech Stack

- **Framework**: Next.js 15.1.2 with App Router
- **Frontend**: React 19
- **Database**: SQLite with Prisma ORM 6.1.0
- **Styling**: TailwindCSS 4.1.11
- **ID Generation**: nanoid 5.0.9
- **Validation**: Zod 3.25.76
- **Analytics**: Custom IP geolocation with ipapi.co

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd link-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── [slug]/          # Dynamic route for URL redirects
│   ├── stats/[slug]/    # Analytics page for each link
│   ├── actions.ts       # Server actions for form handling
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Homepage
├── components/
│   └── LinkResult.tsx   # Success result component
└── lib/
    ├── db.ts           # Prisma client
    └── utils.ts        # Utility functions
```

## Database Schema

### Link Model
- `id`: Unique identifier
- `slug`: Short URL slug (unique)
- `url`: Original URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Click Model
- `id`: Unique identifier
- `linkId`: Reference to Link
- `timestamp`: Click timestamp
- `ipAddress`: Visitor IP address
- `userAgent`: Browser user agent
- `country`: Inferred country from IP

## API Routes

- `GET /[slug]` - Redirect to original URL and track analytics
- `GET /stats/[slug]` - View analytics for a specific link
- `POST /` - Create new short link (via Server Actions)

## Analytics Features

- **Click Tracking**: Every link visit is recorded
- **Geographic Data**: Country identification via IP geolocation
- **User Agent Tracking**: Browser and device information
- **Daily Activity**: Click trends over the last 7 days
- **Top Countries**: Most active countries for each link

## Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npx prisma db push   # Push schema changes
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.