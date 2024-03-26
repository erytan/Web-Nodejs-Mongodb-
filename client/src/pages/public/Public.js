import React from 'react'
import { Outlet } from 'react-router-dom'
import {Header,Footer} from '../../components'

const Public = () => {
   return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className='flex flex-col items-center justify-center flex-grow'>
                <div className='w-main'>
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default Public