import React from 'react';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import {
  FileTextOutlined,
  PictureOutlined,
} from '@ant-design/icons';

function Home() {
  const tools = [
    {
      title: '文件转换',
      icon: <FileTextOutlined style={{ fontSize: '32px' }} />,
      description: '支持多种文件格式的转换',
      path: '/file-convert',
    },
    {
      title: '图片工具',
      icon: <PictureOutlined style={{ fontSize: '32px' }} />,
      description: '图片格式转换、压缩、裁剪、水印等功能',
      path: '/image-tools',
    },
  ];

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
        欢迎使用在线工具网站
      </h1>
      <Row gutter={[16, 16]} justify="center">
        {tools.map((tool, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Link to={tool.path}>
              <Card
                hoverable
                style={{ textAlign: 'center' }}
              >
                <div style={{ marginBottom: '16px' }}>{tool.icon}</div>
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;
