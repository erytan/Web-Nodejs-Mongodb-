    import React, { memo, useState,useRef} from "react";
    import logo from "../assets/logo.jpg";
    import icons from "../ultils/icons.js";
    import { Link } from "react-router-dom";
    import path from "../ultils/path";
    import 'antd/dist/reset.css';
    import { Layout, Menu, Modal, Input, Button } from 'antd';
const { Gi3DGlasses } = icons;


const Header = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [loginVisible, setLoginVisible] = useState(false);
    const [registerVisible, setRegisterVisible] = useState(false);
    const handleMenuClick = (key) => {
        setCurrentPage(key);
        // Các xử lý khác khi menu được click
    };

        return (
        
        // <div className='border w-main flex justify-between h-[150px] py-[15px]'>
        //     <Link to={`/${path.HOME }`} >
        //         <img src={logo} alt="logo" className='w-[135px] object-contain' />
        //     </Link>
        //     <div className='flex text-[13px]'>
        //         <div className='py-[100px] h-[4px] px-[10px]'>
        //             <span className='flex gap-4 items-center'>
        //                 <Gi3DGlasses color='Blue'/>
        //                 <span className='font-semibold '>Chào bạn</span>
        //                 <Link className='font-semibold'to={`/${path.LOGIN}`}>Đăng nhập</Link>
        //             </span>
        //         </div>
        //     </div>
        // </div>
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']} onClick={({ key }) => handleMenuClick(key)}>
                <Menu.Item key="home">Trang chủ</Menu.Item>
                <Menu.Item key="about">Điểm Danh</Menu.Item>
                <Menu.Item key="products">Thông tin</Menu.Item>
            </Menu>
            <div style={{ float: 'right' }}>
            <Menu theme="dark" mode="horizontal" selectable={false}>
                <Menu.Item key="login" onClick={() => setLoginVisible(true)}>Đăng nhập</Menu.Item>
                <Menu.Item key="register"onClick={() => setRegisterVisible(true)}>Đăng ký</Menu.Item>
            </Menu>
            </div>
      </Header>
);
    };
    export default memo(Header);
