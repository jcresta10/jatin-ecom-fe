'use client';

import { useState, useEffect } from 'react';
import OrderList from '@/components/OrderList';
import CreateOrderForm from '@/components/CreateOrderForm';
import SearchBox from '@/components/SearchBox';
import { Order, OrdersResponse } from '@/types/order';
import { api } from '@/services/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchOrders = async (searchTerm: string = '') => {
    setLoading(true);
    try {
      const data: OrdersResponse = await api.getOrders(1, 10, searchTerm);
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(search);
  }, [search]);

  const handleOrderCreated = () => {
    setShowCreateForm(false);
    fetchOrders(search);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Order
          </button>
        </div>

        <SearchBox onSearch={setSearch} />

        {showCreateForm && (
          <CreateOrderForm
            onOrderCreated={handleOrderCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        <OrderList orders={orders} loading={loading} />
      </div>
    </div>
  );
}