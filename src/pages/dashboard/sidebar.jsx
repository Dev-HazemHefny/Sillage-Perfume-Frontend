import { useState } from "react";
import { Link, Links } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  //   const menuItems = [
  //     { name: 'Dashboard', icon: '📊', Link: '/admin' },
  //     { name: 'Products', icon: '📁', href: '/admin/products' },
  //     { name: 'Orders', icon: '✓', href: '/admin/orders' },
  //     { name: 'Categories', icon: '👥', href: '/admin/categories' },
  //     { name: 'Settings', icon: '⚙️', href: '#' },
  //   ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {isOpen && <h2 className="text-xl font-bold">Sillage Dashboard</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {isOpen ? "←" : "→"}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 space-y-1 px-2 pt-2 pb-3">
          <Link
            to="/admin"
            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/categories"
            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
          >
            Categories
          </Link>
          <Link
            to="/admin/products"
            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
          >
            Orders
          </Link>
        </nav>
      </div>
    </div>
  );
}
