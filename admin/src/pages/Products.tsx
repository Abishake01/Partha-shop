import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productApi, categoryApi, brandApi } from '../services/api';
import toast from 'react-hot-toast';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Products() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
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
    (data: typeof formData) => productApi.createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        setShowForm(false);
        resetForm();
        toast.success('Product created');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create product');
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => productApi.updateProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        toast.success('Product updated');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update product');
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
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      stock: parseInt(formData.stock),
      images: formData.images,
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
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
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands?.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs (one per line)
                </label>
                <textarea
                  value={formData.images.join('\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value.split('\n').filter((url) => url.trim()),
                    })
                  }
                  className="input"
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
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

