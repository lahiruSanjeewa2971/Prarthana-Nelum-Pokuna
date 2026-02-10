import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Calendar, Users, Shield, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Welcome to <span className="text-primary">Prarthana Nelum Pokuna</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Your premier destination for unforgettable events and celebrations. 
                Book your perfect venue with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book Now
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide exceptional service and amenities to make your event truly special
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-muted-foreground">
                  Simple and quick online booking process for all your events
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Functions</h3>
                <p className="text-muted-foreground">
                  Weddings, conferences, parties, and more - we host it all
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
                <p className="text-muted-foreground">
                  Years of experience delivering exceptional events
                </p>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-muted-foreground">
                  Our team is always ready to assist you with your needs
                </p>
              </div>
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
