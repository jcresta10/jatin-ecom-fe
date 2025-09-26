import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            eCommerce Orders App
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your orders with ease using our comprehensive order management system.
          </p>
          <Link
            href="/orders"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
          >
            Go to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}