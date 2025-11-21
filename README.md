# Pediatric Blue Book

Pediatric Blue Book is a web application designed to help dietitians calculate pediatric nutrient needs and formula recipes more quickly and accurately. The site replaces manual spreadsheet work with a faster and more reliable interface.

The frontend is built with Next.js and TypeScript, deployed on Vercel. The backend uses Supabase for the database, authentication, and storage. The production domain is managed through Namecheap.

## Live Site

Production site: https://pediatricbluebook.com  
Hosted on Vercel.  
Domain purchased and managed through Namecheap.  
Backend database and storage provided by Supabase.

## Purpose

Dietitians often calculate daily nutrient requirements, formula recipes, and nutrition summaries using separate tools or spreadsheets. Pediatric Blue Book centralizes and automates these calculations, making it easier to build accurate nutrition plans for pediatric patients.

## Tech Stack

Framework: Next.js  
Language: TypeScript  
UI: React, Tailwind CSS, shadcn/ui  
Backend: Supabase  
Testing: Jest  
Deployment: Vercel  
Domain: Namecheap  


## Running the Project Locally

### 1. Clone the repository
```
git clone https://github.com/ethanbonsall/Pediatric-Blue-Book.git
cd Pediatric-Blue-Book/web
```

### 2. Install dependencies
```
npm install
```

### 3. Add environment variables
Create a `.env.local` file inside `/web`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=optional_for_local
```

### 4. Start the development server
```
npm run dev
```

The app will be available at http://localhost:3000/

## Testing

Tests are written with Jest and stored in `__tests__/`.

Run all tests:
```
npm test
```

Watch mode:
```
npm run test:watch
```