    import React, { useState } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import { apiThemTGMonHoc } from "../../apis/monhoc";
    import { Button, TextInput } from "../../components";
    import path from "../../ultils/path";
import Swal from "sweetalert2";
    
    const ThemTGMonHoc = () => {
    const { id } = useParams(); // Lấy id của môn học từ URL
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        tgmonhoc: "",
      });
     
    const handleSubmit = async () => {
        try {
        const response = await apiThemTGMonHoc(id, payload);
            if (response.success) {
                Swal.fire('Thành công', response.mes, 'success').then(() => {
                    navigate(path.DANHSACHMONHOC);
                });
            }
        } catch (error) {
        console.error("Lỗi khi thêm thời gian môn học:", error);
        }
    };

    return (
        <div>
        <h2>Thêm Thời Gian Môn Học</h2>
        <div>
            <TextInput
                value={payload.tgmonhoc}
                setValue={setPayload}
                placeholder="Thời gian môn học"
                nameKey="tgmonhoc"
            />
        </div>
        <Button
          name="Thêm môn học"
          handleOnClick={handleSubmit}
          style={{ width: "100%", marginBottom: "10px" }}
          fw
        />
        </div>
    );
    };

    export default ThemTGMonHoc;
