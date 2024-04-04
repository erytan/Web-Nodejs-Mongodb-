import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { apiGetDKyMonHoc, apiMonHocDky, } from "../apis/dkymonhoc";
import {apiGetAllUSER} from "../apis/user"
import './QRScanner.css';
import QrScanner from "jsqr";
import * as XLSX from 'xlsx';

function QRScanner() {
    const webcamRef = useRef(null);
    const [cameraStates, setCameraStates] = useState({}); 
    const [dkymonData, setDKyMonHocList] = useState(null); 
    const [selectedMonHoc, setSelectedMonHoc] = useState(null); 
    const [sinhVienDky, setSinhVienDky] = useState([]); 
    const [successMessage, setSuccessMessage] = useState(null); 
    const [errorMessage, setErrorMessage] = useState(null); 
    const [, setScannedData] = useState([]); 
    const [allScannedData, setAllScannedData] = useState([]);
    const [qrCode, setQrCode] = useState([]);

    useEffect(() => {
        fetchDKyMonHocList();
    }, []);

    const fetchDKyMonHocList = async () => {
        try {
            const response = await apiGetDKyMonHoc();
            setDKyMonHocList(response.Monhoc);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const toggleCamera = async (monHoc) => {
        setSelectedMonHoc(monHoc); 
        setCameraStates(prevStates => ({
            ...prevStates,
            [monHoc._id]: !prevStates[monHoc._id], 
        }));
        try {
            const user = await apiGetAllUSER();
            console.log(user)
            const response = await apiMonHocDky(monHoc._id);
            if (response && response.data.sinhviendky) {
                setSinhVienDky(response.data.sinhviendky);
            }
        } catch (error) {
            console.error("Error fetching selected monhoc:", error);
        }
    };
    const captureAndSend = useCallback(async () => {
        if (webcamRef.current && cameraStates) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                let qrCodedetech = await detectQRCode(imageSrc);
                setQrCode(qrCodedetech); // Lưu mã QR đã quét vào state
                if (selectedMonHoc && sinhVienDky.includes(qrCode)) {
                    setSuccessMessage(`Quét thành công cho sinh viên: ${qrCode}`);
                    setErrorMessage(null);
                    setScannedData(prevData => [...prevData, qrCodedetech]);
                    const scannedDataWithMonHoc = {
                        monHoc: selectedMonHoc.tenmonhoc,
                        qrCode: qrCodedetech
                    };
                    setAllScannedData(prevData => [...prevData, scannedDataWithMonHoc]);
                    addToTextArea(qrCodedetech);
                } else {
                    setSuccessMessage(null);
                    setErrorMessage(`Sinh viên ${qrCode} không đăng ký môn học này.`);
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
                if (code !== null && code !== '') {
                    resolve(code.data); 
                } else {
                    reject(undefined);
                }
            };
            image.onerror = (error) => {
                reject(error);
            };
        });
    };

    const addToTextArea = (data) => {
        const textArea = document.getElementById("scannedDataTextArea");
        textArea.value += data + "\n";
    };

    const saveToExcel = () => {
        const wb = XLSX.utils.book_new();
        const dataToWrite = [['Môn học', 'Scanned Data']];
        allScannedData.forEach(item => {
            // Thêm mỗi phần tử của mảng lưu trữ vào mảng cần ghi
            dataToWrite.push([item.monHoc, item.qrCode]);
        });
        // Tạo sheet từ mảng dữ liệu cần ghi
        const ws = XLSX.utils.aoa_to_sheet(dataToWrite);
        XLSX.utils.book_append_sheet(wb, ws, "Scanned Data");
        XLSX.writeFile(wb, "scanned_data.xlsx");
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
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <textarea id="scannedDataTextArea" rows="10" cols="50"></textarea>
            
            <button onClick={saveToExcel}>Lưu vào Excel</button>
        </div>
    );
}

export default QRScanner;
