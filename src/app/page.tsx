"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, Users, Shield, Clock, CalendarDays, MapPin, Star } from "lucide-react";
import {motion} from 'framer-motion';
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: CalendarDays,
    title: "Effortless Booking",
    description: "Reserve your perfect venue in just a few clicks with our simple booking system.",
  },
  {
    icon: Star,
    title: "Premium Experience",
    description: "Every event is curated with attention to detail, from décor to cuisine.",
  },
  {
    icon: Users,
    title: "Any Occasion",
    description: "Weddings, birthdays, corporate events — we cater to every celebration.",
  },
  {
    icon: MapPin,
    title: "Stunning Location",
    description: "Set beside a serene lotus pond, our venue offers a one-of-a-kind ambience.",
  },
];

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = true }: SectionHeadingProps) => {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full bg-primary ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
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
                  className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 px-8 py-6 text-base"
                >
                  <Link href="/gallery">View Gallery</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Why Choose Us"
              subtitle="We bring together exceptional venues, culinary excellence, and warm Sri Lankan hospitality."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-lg p-6 text-center shadow-sm border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <f.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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

        {/* Available Functions Preview */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We cater to a variety of events and celebrations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences', 'Anniversaries', 'Other Events'].map((service) => (
                <div
                  key={service}
                  className="p-6 rounded-lg border bg-card text-center transition-all hover:shadow-lg hover:border-primary/50"
                >
                  <h3 className="text-lg font-semibold mb-2">{service}</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional service for your special occasion
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
