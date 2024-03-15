    import React, { useState, useCallback } from "react";
    import icons from "../../ultils/icons.js";
    import { InputField, Button } from "../../components";

    const { GiAbstract066 } = icons;
    const Login = () => {
    const [payload, setPayload] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [isRegister, setIsregister] = useState(false);
    const handleSubmit = useCallback(() => {
        console.log(payload);
    }, [payload]);
    return (
        <div>
        <table className="w-main">
            <tbody>
            <tr>
                <td className=" w-[500px]">
                <table>
                    <tbody>
                    <tr>
                        <td>
                        <GiAbstract066 color="Blue" />
                        </td>
                        <td className="px-[10px]">Quên mật khẩu!</td>
                    </tr>
                    </tbody>
                </table>
                </td>
                <td className="h-[34px] w-[900px]">
                <table>
                    <tbody>
                    <tr>
                        <td className="w-[130px] flex-center">
                        {isRegister ? "Register" : "Tên đăng nhập"}
                        
                        </td>
                                        <td className="w-[225px] " align="left">
                                            {isRegister && <InputField
                                                value={payload.name}
                                                setValue={setPayload}
                                                nameKey="name"
                                            />}
                            <InputField
                            value={payload.gmail}
                            setValue={setPayload}
                            nameKey="gmail"
                            />
                        </td>
                        <td className="w-[100px] flex-center">
                        &nbsp;
                        <span> Mật khẩu</span>
                        </td>
                        <td className="w-[225px] " >
                            <InputField
                            value={payload.password}
                            setValue={setPayload}
                            nameKey="password"
                            type="password"
                            />
                        </td>
                        <td>
                        <Button name={isRegister ? "Register" : "Login"} handleOnClick={handleSubmit} fw />
                                        </td>
                                        
                                    </tr>
                                 
                                </tbody>
                                <div className=" w-full"onClick={()=>setIsregister(true)}>
                                            <span className="text-blue-500 hover:underline cursor-pointer">Create account</span>
                                </div>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    );
    };
    export default Login;
