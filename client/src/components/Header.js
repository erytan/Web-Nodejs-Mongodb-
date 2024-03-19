import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd"
import path from "../ultils/path";


const Header = () => {
 
  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Your Logo
      </Link>
      <Menu mode="horizontal" theme="dark" defaultSelectedKeys={["1"]} className="flex gap-4">
        <Menu.Item key="1">
          <Link to="/">Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/danh-sach">Danh sách</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/lien-he">Liên hệ</Link>
        </Menu.Item>
      </Menu>
      <div className="border w-main flex justify-between h-[150px] py-[15px]">
            <Link to={`/${path.HOME}`}>
            {/* <img src={logo} alt="logo" className='w-[135px] object-contain' /> */}
            </Link>
            <div className="flex text-[13px]">
            <div className="py-[100px] h-[4px] px-[10px]">
                <span className="flex gap-4 items-center">
                {/* <Gi3DGlasses color='Blue'/> */}

                <Link className="font-semibold" to={`/${path.LOGIN}`}>
                    Đăng nhập
                </Link>
                </span>
            </div>
            </div>
        </div>
    </header>
  );
};

export default memo(Header);
