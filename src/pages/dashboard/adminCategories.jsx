import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit2, Trash2, X, Loader2,
  Grid3x3, Upload, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useCategories';
import { useNotification } from '../../context/NotificationContext';

// ─── Category Form Modal ──────────────────────────────────────────────
function CategoryModal({ isOpen, onClose, editCategory = null }) {
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
  const { success: successNotif, error: errorNotif } = useNotification();

  const [form, setForm] = useState({
    name: editCategory?.name || '',
    description: editCategory?.description || '',
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const isPending = creating || updating;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) { errorNotif('Please fix the form errors'); return; }

    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('description', form.description.trim());
    if (image) fd.append('image', image);

    const opts = {
      onSuccess: () => {
        successNotif(editCategory ? 'Category updated!' : 'Category created!');
        onClose();
      },
    };

    if (editCategory) {
      updateCategory({ id: editCategory._id, formData: fd }, opts);
    } else {
      createCategory(fd, opts);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
                <input
                  value={form.name}
                  onChange={e => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 transition-all`}
                  placeholder="Category name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => { setForm(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })); }}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-400' : 'border-gray-200'} outline-none focus:ring-2 focus:ring-purple-200 resize-none transition-all`}
                  placeholder="Category description"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {editCategory ? 'Update Image (optional)' : 'Image'}
                </label>

                {editCategory?.image?.url && !image && (
                  <div className="mb-3">
                    <img src={editCategory.image.url} alt="current" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                    <p className="text-xs text-gray-400 mt-1">Current image</p>
                  </div>
                )}

                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all">
                  <Upload className="w-7 h-7 text-gray-400 mb-1.5" />
                  <span className="text-sm text-gray-500">
                    {image ? image.name : 'Click to upload image'}
                  </span>
                  <input
                    type="file" accept="image/*" className="hidden"
                    onChange={e => setImage(e.target.files[0])}
                  />
                </label>
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
                    : editCategory ? 'Update Category' : 'Create Category'
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

// ─── Delete Modal ─────────────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, category, onConfirm, isPending }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Category</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete <strong>"{category?.name}"</strong>?
              All products in this category may be affected.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
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
export default function AdminCategories() {
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCategories({ page, limit: 12, search });
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();
  const { success: successNotif } = useNotification();

  const categories = data?.data || [];
  const pagination = data?.pagination || {};

  const handleDelete = () => {
    deleteCategory(deleteModal._id, {
      onSuccess: () => {
        successNotif('Category deleted!');
        setDeleteModal(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </motion.button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-purple-200 text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <Grid3x3 className="w-14 h-14 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium text-lg">No categories found</p>
          <p className="text-gray-400 text-sm mt-1">Add your first category to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                  {category.image?.url ? (
                    <img
                      src={category.image.url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Grid3x3 className="w-14 h-14 text-purple-200" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditModal(category)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal(category)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{category.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{category.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2.5 py-1 rounded-full">
                      {category.productsCount || 0} products
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                page === p ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'border border-gray-200 hover:bg-gray-50'
              }`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => p + 1)} disabled={page === pagination.totalPages}
            className="p-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <CategoryModal isOpen={addModal} onClose={() => setAddModal(false)} />
      <CategoryModal isOpen={!!editModal} onClose={() => setEditModal(null)} editCategory={editModal} />
      <DeleteModal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} category={deleteModal} onConfirm={handleDelete} isPending={deleting} />
    </div>
  );
}