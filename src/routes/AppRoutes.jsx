import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import HomeLayout from "../components/layout/HomeLayout";
import Home from "../pages/home/Home";
import Products from "../pages/home/Products";
import ProductDetails from "../pages/home/ProductDetails";
import Cart from "../pages/home/Cart";
import Login from "../pages/auth/Login";
import NotFound from "../components/common/NotFound";
import AdminLayout from "../components/layout/AdminLayout";
import Dash from "../pages/dashboard/dash";
import AdminProducts from "../pages/dashboard/adminProducts";
import AdminCategories from "../pages/dashboard/adminCategories";
import AdminOrders from "../pages/dashboard/adminOrders";
import AdminRoute from "./AdminRoute";
import { CartProvider } from "../context/CartContext";
import { NotificationProvider } from "../context/NotificationContext";
import Categories from "../pages/home/Categories";
import CategoryProducts from "../pages/home/CategoryProducts";
import TrackOrder from "../pages/home/TrackOrder";
import { WishlistProvider } from "../context/WishlistContext";
import Wishlist from "../pages/home/Wishlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/:id", // ✅ Product Details Route
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "categories/:categoryId",
        element: <CategoryProducts />,
      },
      {
        path: "track-order",
        element: <TrackOrder />
      },
            { path: 'wishlist', element: <Wishlist /> },

    ],
  },
  {
    path: "/admin",
    // element: <AdminLayout />,
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Dash />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "categories",
        element: <AdminCategories />
      },
      {
        path: "orders",
        element: <AdminOrders />
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
                <WishlistProvider>

        <CartProvider>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </CartProvider>
        </WishlistProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default AppRoutes;
