import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categoryService } from '../services/categoryService';
import { recipeService } from '../services/recipeService';
import { Star, Clock, Plus, ArrowLeft, ShieldAlert, Search } from 'lucide-react';
import Button from '../components/Button';

const CategoryRecipes = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [category, setCategory] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        setError('');
        // Fetch all categories to find details of the selected one
        const cats = await categoryService.getCategories();
        const currentCat = cats.find((c) => c.id === id);
        
        if (currentCat) {
          setCategory(currentCat);
        } else {
          setError('Category not found.');
          setLoading(false);
          return;
        }

        // Fetch recipes filtered by category ID
        const categoryRecipes = await recipeService.getRecipesByCategory(id);
        setRecipes(categoryRecipes);
      } catch (err) {
        console.error('Failed to load category menu:', err);
        setError('Unable to fetch recipes for this category.');
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [id]);

  // Filter recipes based on category-local search query
  const filteredRecipes = recipes.filter((r) => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.ingredients && r.ingredients.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Menu Category...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 bg-slate-950">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl max-w-md text-center flex flex-col items-center gap-3">
          <ShieldAlert size={40} />
          <h3 className="font-bold text-slate-200">Something Went Wrong</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <Link to="/">
            <Button size="sm" className="mt-4" icon={ArrowLeft}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 pb-20">
      {/* Category Banner Header */}
      {category && (
        <section className="relative h-64 bg-slate-900 border-b border-slate-900 overflow-hidden flex items-center">
          <div className="absolute inset-0 z-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>
          
          <div className="max-w-7xl mx-auto w-full px-6 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-450 hover:text-slate-200 hover:border-slate-800 transition-all"
                title="Go back to Dashboard"
              >
                <ArrowLeft size={16} />
              </Link>
              <div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
                  Menu Category
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
                  {category.name}
                </h1>
              </div>
            </div>
            
            <div className="w-full md:w-80 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search size={14} />
              </div>
              <input
                type="text"
                placeholder={`Search inside ${category.name}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 text-slate-250 text-xs rounded-xl pl-9.5 pr-4 py-2.5 outline-none focus:border-amber-500 transition-colors shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Recipes Listing */}
      <section className="max-w-7xl mx-auto w-full px-6 mt-12">
        {filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-900/40 border border-slate-850 rounded-3xl p-8 max-w-md mx-auto">
            <ShieldAlert size={36} className="text-slate-600 mb-3" />
            <h4 className="font-semibold text-slate-355 text-base mb-1">
              No Recipes Available
            </h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any dishes in this category matching your search.
            </p>
            <Link to="/" className="mt-6">
              <Button variant="outline" size="sm" className="border-slate-800">
                Browse All Categories
              </Button>
            </Link>
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
                      {category?.name}
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

export default CategoryRecipes;
