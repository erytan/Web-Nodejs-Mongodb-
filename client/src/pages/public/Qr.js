import React from 'react';
import { QrCode } from '../../components';
import { useSelector } from 'react-redux';

const Qr = () => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <div >
      {isLoggedIn && (
        <div className="container">
          <QrCode /> {/* Render QrCode component only if isLoggedIn is true */}
        </div>
      )}
    </div>
  );
};

export default Qr;