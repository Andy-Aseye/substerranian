import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "your-supabase-storage-domain.supabase.co",
      "images.unsplash.com",
      "plus.unsplash.com",
      "images.pexels.com",
      "cdn.pixabay.com",
      "via.placeholder.com",
      "covers.openlibrary.org",
      'drive.google.com'
    ],
  },
};

export default nextConfig;
