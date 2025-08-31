# Book Library

A beautiful, animated book library built with Next.js, Supabase, and Framer Motion.

## Features

- 🎬 Video preloader with animated text
- 📚 Scattered books visualization (main page)
- 🔍 Real-time search functionality
- 📱 Mobile responsive design
- ✨ Smooth animations and transitions
- 🔗 External book links
- 🎯 SEO optimized

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema in your Supabase SQL editor
   - Add your Supabase URL and anon key to `.env.local`

3. **Create `.env.local` file:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Database Schema

Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT NOT NULL,
  external_link TEXT NOT NULL,
  isbn VARCHAR(13),
  published_year INTEGER,
  genre VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_books_title_author ON books USING gin(to_tsvector('english', title || ' ' || author));
CREATE INDEX idx_books_genre ON books(genre);
```

## Sample Data

Insert some sample books to test the application:

```sql
INSERT INTO books (title, author, description, cover_image_url, external_link, published_year, genre) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 'https://www.amazon.com/Great-Gatsby-F-Scott-Fitzgerald/dp/0743273567', 1925, 'Fiction'),
('To Kill a Mockingbird', 'Harper Lee', 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'https://www.amazon.com/Kill-Mockingbird-Harper-Lee/dp/0446310786', 1960, 'Fiction'),
('1984', 'George Orwell', 'A dystopian novel about totalitarianism and surveillance society.', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 'https://www.amazon.com/1984-Signet-Classics-George-Orwell/dp/0451524934', 1949, 'Dystopian');
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page with preloader
│   ├── search/page.tsx     # Search results
│   └── book/[id]/page.tsx  # Book details
├── components/
│   ├── VideoPreloader.tsx  # Loading animation
│   ├── ScatteredBooksPage.tsx # Main page
│   ├── Navbar.tsx          # Navigation
│   └── BookCard.tsx        # Book component
└── lib/
    └── supabase.ts         # Database client
```

## Customization

- Modify colors in `tailwind.config.ts`
- Adjust animations in `components/`
- Update SEO metadata in `src/app/layout.tsx`
- Customize the preloader in `VideoPreloader.tsx`

## Deployment

1. **Deploy to Vercel:**
   ```bash
   npm run build
   ```
   
2. **Add environment variables in Vercel dashboard**
3. **Deploy and enjoy!**

## Features in Detail

### Video Preloader
- Animated book icon with rotation
- Typing animation for text
- Progress bar animation
- Smooth transition to main page

### Scattered Books Page
- Random positioning and rotation of books
- Hover animations with lift effect
- Responsive grid layout
- Search functionality in navbar

### Search Results
- Real-time search with Supabase
- Clean grid layout
- Loading states
- No results handling

### Book Details
- Full book information display
- External link to purchase/read
- Responsive design
- Smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own book library!
