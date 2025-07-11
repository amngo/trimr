# Authentication Setup Guide

This guide will help you set up Google and GitHub OAuth authentication for your Link Shortener application.

## 1. Environment Setup

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

## 2. Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen if prompted
6. Select "Web application" as the application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret to your `.env.local` file:
   ```
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

## 3. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (for development)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local` file:
   ```
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   ```

## 4. Better Auth Secret

Generate a random secret for Better Auth:

```bash
openssl rand -base64 32
```

Add it to your `.env.local` file:
```
BETTER_AUTH_SECRET="your_random_secret_key_here"
```

## 5. Database Setup

Make sure your database is set up and the DATABASE_URL is configured in your `.env.local` file.

Run the Prisma migration to create the auth tables:

```bash
npx prisma db push
```

## 6. Start the Application

```bash
npm run dev
```

## Routes

- `/landing` - Landing page
- `/auth` - Login/Register page
- `/dashboard` - Protected dashboard (requires authentication)

## Features

- Email/password authentication
- Google OAuth
- GitHub OAuth
- Protected routes with middleware
- User session management
- Responsive DaisyUI design