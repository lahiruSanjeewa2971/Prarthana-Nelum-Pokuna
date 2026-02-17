'use client';

import { motion } from 'framer-motion';
import { Building2, Utensils, Flower2, Users } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  map_link: string | null;
}

interface AboutContentProps {
  hotel: Hotel;
}

const aboutFeatures = [
  {
    title: "Elegant Venues",
    description: "Multiple indoor and outdoor spaces designed to host events of any scale, from intimate gatherings of 20 to grand celebrations of 500 guests.",
    icon: "building",
  },
  {
    title: "Exquisite Cuisine",
    description: "Our award-winning culinary team crafts menus featuring authentic Sri Lankan flavours and international dishes, tailored to your preferences.",
    icon: "utensils",
  },
  {
    title: "Lotus Pond Setting",
    description: "Our signature lotus pond provides a breathtaking backdrop, creating an atmosphere of tranquility and natural beauty for your special day.",
    icon: "flower",
  },
  {
    title: "Dedicated Team",
    description: "From planning to execution, our experienced event coordinators work closely with you to bring your vision to life, ensuring every detail is perfect.",
    icon: "users",
  },
];

const iconMap: Record<string, any> = {
  building: Building2,
  utensils: Utensils,
  flower: Flower2,
  users: Users,
};

export function AboutContent({ hotel }: AboutContentProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Discover the story behind {hotel.name}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80"
                alt={`${hotel.name} venue`}
                className="rounded-lg shadow-lg w-full h-72 object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-display text-2xl font-bold mb-4 text-foreground">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {hotel.description || 'A serene and elegant venue for your special moments.'}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a passion for hospitality and a deep respect for
                tradition, we have been serving families and organizations
                across Sri Lanka for over two decades. Our lotus-inspired
                architecture and lush gardens create a setting that is both
                majestic and intimate.
              </p>
              
              {/* Contact Information */}
              {(hotel.address || hotel.phone || hotel.email) && (
                <div className="mt-6 space-y-2 text-sm">
                  {hotel.address && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Address:</span> {hotel.address}
                    </p>
                  )}
                  {hotel.phone && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Phone:</span> {hotel.phone}
                    </p>
                  )}
                  {hotel.email && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Email:</span> {hotel.email}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              What We Offer
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for an unforgettable event
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {aboutFeatures.map((feature, i) => {
              const Icon = iconMap[feature.icon] || Building2;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-1 text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
