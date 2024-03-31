import React, { useState, useEffect } from "react";
import { apiGetMonHoc, apiThemTGMonHoc } from "../../apis/monhoc"; // Import hàm API để thêm thời gian môn học
import { apiCreateMonHocDky } from "../../apis/dkymonhoc";
import { Button, TextInput } from "../../components";
import "./Danhsachmonhoc.css";

const Dsmonhoc = () => {
  const [monhocData, setMonHocList] = useState(null);

  const [selectedMonHocId, setSelectedMonHocId] = useState(null); // State để lưu id của môn học được chọn
  const [newTime, setNewTime] = useState(""); // State để lưu thời gian mới
  const [showPopup, setShowPopup] = useState(false); // State để kiểm soát hiển thị của popup

  useEffect(() => {
    fetchMonHocList();
  }, []);

  const fetchMonHocList = async () => {
    const response = await apiGetMonHoc();
    setMonHocList(response.Monhoc);
 
  };

  const handleSubmit = (id) => {
    setSelectedMonHocId(id);
    setShowPopup(true);
  };

  const handleAddTime = async () => {
    try {
      const randomNum = Math.floor(Math.random() * 1000000);
      const response = await apiThemTGMonHoc(selectedMonHocId, {
        tgmonhoc: newTime,
      });
      if (response.success) {
        // Nếu thêm thành công, lấy ra thông tin của môn học và thời gian mới nhất
        const selectedMonHoc = monhocData.find(
          (monhoc) => monhoc._id === selectedMonHocId
        );

        // Tạo đối tượng dữ liệu để gửi đến apiCreateMonHocDky
        const dataToSend = {
          tgmonhoc: newTime,
          mamonhoc: selectedMonHoc.mamonhoc + "(" + randomNum + ")",
          tenmonhoc: selectedMonHoc.tenmonhoc + "(" + randomNum + ")",
          sinhviendky: "0",
        };

        // Console log 4 biến của dataToSend
        console.log("tgmonhoc:", dataToSend.tgmonhoc);
        console.log("mamonhoc:", dataToSend.mamonhoc);
        console.log("tenmonhoc:", dataToSend.tenmonhoc);
        console.log("sinhviendky:", dataToSend.sinhviendky);

        // Gửi đối tượng dữ liệu tới apiCreateMonHocDky
        const createMonHocDkyResponse = await apiCreateMonHocDky(dataToSend);
        if (createMonHocDkyResponse.success) {
          alert("Thêm thành công ", dataToSend);
        } else {
          alert("Có lỗi khi thêm thông tin. Vui lòng thử lại sau.");
        }

        // Cập nhật lại danh sách môn học
        fetchMonHocList();
        setShowPopup(false); // Ẩn popup sau khi thêm thành công
        setNewTime(""); // Xóa nội dung của input
      }
    } catch (error) {
      console.error("Lỗi khi thêm thời gian môn học:", error);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", fontFamily: "Arial" }}>
        Danh sách môn học
      </h2>
      <div style={{ maxWidth: "40px", margin: "20px 40%" }}>
        <table
          style={{
            borderCollapse: "collapse",
            border: "1px solid black",
            width: "100%", // Thay đổi maxWidth thành width để danh sách môn học mở rộng theo chiều ngang của container
            fontFamily: "Arial",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", textAlign: "center" }}>
                #
              </th>
              <th style={{ border: "1px solid black", textAlign: "center" }}>
                Mã môn học
              </th>
              <th style={{ border: "1px solid black", textAlign: "center" }}>
                Tên môn học
              </th>
              <th style={{ border: "1px solid black", width: "30%" }}>
                Thời gian môn học
              </th>
              <th style={{ border: "1px solid black", textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {monhocData?.map((monhoc, index) => (
              <tr key={monhoc._id}>
                <td style={{ border: "1px solid black", textAlign: "center" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid black", textAlign: "center" }}>
                  {monhoc.mamonhoc}
                </td>
                <td style={{ border: "1px solid black", textAlign: "center" }}>
                  {monhoc.tenmonhoc}
                </td>
                <td style={{ border: "1px solid black", textAlign: "center" }}>
                  <ul>
                    {monhoc.tgmonhoc.map((time, idx) => (
                      <li key={idx}>{time}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Button
                    name="Thêm môn học"
                    handleOnClick={() => handleSubmit(monhoc._id)}
                    style={{ width: "100%", marginBottom: "10px" }}
                    fw
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPopup && (
        <div className="popup-container">
          <div className="popup">
            <h3>Thêm thời gian môn học</h3>
            <TextInput
              label="Thời gian"
              value={newTime}
              onChange={setNewTime} // Truyền setNewTime để cập nhật giá trị mới
              placeholder="Nhập thời gian"
            />

            <Button
              name="Thêm"
              handleOnClick={handleAddTime}
              style={{ width: "100%", marginBottom: "10px" }}
              fw
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dsmonhoc;
