# Blog Web Application

A modern blog application built with Next.js, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Cloudinary account
- Google OAuth credentials

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/blog-web

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

4. Run the development server:
```bash
npm run dev
```

5. Seed the database with initial data:
```bash
npm run seed
```

The application will be available at `http://localhost:3000`.

## Environment Variables

### MongoDB
- `MONGODB_URI`: Your MongoDB connection string

### NextAuth
- `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies and tokens

### Cloudinary
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

### Google OAuth
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run seed`: Seed the database with initial data

## Tech Stack

- Next.js 15
- TypeScript
- MongoDB with Mongoose
- NextAuth.js for authentication
- Cloudinary for image management
- Tailwind CSS for styling
- React Query for data fetching
- Zod for validation

## Group
- Olt Latifi
- Leart Hyseni