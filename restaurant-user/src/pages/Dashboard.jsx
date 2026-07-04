import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { categoryService } from '../services/categoryService';
import { recipeService } from '../services/recipeService';
import { Star, Clock, Flame, ShieldAlert, Sparkles, Plus, Compass } from 'lucide-react';
import Button from '../components/Button';

const Dashboard = () => {
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();

  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories and recipes from Firestore REST service layer
  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');
        const catsData = await categoryService.getCategories();
        setCategories(catsData);
        setLoadingCats(false);

        const recipesData = await recipeService.getRecipes();
        setRecipes(recipesData);
        setLoadingRecipes(false);
      } catch (err) {
        console.error('Failed to load home page content:', err);
        setError('Unable to load menu. Please refresh or check your API configuration.');
        setLoadingCats(false);
        setLoadingRecipes(false);
      }
    };

    loadData();
  }, []);

  // Filter recipes based on header search input
  const filteredRecipes = recipes.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.categoryName && r.categoryName.toLowerCase().includes(q)) ||
      (r.ingredients && r.ingredients.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-16 bg-slate-950">
      
      {/* Hero Welcome Banner */}
      <section className="bg-slate-950 py-16 border-b border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-amber-500/15 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
              <Sparkles size={12} />
              <span>Fresh & Hot Delivery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
              Gourmet Meals <br />
              <span className="text-amber-500">Delivered in Minutes</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-4 max-w-lg leading-relaxed">
              Explore your city's highest-rated recipes. From crispy wood-fired pizzas to fresh, delicate sushi rolls, we deliver flavor straight to your door.
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <a href="#popular-section">
                <Button size="lg" icon={Flame}>Order Popular Now</Button>
              </a>
              <a href="#categories-section">
                <Button variant="outline" size="lg" className="border-slate-800">Browse Categories</Button>
              </a>
            </div>
          </div>
          
          {/* Restaurant Introduction Mock */}
          <div className="relative group max-w-md mx-auto md:mr-0 w-full bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-2xl overflow-hidden hover:border-slate-800 transition-all">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
            <h3 className="text-base font-bold text-slate-200 mb-2.5">BiteDash Kitchens</h3>
            <p className="text-xs text-slate-450 leading-relaxed mb-4">
              We partner with certified local kitchens enforcing strict organic sourcing and premium standards. Every order is prepared by expert culinary staff and dispatched in climate-controlled packages.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-850 pt-4 text-center">
              <div>
                <span className="block text-lg font-bold text-amber-500">4.9 ★</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">User Rating</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-200">20 min</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Avg Time</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-200">100%</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Freshness</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-7xl mx-auto w-full px-6 mt-8">
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3">
            <ShieldAlert size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Featured Categories Section */}
      <section id="categories-section" className="max-w-7xl mx-auto w-full px-6 py-10">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Compass size={18} className="text-amber-500" />
          <span>Featured Categories</span>
        </h3>
        
        {loadingCats ? (
          // Loading Skeletons for Categories
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="w-28 h-28 bg-slate-900 border border-slate-850 rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex flex-col items-center gap-2.5 p-3 w-28 bg-slate-900 border border-slate-850 hover:border-amber-500/30 rounded-2xl transition-all hover:scale-[1.03] flex-shrink-0 shadow-lg text-center"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-950 border border-slate-800 group-hover:border-amber-500/20 transition-colors">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Special Offers Section */}
      <section className="max-w-7xl mx-auto w-full px-6 py-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-slate-950 p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Background Ambient SVG element */}
          <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12">
            <Compass size={240} className="text-white" />
          </div>
          <div>
            <span className="inline-block bg-slate-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
              Weekend Offer
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Get 20% Off Your First Order!
            </h2>
            <p className="text-slate-900 text-xs md:text-sm font-medium mt-1">
              Apply code <strong className="bg-slate-950 text-white px-1.5 py-0.5 rounded text-xs select-all">BITE20</strong> at final checkout.
            </p>
          </div>
          <a href="#popular-section" className="flex-shrink-0 relative z-10">
            <Button size="md" className="bg-slate-950 text-amber-500 hover:bg-slate-900 hover:text-amber-400 focus:ring-slate-950">
              Claim Now
            </Button>
          </a>
        </div>
      </section>

      {/* Recipes Listing (Popular or Search Results) */}
      <section id="popular-section" className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Flame size={18} className="text-amber-500" />
          <span>{searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Dishes'}</span>
        </h3>

        {loadingRecipes ? (
          // Loading Skeletons for Recipes
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-850 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/40 border border-slate-850 rounded-2xl p-8 max-w-md mx-auto">
            <ShieldAlert size={36} className="text-slate-500 mb-3" />
            <h4 className="font-semibold text-slate-350 text-base mb-1">No Dishes Found</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any recipes matching your query. Try typing another search or select a category above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-950 flex-shrink-0">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    loading="lazy"
                  />
                  <span className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" />
                    20 mins
                  </span>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded">
                      {recipe.categoryName}
                    </span>
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <Link to={`/recipe/${recipe.id}`}>
                    <h4 className="text-base font-bold text-slate-200 mb-2 group-hover:text-amber-400 transition-colors">
                      {recipe.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                    {recipe.ingredients}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-850">
                    <span className="text-base font-bold text-slate-100">
                      ${parseFloat(recipe.price).toFixed(2)}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => addToCart(recipe)}
                      className="py-1 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>
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
