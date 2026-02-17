import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Filter, X, Loader2, Package, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useFilters } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useNotification } from '../../context/NotificationContext';

const GENDERS = ['Unisex', 'Men', 'Women'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

// ─── Product Form Modal ───────────────────────────────────────────────
function ProductModal({ isOpen, onClose, editProduct = null }) {
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { data: categoriesData } = useCategories();
  const { success: successNotif, error: errorNotif } = useNotification();
  const categories = categoriesData?.data || [];

  // ✅ lowercase to match backend schema exactly
  const GENDERS = ['men', 'women', 'unisex'];
  const SEASONS = ['spring', 'summer', 'fall', 'winter', 'all-season'];

  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    gender: 'unisex',
    season: [],
    category: '',
    tags: '',
    featured: false,
    sizes: [{ size: '', unit: 'ml', price: '', stock: '' }],
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const isPending = creating || updating;

  // ✅ Populate form when editing - runs when editProduct changes
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || '',
        brand: editProduct.brand || '',
        description: editProduct.description || '',
        gender: editProduct.gender || 'unisex',
        season: editProduct.season || [],
        category: editProduct.category?._id || editProduct.category || '',
        tags: editProduct.tags?.join(', ') || '',
        featured: editProduct.featured || false,
        sizes: editProduct.sizes?.map(s => ({
          size: s.size,
          unit: s.unit || 'ml',
          price: s.price,
          stock: s.stock,
        })) || [{ size: '', unit: 'ml', price: '', stock: '' }],
      });
    } else {
      // ✅ Reset form when adding new
      setForm({
        name: '',
        brand: '',
        description: '',
        gender: 'unisex',
        season: [],
        category: '',
        tags: '',
        featured: false,
        sizes: [{ size: '', unit: 'ml', price: '', stock: '' }],
      });
      setImages([]);
    }
    setErrors({});
  }, [editProduct, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.description.trim() || form.description.trim().length < 10)
      e.description = 'Description must be at least 10 characters';
    if (!form.category) e.category = 'Category is required';
    if (!editProduct && images.length === 0) e.images = 'Image is required';
    form.sizes.forEach((s, i) => {
      if (!s.size || Number(s.size) < 1) e[`size_${i}`] = 'Size must be at least 1';
      if (!s.price || Number(s.price) <= 0) e[`price_${i}`] = 'Valid price required';
      if (s.stock === '' || Number(s.stock) < 0) e[`stock_${i}`] = 'Valid stock required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) { errorNotif('Please fix the form errors'); return; }

    const fd = new FormData();

    // ✅ Basic fields
    fd.append('name', form.name.trim());
    fd.append('brand', form.brand.trim());
    fd.append('description', form.description.trim());
    fd.append('gender', form.gender);           // already lowercase
    fd.append('category', form.category);
    fd.append('featured', String(form.featured));

    // ✅ sizes as JSON string (backend does JSON.parse(sizes))
    fd.append('sizes', JSON.stringify(
      form.sizes.map(s => ({
        size: Number(s.size),
        unit: s.unit || 'ml',
        price: Number(s.price),
        stock: Number(s.stock),
      }))
    ));

    // ✅ season as JSON string
    fd.append('season', JSON.stringify(form.season));

    // ✅ tags as JSON string
    const tagsArray = form.tags
      ? form.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : [];
    fd.append('tags', JSON.stringify(tagsArray));

    // ✅ single image - key must be 'image' (multer uploadProductImage field)
    if (images.length > 0) {
      fd.append('image', images[0]);
    }

    const opts = {
      onSuccess: () => {
        successNotif(editProduct ? 'Product updated!' : 'Product created!');
        onClose();
      },
      onError: (err) => {
        console.error('Form error:', err.response?.data);
        const msg = err.response?.data?.errors?.[0]?.msg
          || err.response?.data?.message
          || 'Operation failed';
        errorNotif(msg);
      },
    };

    if (editProduct) {
      updateProduct({ id: editProduct._id, formData: fd }, opts);
    } else {
      createProduct(fd, opts);
    }
  };

  const addSize = () =>
    setForm(p => ({ ...p, sizes: [...p.sizes, { size: '', unit: 'ml', price: '', stock: '' }] }));

  const removeSize = (i) =>
    setForm(p => ({ ...p, sizes: p.sizes.filter((_, idx) => idx !== i) }));

  const updateSize = (i, key, val) =>
    setForm(p => ({ ...p, sizes: p.sizes.map((s, idx) => idx === i ? { ...s, [key]: val } : s) }));

  const toggleSeason = (s) =>
    setForm(p => ({
      ...p,
      season: p.season.includes(s)
        ? p.season.filter(x => x !== s)
        : [...p.season, s],
    }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {editProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name & Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
                  <input
                    value={form.name}
                    onChange={e => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200`}
                    placeholder="Product name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Brand *</label>
                  <input
                    value={form.brand}
                    onChange={e => { setForm(p => ({ ...p, brand: e.target.value })); if (errors.brand) setErrors(p => ({ ...p, brand: '' })); }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.brand ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200`}
                    placeholder="Brand name"
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description * (min 10 chars)</label>
                <textarea
                  value={form.description}
                  onChange={e => { setForm(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })); }}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.description ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 resize-none`}
                  placeholder="Product description (minimum 10 characters)"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => { setForm(p => ({ ...p, category: e.target.value })); if (errors.category) setErrors(p => ({ ...p, category: '' })); }}
                    className={`w-full px-4 py-2.5 rounded-xl border ${errors.category ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200`}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                  >
                    {/* ✅ lowercase values */}
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Season - ✅ lowercase values matching schema */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'spring', label: 'Spring' },
                    { value: 'summer', label: 'Summer' },
                    { value: 'fall', label: 'Fall' },      // ✅ "fall" not "Autumn"
                    { value: 'winter', label: 'Winter' },
                    { value: 'all-season', label: 'All Season' },
                  ].map(s => (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() => toggleSeason(s.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        form.season.includes(s.value)
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (comma separated)</label>
                  <input
                    value={form.tags}
                    onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="woody, floral, oud"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
                      className={`w-12 h-6 rounded-full transition-all ${form.featured ? 'bg-purple-600' : 'bg-gray-200'} relative cursor-pointer`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.featured ? 'left-7' : 'left-1'}`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Sizes *</label>
                  <button type="button" onClick={addSize}
                    className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Size
                  </button>
                </div>

                {/* Size table header */}
                <div className="grid grid-cols-4 gap-3 mb-2">
                  {['Size (ml)', 'Unit', 'Price ($)', 'Stock'].map(h => (
                    <p key={h} className="text-xs text-gray-500 font-medium">{h}</p>
                  ))}
                </div>

                <div className="space-y-3">
                  {form.sizes.map((size, i) => (
                    <div key={i} className="grid grid-cols-4 gap-3 items-start">
                      <div>
                        <input
                          type="number" min="1" placeholder="e.g. 50"
                          value={size.size}
                          onChange={e => { updateSize(i, 'size', e.target.value); if (errors[`size_${i}`]) setErrors(p => ({ ...p, [`size_${i}`]: '' })); }}
                          className={`w-full px-3 py-2.5 rounded-xl border ${errors[`size_${i}`] ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 text-sm`}
                        />
                        {errors[`size_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`size_${i}`]}</p>}
                      </div>
                      {/* ✅ Only "ml" allowed by schema */}
                      <div className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 text-center">
                        ml
                      </div>
                      <div>
                        <input
                          type="number" min="0" step="0.01" placeholder="e.g. 99.99"
                          value={size.price}
                          onChange={e => { updateSize(i, 'price', e.target.value); if (errors[`price_${i}`]) setErrors(p => ({ ...p, [`price_${i}`]: '' })); }}
                          className={`w-full px-3 py-2.5 rounded-xl border ${errors[`price_${i}`] ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 text-sm`}
                        />
                        {errors[`price_${i}`] && <p className="text-red-500 text-xs mt-1">{errors[`price_${i}`]}</p>}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number" min="0" placeholder="e.g. 100"
                          value={size.stock}
                          onChange={e => { updateSize(i, 'stock', e.target.value); if (errors[`stock_${i}`]) setErrors(p => ({ ...p, [`stock_${i}`]: '' })); }}
                          className={`w-full px-3 py-2.5 rounded-xl border ${errors[`stock_${i}`] ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 text-sm`}
                        />
                        {form.sizes.length > 1 && (
                          <button type="button" onClick={() => removeSize(i)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {editProduct ? 'Update Image (optional)' : 'Image *'}
                </label>

                {/* Show current image when editing */}
                {editProduct?.images?.[0]?.url && !images.length && (
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={editProduct.images[0].url}
                      alt="current"
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                    />
                    <p className="text-xs text-gray-500">Current image — upload new to replace</p>
                  </div>
                )}

                <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  errors.images ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}>
                  <Upload className="w-7 h-7 text-gray-400 mb-1.5" />
                  <span className="text-sm text-gray-500">
                    {images.length > 0 ? `✅ ${images[0].name}` : 'Click to upload image'}
                  </span>
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setImages([e.target.files[0]]);
                        if (errors.images) setErrors(p => ({ ...p, images: '' }));
                      }
                    }}
                  />
                </label>
                {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    : editProduct ? 'Update Product' : 'Create Product'
                  }
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, product, onConfirm, isPending }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete <strong>{product?.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                Cancel
              </button>
              <button onClick={onConfirm} disabled={isPending}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, search: '', category: '', gender: '', sort: '-createdAt' });
  const [searchInput, setSearchInput] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const { data, isLoading } = useProducts(filters);
  const { data: categoriesData } = useCategories();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
  const { success: successNotif } = useNotification();

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const categories = categoriesData?.data || [];

  const handleFilterChange = (key, val) => setFilters(p => ({ ...p, [key]: val, page: 1 }));
  const handleSearch = (e) => { e.preventDefault(); handleFilterChange('search', searchInput); };
  const handleDelete = () => {
    deleteProduct(deleteModal._id, {
      onSuccess: () => { successNotif('Product deleted!'); setDeleteModal(null); }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.totalItems || 0} products total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-wrap gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-48 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm" />
        </form>

        <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm min-w-40">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select value={filters.gender} onChange={e => handleFilterChange('gender', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm">
          <option value="">All Genders</option>
          {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={filters.sort} onChange={e => handleFilterChange('sort', e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm">
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="-name">Name Z-A</option>
        </select>

        {(filters.search || filters.category || filters.gender) && (
          <button onClick={() => { setFilters(p => ({ ...p, search: '', category: '', gender: '', page: 1 })); setSearchInput(''); }}
            className="flex items-center gap-1.5 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Product', 'Brand', 'Category', 'Gender', 'Sizes', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                </td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-16 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No products found</p>
                </td></tr>
              ) : products.map((product) => (
                <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                        alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                        {product.featured && (
                          <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                      {product.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sizes?.length || 0} sizes</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.sizes?.some(s => s.isAvailable) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {product.sizes?.some(s => s.isAvailable) ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditModal(product)}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteModal(product)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
                disabled={filters.page === 1}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setFilters(p => ({ ...p, page }))}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    filters.page === page ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'border border-gray-200 hover:bg-gray-50'
                  }`}>
                  {page}
                </button>
              ))}
              <button onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
                disabled={filters.page === pagination.totalPages}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal isOpen={addModal} onClose={() => setAddModal(false)} />
      <ProductModal isOpen={!!editModal} onClose={() => setEditModal(null)} editProduct={editModal} />
      <DeleteModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} product={deleteModal} onConfirm={handleDelete} isPending={deleting} />
    </div>
  );
}