import React from 'react';
import { QRScanner  } from '../../components';
import { useSelector } from 'react-redux';

const QRScan = () => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <div >
      {isLoggedIn && (
        <div className="container">
          <QRScanner /> {/* Render QrCode component only if isLoggedIn is true */}
        </div>
      )}
    </div>
  );
};

export default QRScan; 