import { Order } from '@/types/order';

interface OrderListProps {
    orders: Order[];
    loading: boolean;
}

export default function OrderList({ orders, loading }: OrderListProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No orders found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <li key={order.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="text-sm font-medium text-blue-600 truncate">
                                    Order #{order.id.slice(-8)}
                                </p>
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'CONFIRMED'
                                        ? 'bg-green-100 text-green-800'
                                        : order.status === 'PENDING'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">
                                Customer: {order.user.name} ({order.user.email})
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Items: {order.orderItems.map(item =>
                                    `${item.quantity}x ${item.product.name}`
                                ).join(', ')}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}