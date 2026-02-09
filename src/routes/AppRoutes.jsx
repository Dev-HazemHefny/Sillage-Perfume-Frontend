
import HomeLayout from '../components/layout/HomeLayout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/home/Home';
import AdminLayout from '../components/layout/AdminLayout';
import Products from '../pages/home/Products';
import Cart from '../pages/home/Cart';
import NotFound from '../components/common/NotFound';
import Login from '../pages/auth/Login';

const router = createBrowserRouter([
    //public routes
{
    path: "/",
    element: <HomeLayout />,
    children: [
           { 
          index: true, 
          element: <Home /> 
        },
        {
          path: "products",
          element: <Products />,
        },
        {
            path:"cart",
            element: < Cart/>
        }
    ],
},

{
    path: "login",
    element: <Login />,
},
 // 🔒 Protected Admin Routes
//   {
//     path: "admin",       // ✅ /admin مش لازم / في الأول
//     element: (
//       <ProtectedRoute allowedRoles={['admin']}>
//         <AdminLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       {
//         index: true,
//         element: <AdminDashboard />,
//       },
//       {
//         path: "users",   // ✅ يبقى /admin/users
//         element: <UsersManagement />,
//       },
//       {
//         path: "settings",
//         element: <AdminSettings />,
//       },
//     ],
//   },
{
    path: "*",
    element: <NotFound />,  
}
])
  function AppRoutes() {
    return (
      <RouterProvider router={router} />
    )
}

export default AppRoutes;
