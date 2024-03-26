import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useDispatch, useSelector } from 'react-redux';
import { getCurrent } from "../store/user/asyncAction";

const QrCode = () => {
  const [url, setUrl] = useState(""); // State để lưu giá trị nhập vào input
  const qrRef = useRef();
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector(state => state.user);
  const [isComponentLoaded, setIsComponentLoaded] = useState(false); // Biến trạng thái để theo dõi trạng thái của component

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getCurrent()).then(() => {
        setIsComponentLoaded(true); // Đặt biến trạng thái thành true sau khi dữ liệu được tải
      });
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isComponentLoaded) {
      // Cập nhật lại URL khi component được tải lại
      setUrl(current?.lastname);
    }
  }, [current, isComponentLoaded]);

  const downloadQRCode = (e) => {
    e.preventDefault();
    let canvas = qrRef.current.querySelector("canvas");
    let image = canvas.toDataURL("image/png");
    let anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qr-code.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setUrl("");
  };

  return (
    <div className="qrcode__container"style={{ maxWidth: "600px", margin: "10% 40%" , height:"190px",}} >
      <div ref={qrRef}>
        <QRCodeCanvas
          id="qrCode"
          value={url} // Giá trị của QR code từ state 'url'
          size={300}
          bgColor={"#3896"}
          level={"H"}
        />
      </div>
      <div className="input__group">
      <form onSubmit={downloadQRCode} style={{ margin: '12%' }}>
  <input 
    type="text"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    readOnly
    style={{ textAlign: 'center' }}
  />
</form>
      </div>
    </div>
  );
};

export default QrCode;
