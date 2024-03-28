import React from "react";
import { Layout, Row, Col } from "antd";
import "antd/dist/reset.css";

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer style={{ textAlign: "center", marginTop: "17%" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3>Thông tin liên hệ</h3>
          <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
          <p>Email: example@example.com</p>
          <p>Số điện thoại: 0123456789</p>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3>Liên kết hữu ích</h3>
          <ul>
            <li>
              <a href="/about">Về chúng tôi</a>
            </li>
            <li>
              <a href="/services">Dịch vụ</a>
            </li>
            <li>
              <a href="/contact">Liên hệ</a>
            </li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3>Tin tức</h3>
          <ul>
            <li>
              <a href="/news">Bài viết mới nhất</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <h3>Đăng ký nhận tin</h3>
          <p>Nhập email của bạn để nhận thông tin mới nhất:</p>
          <input type="email" placeholder="Email" />
          <button>Đăng ký</button>
        </Col>
      </Row>
      <div style={{ marginTop: "24px" }}>
        <p>Bản quyền © 2024. Tất cả các quyền được bảo lưu.</p>
      </div>
    </Footer>
  );
};

export default CustomFooter;