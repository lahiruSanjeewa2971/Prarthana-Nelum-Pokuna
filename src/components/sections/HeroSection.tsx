'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Dynamically import ParticleCanvas for code splitting and SSR safety
const ParticleCanvas = dynamic(
  () => import('@/components/three/ParticleCanvas').then(mod => ({ default: mod.ParticleCanvas })),
  { 
    ssr: false, // Don't render on server
    loading: () => null // No loading state needed
  }
);

export function HeroSection() {
  // Device detection for adaptive particle rendering
  const { shouldReduceMotion, isLowEnd } = useDeviceDetection();
  const showParticles = !shouldReduceMotion && !isLowEnd;

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Layer 0: Background Image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      
      {/* Layer 1: Floating Lotus Petals (Three.js Canvas) */}
      {showParticles && (
        <ErrorBoundary>
          <ParticleCanvas />
        </ErrorBoundary>
      )}
      
      {/* Layer 2: Content (Text & Buttons) */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] text-primary-foreground/70 mb-6"
          >
            Welcome to
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6"
          >
            Prarthana Nelum Pokuna
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-primary-foreground/90 max-w-2xl mb-12"
          >
            Your premier destination for unforgettable events and celebrations. Book your perfect venue with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
          >
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-6 text-base"
            >
              <Link href="/booking">Book Your Event</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-primary-foreground/30 text-black hover:bg-primary-foreground/10 hover:border-primary-foreground/50 px-8 py-6 text-base"
            >
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
