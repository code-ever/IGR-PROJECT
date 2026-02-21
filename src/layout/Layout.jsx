import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div className='mb-20'>
            <div className='flex'>
                {/* /sidebar */}
                <Sidebar />
                <div className='flex-1 min-h-screen md:ml-48'>
                    {/* header */}
                    <Header />
                    <main className='mt-16'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout