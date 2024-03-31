import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { apiGetDKyMonHoc } from "../apis/dkymonhoc";
import './QRScanner.css'

function QRScanner() {
    const webcamRef = useRef(null);
    const [cameraStates, setCameraStates] = useState({}); // Lưu trạng thái của camera cho từng môn học
    const [dkymonData, setDKyMonHocList] = useState(null); // Danh sách môn học
    const [selectedMonHoc, setSelectedMonHoc] = useState(null); // Môn học được chọn
    const [qrCode, setQrCode] = useState(null); // Mã QR đã quét
    const [successMessage, setSuccessMessage] = useState(null); // Thông báo thành công
    const [errorMessage, setErrorMessage] = useState(null); // Thông báo lỗi

    useEffect(() => {
        fetchDKyMonHocList();
    }, []);

    // Lấy danh sách môn học từ API khi component được render
    const fetchDKyMonHocList = async () => {
        try {
            const response = await apiGetDKyMonHoc();
            setDKyMonHocList(response.Monhoc);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Mở hoặc tắt camera của môn học được chọn
    const toggleCamera = (monHoc) => {
        setSelectedMonHoc(monHoc); // Lưu môn học được chọn
        setCameraStates(prevStates => ({
            ...prevStates,
            [monHoc._id]: !prevStates[monHoc._id], // Đảo ngược trạng thái của camera cho môn học đó
        }));
    };

    // Xử lý khi quét QR thành công
    const handleScanSuccess = useCallback(async (qrCode) => {
        setQrCode(qrCode); // Lưu mã QR đã quét vào state
        if (selectedMonHoc && selectedMonHoc.sinhviendky.includes(qrCode)) {
            setSuccessMessage(`Quét thành công cho sinh viên: ${qrCode}`);
            setErrorMessage(null);
        } else {
            setSuccessMessage(null);
            setErrorMessage(`Sinh viên ${qrCode} không đăng ký môn học này.`);
        }
    }, [selectedMonHoc]);

    return (
        <div>
            <h2 style={{ textAlign: "center", fontFamily: "Arial" }}>
                Scan QR Môn học
            </h2>

            <table className="table-container">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên môn học</th>
                        <th>Thời gian môn học</th>
                        <th>Camera</th>
                    </tr>
                </thead>
                <tbody>
                    {dkymonData && dkymonData.map((dkymonhoc, index) => (
                        <tr key={dkymonhoc._id}>
                            <td>{index + 1}</td>
                            <td>{dkymonhoc.tenmonhoc}</td>
                            <td>{dkymonhoc.tgmonhoc}</td>
                            <td>
                                <button onClick={() => toggleCamera(dkymonhoc)}>
                                    {cameraStates[dkymonhoc._id] ? 'Tắt Camera' : 'Mở Camera'}
                                </button>
                                {/* Hiển thị camera nếu đã chọn mở camera */}
                                {cameraStates[dkymonhoc._id] && (
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        onScan={handleScanSuccess}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Hiển thị thông báo thành công hoặc lỗi */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default QRScanner;
