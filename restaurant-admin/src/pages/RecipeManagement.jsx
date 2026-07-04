import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/AdminToastContext';
import { recipeService } from '../services/recipeService';
import { categoryService } from '../services/categoryService';
import { Plus, Edit2, Trash2, Utensils } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ImagePreview from '../components/ImagePreview';
import Input from '../components/Input';

const RecipeManagement = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    ingredients: '',
    instructions: '',
    price: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, catsData] = await Promise.all([
        recipeService.getRecipes(),
        categoryService.getCategories(),
      ]);
      setRecipes(recsData);
      setCategories(catsData);
    } catch (err) {
      showToast('Failed to load menu details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categoryId') {
      const selectedCat = categories.find((c) => c.id === value);
      setFormData({
        ...formData,
        categoryId: value,
        categoryName: selectedCat ? selectedCat.name : '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Recipe name is required';
    if (!formData.categoryId) errors.categoryId = 'Category selection is required';
    if (!formData.ingredients.trim()) errors.ingredients = 'Ingredients are required';
    if (!formData.instructions.trim()) errors.instructions = 'Preparation instructions are required';
    
    const priceNum = parseFloat(formData.price);
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a positive number';
    }

    if (!formData.image.trim()) {
      errors.image = 'Recipe image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      errors.image = 'Please enter a valid HTTP/HTTPS URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setSelectedRecipe(null);
    setFormData({
      name: '',
      categoryId: '',
      categoryName: '',
      ingredients: '',
      instructions: '',
      price: '',
      image: '',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setFormData({
      name: recipe.name,
      categoryId: recipe.categoryId || '',
      categoryName: recipe.categoryName || '',
      ingredients: recipe.ingredients || '',
      instructions: recipe.instructions || '',
      price: recipe.price !== undefined ? String(recipe.price) : '',
      image: recipe.image || '',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenDelete = (recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (selectedRecipe) {
        // Edit mode
        await recipeService.updateRecipe(selectedRecipe.id, dataToSave, token);
        showToast('Recipe updated successfully!', 'success');
      } else {
        // Create mode
        await recipeService.createRecipe(dataToSave, token);
        showToast('Recipe created successfully!', 'success');
      }
      setIsFormOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to save recipe. Verify connection.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecipe) return;
    setSubmitLoading(true);
    try {
      await recipeService.deleteRecipe(selectedRecipe.id, token);
      showToast('Recipe deleted successfully!', 'success');
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      showToast('Failed to delete recipe. Ensure authorization.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredRecipes = recipes.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilterCategory === '' || rec.categoryId === selectedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      header: 'Preview',
      render: (item) => <ImagePreview src={item.image} alt={item.name} />,
      className: 'w-24',
    },
    {
      header: 'Recipe Name',
      key: 'name',
      render: (item) => (
        <div>
          <span className="font-bold text-slate-200 block">{item.name}</span>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5">
            ID: {item.id}
          </span>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (item) => (
        <span className="px-2 py-0.5 text-2xs font-bold rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
          {item.categoryName || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Price',
      render: (item) => (
        <span className="font-semibold text-slate-200">
          ${parseFloat(item.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      className: 'text-right w-32',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all cursor-pointer"
            title="Edit Recipe"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleOpenDelete(item)}
            className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
            title="Delete Recipe"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Recipe Management
          </h1>
          <p className="text-slate-555 text-xs mt-0.5">
            Configure dishes, ingredients, instruction routines and menu pricing
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Recipe
        </Button>
      </section>

      {/* Search and Filters */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by recipe name..."
          />
          {/* Category Filter */}
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-850 text-slate-300 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500 font-bold uppercase select-none">
          {filteredRecipes.length} Recipes
        </div>
      </section>

      {/* Main Table view */}
      <section>
        <DataTable
          columns={columns}
          data={filteredRecipes}
          loading={loading}
          emptyMessage="No Recipes Available"
          emptySubMessage="Create your first food recipe catalog item to showcase delicious plates."
        />
      </section>

      {/* Create / Edit Form Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedRecipe ? 'Edit Recipe' : 'Create Recipe'}
        onSubmit={handleSubmit}
        loading={submitLoading}
        submitText={selectedRecipe ? 'Save Changes' : 'Create Recipe'}
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <Input
              name="name"
              label="Recipe Name"
              placeholder="e.g. Garlic Butter Chicken"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
            />

            {/* Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full bg-slate-950 border ${
                  formErrors.categoryId ? 'border-rose-500/50' : 'border-slate-850'
                } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <span className="text-[10px] text-rose-400 font-semibold">{formErrors.categoryId}</span>
              )}
            </div>

            <Input
              name="price"
              type="number"
              step="0.01"
              label="Price ($)"
              placeholder="e.g. 14.99"
              value={formData.price}
              onChange={handleInputChange}
              error={formErrors.price}
            />

            <Input
              name="image"
              label="Recipe Image URL"
              placeholder="https://example.com/chicken.jpg"
              value={formData.image}
              onChange={handleInputChange}
              error={formErrors.image}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Ingredients
              </label>
              <textarea
                name="ingredients"
                rows="3"
                placeholder="List ingredients comma-separated (e.g. 500g Chicken breast, 4 cloves garlic, 50g butter)"
                value={formData.ingredients}
                onChange={handleInputChange}
                className={`w-full bg-slate-950 border ${
                  formErrors.ingredients ? 'border-rose-500/50' : 'border-slate-850'
                } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all resize-none`}
              />
              {formErrors.ingredients && (
                <span className="text-[10px] text-rose-400 font-semibold">{formErrors.ingredients}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
                Preparation Instructions
              </label>
              <textarea
                name="instructions"
                rows="4"
                placeholder="Provide step-by-step instructions on cooking the dish"
                value={formData.instructions}
                onChange={handleInputChange}
                className={`w-full bg-slate-950 border ${
                  formErrors.instructions ? 'border-rose-500/50' : 'border-slate-850'
                } text-slate-200 text-xs rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all resize-none`}
              />
              {formErrors.instructions && (
                <span className="text-[10px] text-rose-400 font-semibold">{formErrors.instructions}</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Image Preview (Span both columns at bottom) */}
        {formData.image && !formErrors.image && (
          <div className="pt-2">
            <span className="block text-2xs font-bold text-slate-500 uppercase mb-2">Image Preview</span>
            <ImagePreview
              src={formData.image}
              alt="Form Preview"
              className="w-full h-40 rounded-xl border border-slate-800"
            />
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedRecipe?.name}
        loading={submitLoading}
        message="Are you sure you want to delete the food recipe"
      />
    </div>
  );
};

export default RecipeManagement;
