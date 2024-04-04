import React, { useState, useEffect } from "react";
import { apiGetDKyMonHoc, apiThemSVDky } from "../../apis/dkymonhoc";
import { Button } from "../../components";
import { useSelector } from 'react-redux';
import "../Admin/Danhsachmonhoc.css";

const DkyMonHocList = () => {
  const [dkymonData, setDKyMonHocList] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State để điều khiển hiển thị của popup
  const [, setMaSinhVien] = useState(""); // State để lưu trữ mã sinh viên nhập vào
  const [monHocId1, setMonHocId1] = useState(""); // State để lưu trữ monHocId được chọn
  const { isLoggedIn, current } = useSelector(state => state.user);

  useEffect(() => {
    fetchDKyMonHocList();
  }, []);

  const fetchDKyMonHocList = async () => {
    const response = await apiGetDKyMonHoc();
    setDKyMonHocList(response.Monhoc);
  };

  const handleRegister = async (monHocId) => {
    if (!isLoggedIn || !current._id) {
      alert("Bạn cần đăng nhập để đăng ký môn học");
      return;
    }
    
    setIsPopupVisible(true); // Hiển thị popup khi nhấn vào nút "Đăng ký"
    setMonHocId1(monHocId); // Set monHocId1 với monHocId đã chọn
  };

  const handleSubmit = async () => {
    try {
      // Gửi yêu cầu đăng ký môn học lên server với mã sinh viên được nhập vào
      const response = await apiThemSVDky(monHocId1, { sinhviendky: current._id }); // Sử dụng current._id thay vì maSinhVien
      console.log(response);
      if (response.success) {
        console.log("Đăng ký môn học thành công");
        // Nếu đăng ký thành công, cập nhật lại danh sách môn học
        fetchDKyMonHocList();
      } else {
        console.log("Đăng ký môn học không thành công");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký môn học:", error);
    }

    // Đặt lại giá trị của mã sinh viên và ẩn popup sau khi đăng ký
    setMaSinhVien("");
    setIsPopupVisible(false);
  };

  return (
    <div className="container">
      <h2>
        Danh sách đăng ký môn học
      </h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Thời gian môn học</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dkymonData?.map((dkymonhoc, index) => (
              <tr key={dkymonhoc._id}>
                <td>{index + 1}</td>
                <td>{dkymonhoc.mamonhoc}</td>
                <td>{dkymonhoc.tenmonhoc}</td>
                <td>{dkymonhoc.tgmonhoc}</td>
                <td>
                  <button onClick={() => handleRegister(dkymonhoc._id)}>Đăng ký</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <div className="popup-container">
          <div className="popup">
            <h3>Nhập mã sinh viên</h3>
            <input
              type="text"
              value={current._id} // Sử dụng current._id thay vì maSinhVien
              onChange={(e) => setMaSinhVien(e.target.value)}
              placeholder="Mã sinh viên"
            />
            <Button
              name="Thêm"
              handleOnClick={handleSubmit}
              style={{ width: "100%", marginBottom: "10px" }}
              fw
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DkyMonHocList;
