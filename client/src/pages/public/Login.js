import React, { useState, useCallback } from "react";
import { Input, Button } from "antd";
import { apiLogin, apiRegister } from "../../apis/user";
import Swal from "sweetalert2";
import "antd/dist/reset.css";

const { Password } = Input;

const Login = () => {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
    });
  };

  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, phone, ...data } = payload;
    if (isRegister) {
      const response = await apiRegister(payload);
      if (response.success) {
        Swal.fire("Congratulation", response.me, "Success").then(() => {
          setIsRegister(false);
          resetPayload();
        });
      }
    } else {
      const rs = await apiLogin(data);
      console.log(rs);
    }
  }, [payload, isRegister]);

  const handleCreateAccountClick = () => {
    setIsRegister(true);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
      </div>
      <form>
        {isRegister && (
          <div style={{ marginBottom: "15px" }}>
            <Input
              value={payload.firstname}
              onChange={(e) =>
                setPayload({ ...payload, firstname: e.target.value })
              }
              placeholder="First Name"
            />
          </div>
        )}
        {isRegister && (
          <div style={{ marginBottom: "15px" }}>
            <Input
              value={payload.lastname}
              onChange={(e) =>
                setPayload({ ...payload, lastname: e.target.value })
              }
              placeholder="Last Name"
            />
          </div>
        )}
        {isRegister && (
          <div style={{ marginBottom: "15px" }}>
            <Input
              value={payload.phone}
              onChange={(e) =>
                setPayload({ ...payload, phone: e.target.value })
              }
              placeholder="Phone"
            />
          </div>
        )}
        <div style={{ marginBottom: "15px" }}>
          <Input
            value={payload.email}
            onChange={(e) =>
              setPayload({ ...payload, email: e.target.value })
            }
            placeholder="Email"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <Password
            value={payload.password}
            onChange={(e) =>
              setPayload({ ...payload, password: e.target.value })
            }
            placeholder="Password"
          />
        </div>
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {isRegister ? "Register" : "Login"}
        </Button>
        {!isRegister && (
          <p style={{ textAlign: "right" }}>
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={handleCreateAccountClick}
            >
              Create a new account
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;