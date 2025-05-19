import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  CompressOutlined,
  ScissorOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
  
  .anticon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #1890ff;
  }
  
  .ant-typography {
    margin-bottom: 8px;
  }
`;

const tools = [
  {
    title: '图片压缩',
    description: '压缩图片大小，保持图片质量',
    icon: <CompressOutlined />,
    path: '/image/compress',
  },
  {
    title: '图片裁剪',
    description: '裁剪图片尺寸，调整图片比例',
    icon: <ScissorOutlined />,
    path: '/image/crop',
  },
  {
    title: '图片水印',
    description: '添加文字水印，保护图片版权',
    icon: <FileImageOutlined />,
    path: '/image/watermark',
  },
];

function ImageTools() {
  return (
    <div className="container">
      <Title level={2}>图片工具</Title>
      <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
        提供多种图片处理功能，满足您的各种需求
      </Text>

      <Row gutter={[24, 24]}>
        {tools.map((tool, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Link to={tool.path} style={{ textDecoration: 'none' }}>
              <StyledCard hoverable>
                {tool.icon}
                <Title level={4}>{tool.title}</Title>
                <Text type="secondary">{tool.description}</Text>
              </StyledCard>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ImageTools;
