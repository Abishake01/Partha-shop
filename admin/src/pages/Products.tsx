import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productApi, categoryApi, brandApi } from '../services/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Products() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    images: [] as string[],
    specifications: {} as Record<string, any>,
    categoryId: '',
    brandId: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' });
  const [newBrand, setNewBrand] = useState({ name: '', description: '', image: '' });

  const { data: productsData, isLoading } = useQuery(
    'admin-products',
    () => productApi.getProducts({ limit: 50 }),
    { select: (res) => res.data.data }
  );

  const { data: categories } = useQuery('categories', () => categoryApi.getCategories(), {
    select: (res) => res.data.data,
  });

  const { data: brands } = useQuery('brands', () => brandApi.getBrands(), {
    select: (res) => res.data.data,
  });

  const createCategoryMutation = useMutation(
    (data: typeof newCategory) => categoryApi.createCategory(data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('categories');
        setFormData({ ...formData, categoryId: response.data.data.id });
        setShowCategoryForm(false);
        setNewCategory({ name: '', description: '', image: '' });
        toast.success('Category created and selected');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create category');
      },
    }
  );

  const createBrandMutation = useMutation(
    (data: typeof newBrand) => brandApi.createBrand(data),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('brands');
        setFormData({ ...formData, brandId: response.data.data.id });
        setShowBrandForm(false);
        setNewBrand({ name: '', description: '', image: '' });
        toast.success('Brand created and selected');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create brand');
      },
    }
  );

  const deleteMutation = useMutation((id: string) => productApi.deleteProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('admin-products');
      toast.success('Product deleted');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const createMutation = useMutation(
    async (data: typeof formData) => {
      const formDataToSend = new FormData();
      formDataToSend.append('name', data.name);
      formDataToSend.append('description', data.description);
      formDataToSend.append('price', data.price);
      if (data.discountPrice) formDataToSend.append('discountPrice', data.discountPrice);
      formDataToSend.append('stock', data.stock);
      formDataToSend.append('categoryId', data.categoryId);
      formDataToSend.append('brandId', data.brandId);
      if (data.images.length > 0) {
        formDataToSend.append('images', JSON.stringify(data.images));
      }
      if (Object.keys(data.specifications).length > 0) {
        formDataToSend.append('specifications', JSON.stringify(data.specifications));
      }
      
      // Append uploaded files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        setShowForm(false);
        resetForm();
        setUploadedFiles([]);
        setImagePreviewUrls([]);
        toast.success('Product created');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create product');
      },
    }
  );

  const updateMutation = useMutation(
    async ({ id, data }: { id: string; data: any }) => {
      const formDataToSend = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === 'images' && Array.isArray(data[key])) {
          formDataToSend.append('images', JSON.stringify(data[key]));
        } else if (key === 'specifications') {
          formDataToSend.append('specifications', JSON.stringify(data[key]));
        } else if (data[key] !== undefined && data[key] !== null) {
          formDataToSend.append(key, data[key]);
        }
      });

      // Append new uploaded files
      uploadedFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        setUploadedFiles([]);
        setImagePreviewUrls([]);
        toast.success('Product updated');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update product');
      },
    }
  );

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      images: [],
      specifications: {},
      categoryId: '',
      brandId: '',
    });
    setUploadedFiles([]);
    setImagePreviewUrls([]);
    setSpecKey('');
    setSpecValue('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
    
    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviewUrls.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setImagePreviewUrls(newPreviews);
  };

  const removeUrlImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specKey]: specValue,
        },
      });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      stock: product.stock.toString(),
      images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [],
      specifications: product.specifications || {},
      categoryId: product.categoryId,
      brandId: product.brandId,
    });
    setUploadedFiles([]);
    setImagePreviewUrls([]);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: formData.price,
      discountPrice: formData.discountPrice || undefined,
      stock: formData.stock,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 pr-8">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.categoryId || ''}
                      onChange={(e) => {
                        if (e.target.value === 'new') {
                          setShowCategoryForm(true);
                          // Reset to empty so it doesn't show "new" as selected
                          setTimeout(() => {
                            const select = e.target as HTMLSelectElement;
                            select.value = formData.categoryId || '';
                          }, 0);
                        } else {
                          setFormData({ ...formData, categoryId: e.target.value });
                        }
                      }}
                      className="input flex-1"
                      required={!showCategoryForm}
                    >
                      <option value="">Select Category</option>
                      {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="new">+ Create New Category</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <div className="flex gap-2">
                  <select
                    value={formData.brandId || ''}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setShowBrandForm(true);
                        // Reset to empty so it doesn't show "new" as selected
                        setTimeout(() => {
                          const select = e.target as HTMLSelectElement;
                          select.value = formData.brandId || '';
                        }, 0);
                      } else {
                        setFormData({ ...formData, brandId: e.target.value });
                      }
                    }}
                    className="input flex-1"
                    required={!showBrandForm}
                  >
                    <option value="">Select Brand</option>
                    {brands?.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                    <option value="new">+ Create New Brand</option>
                  </select>
                </div>
              </div>
              {/* Images Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images
                </label>
                
                {/* Upload Files */}
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can select multiple images (max 10)</p>
                </div>

                {/* Image Previews */}
                {(imagePreviewUrls.length > 0 || formData.images.length > 0) && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {imagePreviewUrls.map((preview, index) => (
                      <div key={`preview-${index}`} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.images.map((url, index) => (
                      <div key={`url-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-200"
                        />
                        <button
                          onClick={() => removeUrlImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* URL Input */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Or Add Image URLs (one per line)</label>
                  <textarea
                    value={formData.images.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        images: e.target.value.split('\n').filter((url) => url.trim()),
                      })
                    }
                    className="input"
                    rows={2}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  />
                </div>
              </div>

              {/* Specifications Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <div className="space-y-2 mb-4">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <span className="font-medium text-sm">{key}:</span>
                        <span className="text-sm text-gray-600 ml-2">{String(value)}</span>
                      </div>
                      <button
                        onClick={() => removeSpecification(key)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Specification name (e.g., RAM)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="input flex-1"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 8GB)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="btn-secondary whitespace-nowrap"
                  >
                    Add Spec
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="btn-primary" disabled={createMutation.isLoading || updateMutation.isLoading}>
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowCategoryForm(false);
                setNewCategory({ name: '', description: '', image: '' });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 pr-8">Create New Category</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCategoryMutation.mutate(newCategory);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="input"
                  required
                  placeholder="e.g., Smartphones"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Category description (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  className="input"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={createCategoryMutation.isLoading}
                >
                  {createCategoryMutation.isLoading ? 'Creating...' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setNewCategory({ name: '', description: '', image: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Brand Modal */}
      {showBrandForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowBrandForm(false);
                setNewBrand({ name: '', description: '', image: '' });
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 pr-8">Create New Brand</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createBrandMutation.mutate(newBrand);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                <input
                  type="text"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  className="input"
                  required
                  placeholder="e.g., Apple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newBrand.description}
                  onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Brand description (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newBrand.image}
                  onChange={(e) => setNewBrand({ ...newBrand, image: e.target.value })}
                  className="input"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={createBrandMutation.isLoading}
                >
                  {createBrandMutation.isLoading ? 'Creating...' : 'Create Brand'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBrandForm(false);
                    setNewBrand({ name: '', description: '', image: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productsData?.products?.map((product: any) => (
                <tr key={product.id}>
                  <td className="font-medium">{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td>{product.brand?.name}</td>
                  <td>₹{parseFloat(product.price.toString()).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

