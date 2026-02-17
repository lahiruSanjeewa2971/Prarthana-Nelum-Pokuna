import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CTASection } from "@/components/sections/CTASection";
import { getFunctionTypes } from "@/lib/fetchers/server";

/**
 * Home Page - Server Component
 * 
 * This page fetches function types data server-side for optimal performance.
 * Data is cached and revalidated every hour using Next.js ISR.
 */

// ISR Configuration - Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch function types server-side (direct DB access, no HTTP overhead)
  const functionTypes = await getFunctionTypes();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        <ServicesSection services={functionTypes} />
      </main>

      <Footer />
    </div>
  );
}
