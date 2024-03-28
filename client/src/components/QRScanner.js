import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import QrScanner from 'jsqr';

function QRScanner() {
    const webcamRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const captureAndSend = useCallback(async () => {
        if (webcamRef.current && isCameraOn) {
            const imageSrc = webcamRef.current.getScreenshot();
            try {
                const qrCode = await detectQRCode(imageSrc);
                alert('Đã checkin User ' + qrCode)
                // call api
            } catch (error) {
                console.log('Không tìm thấy hình ảnh');
            }
        }
    }, [webcamRef, isCameraOn]);
    const detectQRCode = (imageSrc) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                const imageData = context.getImageData(0, 0, image.width, image.height);
                const code = QrScanner(imageData.data, imageData.width, imageData.height);
                if (code != null) {
                    resolve(code.data);// Return dữ liệu
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
        setIsCameraOn(prevState => !prevState);
    };

    return (
        <div>
            {isCameraOn ? (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                />
            ) : (
                <p>Camera is đang tắt.</p>
            )}
            <button onClick={toggleCamera}>
                {isCameraOn ? 'Tắt Camera' : 'Mở Camera'}
            </button>
        </div>
    );
}

export default QRScanner;
