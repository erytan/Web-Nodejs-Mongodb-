import React, { useState, useCallback } from "react";
import { InputField, Button } from "../../components";
import { apiCreateMonHoc } from "../../apis/monhoc";
import Swal from "sweetalert2";

const CreateMonhoc = () => {
  const [payload, setPayload] = useState({
    tenmonhoc: "",
    mamonhoc: "",
    tgmonhoc: "0",
  });

  const resetPayload = () => {
    setPayload({
      tenmonhoc: "",
      mamonhoc: "",
      tgmonhoc: "0",
    });
  };

  const handleSubmit = useCallback(async () => {
    try {
      const response = await apiCreateMonHoc(payload);
      if (response.success) {
        Swal.fire('Thành công', response.mes, 'success').then(() => {
          resetPayload();
        });
      } else {
        Swal.fire('Thất bại!', response.mes, 'error');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      // Xử lý lỗi
    }
  }, [payload]);

  return (
    <div className="w-full">
      <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
        <span> Thêm môn học</span>
      </h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <form>
        <div style={{ marginBottom: "15px" }}>
          <InputField
            value={payload.tenmonhoc}
            setValue={setPayload}
            placeholder="Tên môn học"
            nameKey="tenmonhoc"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <InputField
            value={payload.mamonhoc}
            setValue={setPayload}
            placeholder="Mã môn học"
            nameKey="mamonhoc"
          />
        </div>
        
        <Button
          name="Thêm môn học"
          handleOnClick={handleSubmit}
          style={{ width: "100%", marginBottom: "10px" }}
          fw
        />
      </form>
      </div>
    </div>
  );
};

export default CreateMonhoc;
