import { getFunctionTypes } from '@/lib/fetchers/server';
import { BookingForm } from '@/components/forms/BookingForm';

export default async function BookingPage() {
  // Fetch function types server-side for optimal performance
  const allFunctionTypes = await getFunctionTypes();
  
  // Filter only active function types
  const activeFunctionTypes = allFunctionTypes.filter(ft => ft.isActive);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Book Your Event
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Fill in the details below and our team will confirm your reservation
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <BookingForm functionTypes={activeFunctionTypes} />
      </section>
    </div>
  );
}
