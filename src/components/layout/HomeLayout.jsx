import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
const HomeLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export default HomeLayout;
