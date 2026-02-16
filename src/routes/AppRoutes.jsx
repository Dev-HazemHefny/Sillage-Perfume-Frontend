import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

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
import Categories from "../pages/home/Categories";
import CategoryProducts from "../pages/home/CategoryProducts";
import TrackOrder from "../pages/home/TrackOrder";

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
      }
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
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </CartProvider>
    </QueryClientProvider>
  );
}

export default AppRoutes;
