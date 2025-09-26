import { useState, useEffect } from 'react';
import { CreateOrderRequest, Product, User } from '@/types/order';
import { api } from '@/services/api';

interface CreateOrderFormProps {
    onOrderCreated: () => void;
    onCancel: () => void;
}



export default function CreateOrderForm({ onOrderCreated, onCancel }: CreateOrderFormProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userId, setUserId] = useState('');
    const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const [productsData, usersData] = await Promise.all([
                    api.getProducts(),
                    api.getUsers()
                ]);
                setProducts(productsData);
                setUsers(usersData);
                if (usersData.length > 0) {
                    setUserId(usersData[0].id);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

    const addItem = () => {
        if (products.length > 0) {
            setItems([...items, { productId: products[0].id, quantity: 1 }]);
        }
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        if (field === 'quantity') {
            newItems[index] = { ...newItems[index], [field]: parseInt(value) || 1 };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const product = products.find((p: Product) => p.id === item.productId);
            return total + (product?.price || 0) * item.quantity;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.createOrder({
                userId,
                items,
            } as CreateOrderRequest);

            if (!response) {
                throw new Error('Failed to create order');
            }

            onOrderCreated();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-md shadow-lg p-5 overflow-y-auto max-h-[90vh]">

                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Order</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {loadingData && (
                        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                            Loading products and users...
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Customer
                            </label>
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-950"
                                required
                                disabled={loadingData}
                            >
                                {users.map((user: User) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 text-sm font-bold">
                                    Order Items
                                </label>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                >
                                    Add Item
                                </button>
                            </div>

                            {items.map((item, index) => {
                                const product = products.find((p: Product) => p.id === item.productId);
                                return (
                                    <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2 p-2 bg-gray-50 text-gray-950 rounded">
                                        <select
                                            value={item.productId}
                                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                            className="flex-1 px-2 py-1 border rounded min-w-0"
                                            disabled={loadingData}
                                        >
                                            {products.map((product: Product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - ${product.price} (Stock: {product.stock})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-2 sm:flex-none">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                min="1"
                                                max={product?.stock}
                                                className="w-16 sm:w-20 px-2 py-1 border rounded flex-shrink-0"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                                            >
                                                <span className="hidden sm:inline">Remove</span>
                                                <span className="sm:hidden">×</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {items.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-50 rounded">
                                <p className="text-lg font-semibold text-gray-700">
                                    Total: ${calculateTotal().toFixed(2)}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || items.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Order'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}