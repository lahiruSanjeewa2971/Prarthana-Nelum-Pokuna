'use client';

import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Book Your Event?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Get started today and let us help you create unforgettable memories
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-md bg-background px-8 py-3 text-base font-medium text-foreground transition-colors hover:bg-background/90"
          >
            Book Now
          </Link>
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 px-8 py-3 text-base font-medium transition-colors hover:bg-primary-foreground/10"
          >
            View Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
