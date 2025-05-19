import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  FileTextOutlined,
  SwapOutlined,
  CompressOutlined,
  ScissorOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Home from './pages/Home';
import FileConvert from './pages/FileConvert';
import ImageCompress from './pages/ImageCompress';
import ImageCrop from './pages/ImageCrop';
import ImageWatermark from './pages/ImageWatermark';
import ImageTools from './pages/ImageTools';
import About from './pages/About';
import Help from './pages/Help';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'file-convert',
      icon: <FileTextOutlined />,
      label: <Link to="/file-convert">文件转换</Link>,
    },
    {
      key: 'image-tools',
      icon: <SwapOutlined />,
      label: <Link to="/image-tools">图片工具</Link>,
    },
    {
      key: 'about',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">关于我们</Link>,
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: <Link to="/help">帮助</Link>,
    },
  ];

  return (
    <Layout className="layout">
      <Header className="header">
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          FileTools
        </Title>
        <Menu theme="dark" mode="horizontal" className="nav-menu" items={menuItems} />
      </Header>

      <Content className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-convert" element={<FileConvert />} />
          <Route path="/image-tools" element={<ImageTools />} />
          <Route path="/image/compress" element={<ImageCompress />} />
          <Route path="/image/crop" element={<ImageCrop />} />
          <Route path="/image/watermark" element={<ImageWatermark />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </Content>

      <Footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>提供专业的文件转换和图片处理服务</p>
          </div>
          <div className="footer-section">
            <h3>联系方式</h3>
            <p>邮箱：support@example.com</p>
          </div>
          <div className="footer-section">
            <h3>使用条款</h3>
            <p>请遵守我们的服务条款</p>
          </div>
          <div className="footer-section">
            <h3>隐私政策</h3>
            <p>我们重视您的隐私</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 文件转换工具. All rights reserved.</p>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
