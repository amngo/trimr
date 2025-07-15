# Trimr - Modern URL Shortener

A production-ready URL shortener built with Next.js 15, featuring analytics, authentication, and comprehensive testing.

## Features

- 🔗 **URL Shortening**: Convert long URLs into short, shareable links with custom slugs
- 👤 **Authentication**: Secure user authentication with Better Auth
- 📊 **Analytics**: Track clicks, countries, and user agents with detailed insights
- 🌍 **Geolocation**: Identify visitor countries using IP addresses
- ⚡ **Fast Redirects**: Lightning-fast URL redirections with caching
- 🎨 **Modern UI**: Clean, responsive design with TailwindCSS and DaisyUI
- 🔒 **URL Validation**: Secure URL validation and formatting
- 📱 **QR Codes**: Generate QR codes for shortened URLs
- 🛡️ **Password Protection**: Optional password protection for links
- ⏰ **Link Expiration**: Set expiration dates and active periods
- 📂 **Bulk Operations**: Upload multiple URLs via CSV
- 🎯 **Link Management**: Full CRUD operations with search and filtering
- 📖 **API Documentation**: Interactive Swagger UI with comprehensive OpenAPI 3.0 specs
- 📊 **Enhanced Analytics**: Vercel Analytics integration for advanced tracking
- 📝 **Structured Logging**: Custom logger with error handling and context tracking
- 🧪 **Comprehensive Testing**: 289 tests with full coverage

## Tech Stack

- **Framework**: Next.js 15.4.1 with App Router
- **Frontend**: React 19 with TypeScript
- **Database**: SQLite with Prisma ORM 6.1.0
- **Authentication**: Better Auth 1.2.12
- **Styling**: TailwindCSS 4.1.11 + DaisyUI 5.0.46
- **State Management**: Zustand 5.0.6
- **Data Fetching**: TanStack Query 5.82.0
- **Animations**: Motion 12.23.3
- **UI Components**: Headless UI 2.2.4
- **ID Generation**: nanoid 5.0.9
- **Validation**: Zod 3.25.76
- **QR Codes**: React QR Code 2.0.18
- **Testing**: Jest 30.0.4 + Testing Library
- **Code Quality**: ESLint + Prettier + Husky
- **Analytics**: Custom IP geolocation + Vercel Analytics
- **API Documentation**: Swagger UI with OpenAPI 3.0
- **Logging**: Custom logger with error handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trimr
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

6. Explore the API documentation at `http://localhost:3000/api-docs`

## Project Structure

```
src/
├── app/
│   ├── [slug]/              # Dynamic routes for URL redirects
│   │   ├── password/        # Password protection page
│   │   └── __tests__/       # Route tests
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── links/           # Link management APIs
│   ├── api-docs/            # API documentation page
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── landing/             # Landing page
│   ├── stats/[slug]/        # Analytics pages
│   ├── actions.ts           # Server actions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── dashboard/           # Dashboard components
│   ├── forms/               # Form components
│   ├── transitions/         # Animation components
│   ├── ui/                  # Reusable UI components
│   └── __tests__/           # Component tests
├── hooks/                   # Custom React hooks
├── lib/                     # Core utilities
│   ├── api-utils.ts         # API error handling
│   ├── auth.ts              # Authentication setup
│   ├── db.ts                # Prisma client
│   ├── swagger.ts           # API documentation configuration
│   └── utils.ts             # Utility functions
├── providers/               # React context providers
├── stores/                  # Zustand state stores
├── types/                   # TypeScript type definitions
└── utils/                   # Helper utilities
    ├── csvParser.ts         # CSV processing
    ├── filterAndSort.ts     # Data operations
    ├── linkUtils.ts         # Link utilities
    └── logger.ts            # Logging
```

## Database Schema

### User Model

- `id`: Unique identifier
- `email`: User email address
- `name`: Display name
- `emailVerified`: Email verification status
- `image`: Profile image URL
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Session/Account Models

- Authentication sessions and OAuth accounts (Better Auth)

### Link Model

- `id`: Unique identifier
- `slug`: Short URL slug (unique)
- `url`: Original URL
- `userId`: Owner reference
- `enabled`: Active status
- `password`: Optional password protection
- `expirationDate`: Optional expiration
- `startingDate`: Optional activation date
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

### Public Routes

- `GET /[slug]` - Redirect to original URL and track analytics
- `GET /[slug]/password` - Password protection page
- `GET /stats/[slug]` - View analytics for a specific link
- `GET /api-docs` - Interactive Swagger API documentation

### Authentication

- `POST /api/auth/*` - Authentication endpoints (Better Auth)

### Link Management (Protected)

- `GET /api/links` - Get user's links
- `POST /api/links` - Create new link
- `DELETE /api/links/[id]` - Delete link
- `POST /api/links/bulk` - Bulk create links via CSV
- `POST /api/links/bulk-delete` - Bulk delete links
- `POST /api/links/bulk-toggle` - Bulk toggle link status
- `POST /api/links/verify-password` - Verify link password

## Analytics Features

- **Click Tracking**: Every link visit is recorded
- **Geographic Data**: Country identification via IP geolocation
- **User Agent Tracking**: Browser and device information
- **Daily Activity**: Click trends over the last 7 days
- **Top Countries**: Most active countries for each link
- **Vercel Analytics**: Enhanced tracking with real-time visitor insights

## API Documentation

This project includes comprehensive API documentation using Swagger UI:

- **Interactive Documentation**: Visit `/api-docs` to explore all API endpoints
- **OpenAPI 3.0 Specification**: Full API specification with request/response schemas
- **Authentication Examples**: Complete examples for protected endpoints
- **Try It Out**: Test API endpoints directly from the documentation interface
- **Schema Validation**: Detailed request and response validation schemas

## Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Authentication (Better Auth)
BETTER_AUTH_SECRET="your-secret-key-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run format           # Format all files with Prettier
npm run format:check     # Check if files are formatted
npm run type-check       # TypeScript type checking only
npm run validate         # Run type check + lint + test

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report
npm run test:ui          # Interactive test runner (no coverage)

# Database
npx prisma db push       # Push schema changes
npx prisma studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Create and apply migrations
```

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Set production environment variables
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Code Quality & Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) for automated code quality checks:

### Git Hooks

- **Pre-commit**: Runs linting, formatting, type checking, and tests
- **Pre-push**: Runs build and coverage checks
- **Commit-msg**: Enforces [Conventional Commits](https://www.conventionalcommits.org/) format

### Conventional Commits

Use the format: `type(scope): description`

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

**Examples**:

- `feat: add password protection for links`
- `fix(api): resolve CORS issue`
- `docs: update README`
- `refactor(components): simplify modal logic`

### Code Standards

- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting with 4-space tabs
- **TypeScript**: Strict type checking
- **Testing**: 289 tests with comprehensive coverage
- **API Documentation**: Swagger UI with OpenAPI 3.0 specification

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Make your changes following our code standards
4. Commit using conventional format: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feat/amazing-feature`
6. Open a Pull Request

The automated hooks will ensure code quality standards are met before commits.

## License

MIT License - see LICENSE file for details.
