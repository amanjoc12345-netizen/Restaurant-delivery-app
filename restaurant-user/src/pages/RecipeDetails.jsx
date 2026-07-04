import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { recipeService } from '../services/recipeService';
import { Star, Clock, Plus, Minus, ArrowLeft, ShieldAlert, ShoppingBag, ListChecks } from 'lucide-react';
import Button from '../components/Button';

const RecipeDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      try {
        setError('');
        const data = await recipeService.getRecipeById(id);
        if (data) {
          setRecipe(data);
        } else {
          setError('Recipe details could not be found.');
        }
      } catch (err) {
        console.error('Failed to load recipe details:', err);
        setError('Failed to retrieve details. The recipe might have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (recipe) {
      addToCart(recipe, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 bg-slate-950 text-slate-400">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Recipe Details...</span>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 bg-slate-950">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl max-w-md text-center flex flex-col items-center gap-3">
          <ShieldAlert size={40} />
          <h3 className="font-bold text-slate-200">Error Loading Dish</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error || 'Unable to display item details.'}</p>
          <Link to="/">
            <Button size="sm" className="mt-4" icon={ArrowLeft}>
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper to split and clean up ingredients
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  // Helper to parse preparation instructions into steps/paragraphs
  const instructionsList = recipe.instructions
    ? recipe.instructions
        .split(/\n+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0)
    : [];

  return (
    <div className="flex-1 bg-slate-950 pb-20">
      {/* Breadcrumb Header Bar */}
      <section className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={16} />
          <span>Back to Menu</span>
        </Link>
      </section>

      {/* Main Details Grid */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Side: Recipe Image */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-850 shadow-2xl relative">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1 border border-slate-800">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span>4.9 (Local Favorite)</span>
            </div>
          </div>
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl">
              <span className="block text-2xs font-bold text-slate-500 uppercase tracking-wider">Prep Time</span>
              <span className="block text-sm font-bold text-slate-200 mt-1 flex items-center justify-center gap-1">
                <Clock size={14} className="text-amber-500" /> 20 mins
              </span>
            </div>
            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl">
              <span className="block text-2xs font-bold text-slate-500 uppercase tracking-wider">Serving</span>
              <span className="block text-sm font-bold text-slate-200 mt-1">1 Portion</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl">
              <span className="block text-2xs font-bold text-slate-500 uppercase tracking-wider">Category</span>
              <span className="block text-xs font-bold text-amber-500 mt-1.5 uppercase truncate tracking-wider px-1">
                {recipe.categoryName || 'General'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Recipe Information & Action Card */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                {recipe.categoryName}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
                {recipe.name}
              </h1>
              <div className="text-2xl font-black text-slate-100 mt-3">
                ${parseFloat(recipe.price).toFixed(2)}
              </div>
            </div>

            <div className="border-t border-slate-900 pt-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShoppingBag size={16} className="text-amber-500" />
                <span>Ingredients</span>
              </h3>
              {ingredientsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No ingredients specified.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  {ingredientsList.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2 bg-slate-900/40 px-3 py-2 rounded-xl border border-slate-900">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-slate-900 pt-6">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ListChecks size={16} className="text-amber-500" />
                <span>Preparation Instructions</span>
              </h3>
              {instructionsList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No instructions specified.</p>
              ) : (
                <ol className="space-y-3.5 text-xs text-slate-400">
                  {instructionsList.map((step, index) => (
                    <li key={index} className="flex gap-3 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                        {index + 1}
                      </span>
                      <p className="flex-1 mt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Cart Interaction Bar */}
          <div className="border-t border-slate-900 pt-6 mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-4 bg-slate-900 border border-slate-850 p-1.5 rounded-2xl">
              <button
                onClick={handleDecrease}
                className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-extrabold text-slate-250 text-sm">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={Plus}
              onClick={handleAddToCart}
              className="flex-1 sm:flex-initial py-3 px-8 text-sm font-bold uppercase tracking-wider"
            >
              Add to Cart - ${(parseFloat(recipe.price) * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RecipeDetails;
