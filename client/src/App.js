  import React from "react";
  import { Route, Routes } from "react-router-dom";
  import { Login, Home, Public, Qr, Dkymonhoc } from "./pages/public";
  import {
    Admin,
    HomeAdmin,
    QrScanner,
    CreateMonHoc,
    Dsmonhoc,
    CreateTGMonHoc,
  } from "./pages/Admin";
  import path from "./ultils/path";

  function App() {
    return (
      <div className="min-h-screen font-main">
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />} />
            <Route path={path.QR} element={<Qr />} />
            <Route path={path.LOGIN} element={<Login />} />
            <Route path={path.DKYMONHOC} element={<Dkymonhoc />} />
          </Route>
          <Route path={path.ADMIN} element={<Admin />}>
            <Route path={path.HOMEADMIN} element={<HomeAdmin />} />
            <Route path={path.QRSCANNER} element={<QrScanner />} />
            <Route path={path.CREATEMONHOC} element={<CreateMonHoc />} />
            <Route path={path.DSMONHOC} element={<Dsmonhoc />}>
              <Route path={path.CREATETGMONHOC} element={<CreateTGMonHoc />} />
            </Route>
          </Route>
        </Routes>
      </div>
    );
  }

  export default App;
