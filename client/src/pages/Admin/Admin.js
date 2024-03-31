import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
import {HeaderAdmin,Footer} from '../../components'
const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current || +current.role !== 1) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='flex flex-col min-h-screen'>
        <HeaderAdmin />
            <div className='flex flex-col items-center justify-center flex-grow'>
                
                <div className='w-main'>
                    <sideboard />
                    <Outlet />
                </div>
            </div>
        <Footer />
    </div>
    )
}
export default AdminLayout