import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/AdminToastContext';
import { categoryService } from '../services/categoryService';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import Button from '../components/Button';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ImagePreview from '../components/ImagePreview';
import Input from '../components/Input';

const CategoryManagement = () => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      showToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    } else {
      // Check duplicate category name (case-insensitive)
      const isDuplicate = categories.some(
        (c) =>
          c.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          (!selectedCategory || c.id !== selectedCategory.id)
      );
      if (isDuplicate) {
        errors.name = 'A category with this name already exists';
      }
    }

    if (!formData.image.trim()) {
      errors.image = 'Category image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.image)) {
      errors.image = 'Please enter a valid HTTP/HTTPS URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setFormData({ name: '', image: '' });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      image: category.image,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitLoading(true);
    try {
      if (selectedCategory) {
        // Edit mode
        await categoryService.updateCategory(selectedCategory.id, formData, token);
        showToast('Category updated successfully!', 'success');
      } else {
        // Create mode
        await categoryService.createCategory(formData, token);
        showToast('Category created successfully!', 'success');
      }
      setIsFormOpen(false);
      loadCategories();
    } catch (err) {
      showToast('An error occurred. Please verify your connection or authorization.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitLoading(true);
    try {
      await categoryService.deleteCategory(selectedCategory.id, token);
      showToast('Category deleted successfully!', 'success');
      setIsDeleteOpen(false);
      loadCategories();
    } catch (err) {
      showToast('Failed to delete category. Make sure you are authenticated.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Search Filter
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Preview',
      render: (item) => <ImagePreview src={item.image} alt={item.name} />,
      className: 'w-24',
    },
    {
      header: 'Category Name',
      key: 'name',
      render: (item) => <span className="font-bold text-slate-200">{item.name}</span>,
    },
    {
      header: 'Created At',
      render: (item) => (
        <span className="text-slate-500">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
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
            title="Edit Category"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => handleOpenDelete(item)}
            className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
            title="Delete Category"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
            Category Management
          </h1>
          <p className="text-slate-550 text-xs mt-0.5">
            Configure food classification collections for BiteDash delivery menu
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleOpenCreate}
        >
          Add Category
        </Button>
      </section>

      {/* Filter and Search actions */}
      <section className="flex items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by category name..."
        />
        <div className="text-xs text-slate-500 font-bold uppercase select-none">
          {filteredCategories.length} Categories
        </div>
      </section>

      {/* Main Table view */}
      <section>
        <DataTable
          columns={columns}
          data={filteredCategories}
          loading={loading}
          emptyMessage="No Categories Available"
          emptySubMessage="Create your first food classification catalog item to get started."
        />
      </section>

      {/* Create / Edit Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? 'Edit Category' : 'Create Category'}
        onSubmit={handleSubmit}
        loading={submitLoading}
        submitText={selectedCategory ? 'Save Changes' : 'Create Category'}
      >
        <div className="space-y-4">
          <Input
            name="name"
            label="Category Name"
            placeholder="e.g. Italian Pizza"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
          />
          <Input
            name="image"
            label="Category Image URL"
            placeholder="https://example.com/pizza.jpg"
            value={formData.image}
            onChange={handleInputChange}
            error={formErrors.image}
          />

          {/* Inline Live Preview */}
          {formData.image && !formErrors.image && (
            <div className="pt-2">
              <span className="block text-2xs font-bold text-slate-500 uppercase mb-2">Image Preview</span>
              <ImagePreview
                src={formData.image}
                alt="Form Preview"
                className="w-full h-36 rounded-xl border border-slate-800"
              />
            </div>
          )}
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={selectedCategory?.name}
        loading={submitLoading}
        message="Are you sure you want to delete the food category"
      />
    </div>
  );
};

export default CategoryManagement;
