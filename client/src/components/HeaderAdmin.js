import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import path from "../ultils/path";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from "../store/user/asyncAction";
import { logout } from '../store/user/userSlice';
import { useNavigate } from 'react-router-dom';

const HeaderAdmin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng trang
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isPageReloaded, setIsPageReloaded] = useState(false); // Biến đánh dấu đã làm mới trang

  const { isLoggedIn, current } = useSelector(state => state.user);
  
  useEffect(() => {
    if (isLoggedIn && !isPageReloaded) { // Kiểm tra đã đăng nhập và chưa làm mới trang
      dispatch(getCurrent()).then(() => {
        setIsUserDataLoaded(true);
        setIsPageReloaded(true);
      });
    }
  }, [dispatch, isLoggedIn, isPageReloaded]);
  

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <Menu
        mode="horizontal"
        theme="dark"
        defaultSelectedKeys={["1"]}
        className="flex gap-4"
      >
        <Menu.Item key="8">
          <Link to="Home">Trang chủ</Link>
        </Menu.Item>
        <Menu.Item key="12">
          <Link to={`${path.QRSCANNER}`}>QRScanner</Link>
        </Menu.Item>
        <Menu.Item key="9">
          <Link to={`${path.CREATEMONHOC}`}>Thêm môn học</Link>
        </Menu.Item>
        <Menu.Item key="10">
          <Link to={`${path.DSMONHOC}`}>Danh sách môn học</Link>
        </Menu.Item>
        <Menu.Item key="10">
          <Link to={`${path.DSMONHOC}`}>Danh sách môn học</Link>
        </Menu.Item>
        
        <Menu.Item key="4" style={{ float: 'right' }}>
  <div className="border w-main flex justify-between h-[150px] py-[15px]">
    <div className="flex text-[13px]">
      <div className="py-[100px] h-[4px] px-[10px]">
        <span className="flex gap-4 items-center">
        </span>
        {isLoggedIn ? (
          isUserDataLoaded && (
            <div className="flex gap-4 text-sm items-center">
              <small>{`Welcome, ${current?.firstname} ${current?.lastname}` }</small>
              {/* Conditionally render the logout button only when navigate is available */}
              {navigate && (
                <span onClick={() => {
                  dispatch(logout());
                  navigate('/'); // Điều hướng về trang chủ sau khi đăng xuất
                }}> Logout </span>
              )}
            </div>
          )
        ) : (
          <Link className="hover:Text-gray-800" to={`/${path.LOGIN}`}>
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  </div>
</Menu.Item>
      </Menu>
    </header>
  );
};

export default memo(HeaderAdmin);
