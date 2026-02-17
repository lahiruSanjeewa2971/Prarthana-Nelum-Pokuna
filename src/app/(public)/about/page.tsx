import { getHotelInfo } from '@/lib/fetchers/server';
import { AboutContent } from '@/components/sections/AboutContent';

export default async function AboutPage() {
  const hotel = await getHotelInfo();

  return <AboutContent hotel={hotel} />;
}
