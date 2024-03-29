import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import path from '../../ultils/path';
import { jwtDecode } from 'jwt-decode'; // Thay đổi cách import ở đây

const AuthChecker = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ localStorage (hoặc sessionStorage)
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Giải mã token để lấy thông tin người dùng, ví dụ: vai trò (role)
        const decoded = jwtDecode(token); // Sử dụng biến jwtDecode thay vì jwt_decode
        const userRole = decoded.role;

        // Kiểm tra vai trò và điều hướng người dùng đến các trang tương ứng
        if (userRole === "admin") {
          navigate(path.ADMIN);
        } else {
          navigate(path.HOME);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Xử lý lỗi nếu cần
      }
    } else {
      // Nếu không có token, điều hướng người dùng đến trang đăng nhập
      navigate(path.HOME);
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default AuthChecker;
