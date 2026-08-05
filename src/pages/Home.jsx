import { useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import FoodCategories from '../components/FoodCategories';
import DealsAndOffers from '../components/DealsAndOffers';
import PopularRestaurants from '../components/PopularRestaurants';
import IndoreLocalities from '../components/IndoreLocalities';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col">
      <HeroBanner searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FoodCategories />
      <DealsAndOffers />
      <PopularRestaurants searchQuery={searchQuery} />
      <IndoreLocalities />
    </div>
  );
}
