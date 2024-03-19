import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiLogin, apiRegister } from "../../apis/user";
import Swal from "sweetalert2"
const Login = () => {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
      firstname: "",
      lastname: "",
        phone:"",
  });
    const resetPayload = () => {
        setPayload({
            email: "",
            password: "",
              firstname: "",
              lastname: "",
                phone:"",
        })
    }
  const [isRegister, setIsRegister] = useState(false);
  const handleSubmit = useCallback(async () => {
    const { firstname, lastname,phone, ...data } = payload;
    if (isRegister) {
        const response = await apiRegister(payload)
        if (response.success) {
            Swal.fire('Congratulation', response.me, 'Success').then(() => {
                setIsRegister(false)
                resetPayload()
            })
        }
    } else {
        const rs = await apiLogin(data)
        console.log(rs);
    }
}, [payload,isRegister]);


  const handleCreateAccountClick = () => {
    setIsRegister(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
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
                  {isRegister && (
            <InputField
              value={payload.phone}
              setValue={setPayload}
              nameKey="phone"
              placeholder="phone"
            />
          )}
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
