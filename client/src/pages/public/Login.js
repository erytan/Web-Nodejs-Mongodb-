import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiLogin, apiRegister } from "../../apis/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from '../../ultils/path';
import { useDispatch } from 'react-redux'; // Sử dụng `useDispatch` thay vì `userDispatch`
import { register } from '../../store/user/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Sử dụng useDispatch để lấy dispatcher

  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile:"",
  });

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile:"",
    });
  };

  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    try {
      if (isRegister) {
        const response = await apiRegister(payload);
        if (response.success) {
          Swal.fire('Congratulation', response.mes, 'success').then(() => {
            setIsRegister(false);
            resetPayload();
          });
        } else {
          Swal.fire('Opps!', response.mes, 'error');
        }
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispatch(register({ isLoggedIn: true, token: rs.accessToken, userData: rs.userData }));
          navigate(`/${path.HOME}`);
        } else {
          Swal.fire('Opps!', rs.mes, 'error');
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // Xử lý lỗi
    }
  }, [payload, isRegister, dispatch, navigate]);

  const handleCreateAccountClick = () => {
    setIsRegister(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "11% 40%" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
      </div>
      <form>
        <div style={{ marginBottom: "15px" }}>
          {isRegister && (
            <InputField
              value={payload.firstname}
              setValue={setPayload}
              nameKey="firstname"
              placeholder="firstname"   
            />
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          {isRegister && (
            <InputField
              value={payload.lastname}
              setValue={setPayload}
              nameKey="lastname"
              placeholder="lastname"
            />
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          {isRegister && 
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
              placeholder="mobile"
            />
          }
        </div>
        
        <div style={{ marginBottom: "15px" }}>
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            placeholder="Email"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type="password"
            placeholder="Mật khẩu"
          />
        </div>
        <Button
          name={isRegister ? "Register" : "Login"}
          handleOnClick={handleSubmit}
          style={{ width: "100%", marginBottom: "10px" }}
          fw
        />
        {!isRegister && (
          <p style={{ textAlign: "right" }}>
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={handleCreateAccountClick}
            >
              Tạo tài khoản mới
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
