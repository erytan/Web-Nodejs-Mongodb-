import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import QrScanner from "jsqr";
import { apiCheckin,apiGetMaMonHoc } from "../apis/user";
import Swal from "sweetalert2";
function QRScanner() {
    const webcamRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [subjects, setSubjects] = useState([]);
    
    const captureAndSend = useCallback(async () => {
        if (webcamRef.current && isCameraOn) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                let qrCode = await detectQRCode(imageSrc);
                let payload = {
                    mamonhoc:selectedSubject,
                    _id:qrCode.split('--')[1].trim()
                }
                const response = await apiCheckin(payload);
                if (response.success) {
                    Swal.fire('Congratulation', response.message + ' sinh viên '+qrCode.split('--')[0].trim(), 'success').then(() => {
                    });
                  } else {
                    Swal.fire('Opps!', response.message, 'error');
                  }
            } catch (error) {
                console.log("Không tìm thấy hình ảnh");
            }
        }
    }, [webcamRef, isCameraOn]);
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
                if (code != null) {
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

    const toggleCamera = () => {
        setIsCameraOn((prevState) => !prevState);
    };
    const [selectedSubject, setSelectedSubject] = useState("");
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };
    // lấy danh sánh môn học từ database
    useEffect(() => {
        async function getMonHoc() {
          try {
            const responses = await apiGetMaMonHoc();
            const newData = responses.Monhoc.map(response => response.mamonhoc);
            setSubjects(newData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
        getMonHoc();
      }, []);
    return (
        <div>
            <div>
                <select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    disabled={isCameraOn}
                >
                    <option value="">Chọn môn học</option>
                    {
                    subjects.map((subject) => (
                        <option key={subject} value={subject}>
                            {subject}
                        </option>
                    ))
                    }
                </select>
            </div>

            <div>
                <button onClick={toggleCamera}>
                    {isCameraOn ? "Tắt Camera" : "Mở Camera"}
                </button>
            </div>
            <div>
                {isCameraOn ? (
                    <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
                ) : (
                    <div>Camera is đang tắt.</div>
                )}
            </div>
        </div>
    );
}

export default QRScanner;
