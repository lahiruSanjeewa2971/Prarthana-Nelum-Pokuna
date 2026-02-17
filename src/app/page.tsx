import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { CTASection } from "@/components/sections/CTASection";
import { getFunctionTypes } from "@/lib/fetchers/server";
import { getServerSideAuth } from "@/lib/auth-helpers";
import { redirect } from "next/navigation";

/**
 * Home Page - Server Component
 * 
 * Checks authentication status:
 * - If authenticated (valid token) → Redirects to admin dashboard
 * - If not authenticated or expired token → Shows public landing page
 * 
 * Data is cached and revalidated every hour using Next.js ISR.
 */

// ISR Configuration - Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export default async function HomePage() {
  // Check authentication status
  const admin = await getServerSideAuth();
  
  // If user is authenticated with valid token, redirect to admin dashboard
  if (admin) {
    redirect('/admin/dashboard');
  }
  
  // User is not authenticated or token is expired - show public landing page
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
