import React from 'react';
import Sidebar from '../../pages/dashboard/sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
       <>
       <Sidebar/>
       <Outlet />
       </>
    );
}

export default AdminLayout;
