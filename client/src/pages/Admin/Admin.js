import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../ultils/path'
const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user)
    if (!isLoggedIn || !current || +current.role !== 1) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div>
            <div>test</div>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}
export default AdminLayout