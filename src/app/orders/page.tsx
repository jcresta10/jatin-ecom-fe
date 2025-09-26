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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const pageSize = 10;

  const fetchOrders = async (pageNumber: number = 1, searchTerm: string = '') => {
    setLoading(true);
    try {
      const data: OrdersResponse = await api.getOrders(pageNumber, pageSize, searchTerm);
      setOrders(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, search);
  }, [search]);

  const handleOrderCreated = () => {
    setShowCreateForm(false);
    fetchOrders(1, search);
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchOrders(page - 1, search);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      fetchOrders(page + 1, search);
    }
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

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-gray-950"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages || loading}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-gray-950"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}