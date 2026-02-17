'use client';

import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Star, Users } from 'lucide-react';

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

export function FeaturesSection() {
  return (
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
  );
}
