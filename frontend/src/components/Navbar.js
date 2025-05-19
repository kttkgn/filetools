import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  FileTextOutlined,
  PictureOutlined,
  HomeOutlined,
} from '@ant-design/icons';

function Navbar() {
  const location = useLocation();

  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/file-convert',
      icon: <FileTextOutlined />,
      label: <Link to="/file-convert">文件转换</Link>,
    },
    {
      key: '/image-tools',
      icon: <PictureOutlined />,
      label: <Link to="/image-tools">图片工具</Link>,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      style={{ lineHeight: '64px' }}
    />
  );
}

export default Navbar;
