'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// Gallery dummy data
const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", alt: "Grand ballroom setup for a wedding", category: "Weddings", description: "Grand ballroom setup for a wedding" },
  { id: 2, src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", alt: "Elegant dining arrangement", category: "Events", description: "Elegant dining arrangement" },
  { id: 3, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", alt: "Outdoor garden venue", category: "Venue", description: "Outdoor garden venue" },
  { id: 4, src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80", alt: "Birthday celebration setup", category: "Celebrations", description: "Birthday celebration setup" },
  { id: 5, src: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80", alt: "Corporate conference hall", category: "Events", description: "Corporate conference hall" },
  { id: 6, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", alt: "Fine dining experience", category: "Dining", description: "Fine dining experience" },
  { id: 7, src: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800&q=80", alt: "Lotus pond view", category: "Venue", description: "Lotus pond view" },
  { id: 8, src: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80", alt: "Evening reception with lights", category: "Weddings", description: "Evening reception with lights" },
  { id: 9, src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80", alt: "Buffet spread", category: "Dining", description: "Buffet spread" },
  { id: 10, src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", alt: "Floral decorations", category: "Celebrations", description: "Floral decorations" },
  { id: 11, src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80", alt: "Outdoor ceremony", category: "Weddings", description: "Outdoor ceremony" },
  { id: 12, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80", alt: "Conference setup", category: "Events", description: "Conference setup" },
];

// Grid layout patterns for masonry effect
const gridLayouts = [
  { size: 'large', span: 'col-span-1 row-span-1' },
  { size: 'normal', span: 'col-span-1 row-span-1' },
  { size: 'wide', span: 'col-span-1 row-span-1' },
  { size: 'normal', span: 'col-span-1 row-span-1' },
  { size: 'tall', span: 'col-span-1 row-span-1' },
  { size: 'normal', span: 'col-span-1 row-span-1' },
];

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  description: string;
}

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-primary-foreground/80 text-lg max-w-xl mx-auto"
          >
            Explore our stunning venue and past events
          </motion.p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
            {galleryImages.map((image, index) => {
              const layout = gridLayouts[index % gridLayouts.length];
              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, zIndex: 10 }}
                  onClick={() => setSelectedImage(image)}
                  className={`group cursor-pointer relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${layout.span} ${
                    layout.size === 'large' ? 'md:col-span-2 md:row-span-2' :
                    layout.size === 'wide' ? 'md:col-span-2' :
                    layout.size === 'tall' ? 'md:row-span-2' :
                    ''
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                    <div className="text-white">
                      <p className="font-bold text-sm md:text-lg mb-1">{image.category}</p>
                      <p className="text-xs md:text-sm text-white/80 line-clamp-2">{image.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-accent transition-colors duration-300 z-10"
                aria-label="Close lightbox"
              >
                <X size={32} />
              </button>
              
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full rounded-2xl shadow-2xl"
              />
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-2xl font-bold">{selectedImage.category}</h3>
                <p className="text-white/80 mt-2">{selectedImage.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
