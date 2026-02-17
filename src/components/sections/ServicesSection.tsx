'use client';

import { motion } from 'framer-motion';
import type { FunctionType } from '@/app/types/domain';

interface ServicesSectionProps {
  services: FunctionType[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  // Format price to LKR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We cater to a variety of events and celebrations with competitive pricing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="p-6 rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{service.name}</h3>
                <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {formatPrice(Number(service.price))}
                </span>
              </div>
              {service.description && (
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
