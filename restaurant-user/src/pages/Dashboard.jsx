import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Star, Clock, Flame, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Sushi', 'Desserts', 'Healthy'];

const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: 'Pepperoni Express',
    category: 'Pizza',
    rating: 4.8,
    reviews: 142,
    time: '20-30 mins',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: true,
  },
  {
    id: 2,
    name: 'Burger & Co.',
    category: 'Burgers',
    rating: 4.6,
    reviews: 98,
    time: '15-25 mins',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: true,
  },
  {
    id: 3,
    name: 'Wasabi Palace',
    category: 'Sushi',
    rating: 4.9,
    reviews: 215,
    time: '30-40 mins',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: false,
  },
  {
    id: 4,
    name: 'Sweet Tooth Bakery',
    category: 'Desserts',
    rating: 4.7,
    reviews: 87,
    time: '10-20 mins',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: false,
  },
  {
    id: 5,
    name: 'The Green Garden',
    category: 'Healthy',
    rating: 4.5,
    reviews: 64,
    time: '25-35 mins',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: true,
  },
  {
    id: 6,
    name: 'Pizza Di Roma',
    category: 'Pizza',
    rating: 4.4,
    reviews: 110,
    time: '25-35 mins',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    featured: false,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = MOCK_RESTAURANTS.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Hero Welcome Banner */}
      <section className="bg-slate-950 py-12 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={12} />
              <span>Premium Food Delivery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              Welcome, {user?.fullName || 'Foodie'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-lg leading-relaxed">
              Discover local favorites and get your favorite dishes delivered hot and fresh in minutes.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search dishes or restaurants..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border-slate-800"
            />
          </div>
        </div>
      </section>

      {/* Category Slider */}
      <section className="max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-amber-500" />
            <h3 className="text-base font-bold text-slate-200">Categories</h3>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-850 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Restaurant Listings */}
      <section className="max-w-7xl mx-auto w-full px-6 pb-16 flex-1">
        <div className="flex items-center gap-2 mb-6">
          <Flame size={20} className="text-amber-500" />
          <h3 className="text-lg font-bold text-slate-200">Popular Near You</h3>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/40 border border-slate-850 rounded-2xl p-8 max-w-md mx-auto">
            <ShieldAlert size={36} className="text-slate-500 mb-3" />
            <h4 className="font-semibold text-slate-350 text-base mb-1">No Restaurants Found</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any results matching "{searchQuery}". Try selecting another category or refining your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((res) => (
              <div
                key={res.id}
                className="group bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={res.image}
                    alt={res.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  {res.featured && (
                    <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      Featured
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" />
                    {res.time}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {res.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span>{res.rating}</span>
                      <span className="text-slate-500">({res.reviews})</span>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-250 mb-2 group-hover:text-amber-400 transition-colors">
                    {res.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    High quality local ingredients curated into masterfully created dishes.
                  </p>
                  <Button variant="secondary" size="sm" className="w-full justify-center">
                    View Menu
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
