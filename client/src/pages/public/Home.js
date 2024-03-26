import React from 'react';
import { QrCode } from '../../components';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <div style={{ maxWidth: "600px", margin: "37% 40%" }}>
      
    </div>
  );
};

export default Home;

// {isLoggedIn && (
//   <div className="container">
//     <QrCode /> {/* Render QrCode component only if isLoggedIn is true */}
//   </div>
// )}