import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { apiGetDKyMonHoc, apiMonHocDky } from "../apis/dkymonhoc";
import './QRScanner.css';
import QrScanner from "jsqr";
function QRScanner() {
    const webcamRef = useRef(null);
    const [cameraStates, setCameraStates] = useState({}); // Lưu trạng thái của camera cho từng môn học
    const [dkymonData, setDKyMonHocList] = useState(null); // Danh sách môn học
    const [selectedMonHoc, setSelectedMonHoc] = useState(null); // Môn học được chọn
    const [qrCode, setQrCode] = useState(null); // Mã QR đã quét
    const [sinhVienDky, setSinhVienDky] = useState([]); // Danh sách sinh viên đăng ký môn học
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

    // Mở hoặc tắt camera của môn học được chọn và gọi hàm apiMonHocDky
    const toggleCamera = async (monHoc) => {
        setSelectedMonHoc(monHoc); // Lưu môn học được chọn
        setCameraStates(prevStates => ({
            ...prevStates,
            [monHoc._id]: !prevStates[monHoc._id], // Đảo ngược trạng thái của camera cho môn học đó
        }));
        try {
            const response = await apiMonHocDky(monHoc._id);
            console.log("Mon hoc da chon:", response);
            if (response && response.data.sinhviendky) {
                setSinhVienDky( response.data.sinhviendky);
            }
        } catch (error) {
            console.error("Error fetching selected monhoc:", error);
        }
    };
    // add function
    const captureAndSend = useCallback(async () => {
        if (webcamRef.current && cameraStates) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                let qrCodedetech = await detectQRCode(imageSrc);
                setQrCode(qrCodedetech); // Lưu mã QR đã quét vào state
                if (selectedMonHoc && sinhVienDky.includes(qrCode.split('--')[1].trim())) {
                    setSuccessMessage(`Quét thành công cho sinh viên: ${qrCode.split('--')[0].trim()}`);
                    setErrorMessage(null);
                } else {
                    setSuccessMessage(null);
                    setErrorMessage(`Sinh viên ${qrCode.split('--')[0].trim()} không đăng ký môn học này.`);
                }
            } catch (error) {
                console.log("Không tìm thấy hình ảnh");
            }
        }
    }, [webcamRef, cameraStates, selectedMonHoc, sinhVienDky]);
    const detectQRCode = (imageSrc) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, image.width, image.height);
                const code = QrScanner(
                    imageData.data,
                    imageData.width,
                    imageData.height
                );
                if (code != null && code != '') {
                    resolve(code.data); // Return dữ liệu
                } else {
                    reject(undefined);
                }
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    };
    useEffect(() => {
        const interval = setInterval(captureAndSend, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [captureAndSend]);

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
