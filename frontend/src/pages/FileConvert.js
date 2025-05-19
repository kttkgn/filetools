import React, { useState } from 'react';
import { Card, Upload, Select, Button, message, Space, Typography, Row, Col, Progress, Tooltip } from 'antd';
import { UploadOutlined, FileTextOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import request from '../utils/request';
import styled from 'styled-components';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

// API配置
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3004/api';

// 支持的文件格式
const SUPPORTED_FORMATS = {
  'pdf': ['txt', 'docx', 'html'],
  'txt': ['pdf', 'docx', 'html'],
  'docx': ['pdf', 'txt', 'html'],
  'html': ['pdf', 'txt', 'docx'],
  'jpg': ['png', 'webp', 'gif'],
  'jpeg': ['png', 'webp', 'gif'],
  'png': ['jpg', 'webp', 'gif'],
  'webp': ['jpg', 'png', 'gif'],
  'gif': ['jpg', 'png', 'webp'],
};

// 样式组件
const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .ant-card-head {
    border-bottom: 2px solid #f0f0f0;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #1890ff;
    background: #f0f7ff;
  }
`;

const FormatInfo = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
`;

const FormatTag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin: 4px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 12px;
`;

const StatusText = styled(Text)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

function FileConvert() {
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      message.error('请选择要转换的文件');
      return;
    }

    if (!targetFormat) {
      message.error('请选择目标格式');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    try {
      const response = await axios.post(`${API_URL}/convert`, formData, {
        timeout: 120000, // 增加到2分钟
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `converted.${targetFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success('文件转换成功');
      setFile(null);
      setTargetFormat(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('文件转换错误:', error);
      if (error.code === 'ECONNABORTED') {
        message.error('文件转换超时，请稍后重试或尝试转换较小的文件');
      } else {
        message.error(error.response?.data?.error || '文件转换失败');
      }
      setError(error.response?.data?.error || '文件转换失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (info) => {
    const fileObj = info.fileList[0]?.originFileObj;
    setFile(fileObj || null);
    if (fileObj) {
      const fileExt = fileObj.name.split('.').pop().toLowerCase();
      if (SUPPORTED_FORMATS[fileExt]) {
        setTargetFormat(SUPPORTED_FORMATS[fileExt][0]);
      } else {
        setTargetFormat(null);
      }
    } else {
      setTargetFormat(null);
    }
  };

  const getTargetFormats = (file) => {
    if (!file) return [];
    const ext = file.name.split('.').pop().toLowerCase();
    return SUPPORTED_FORMATS[ext] || [];
  };

  const getFormatIcon = (format) => {
    const icons = {
      pdf: '📄',
      txt: '📝',
      docx: '📘',
      html: '🌐',
      jpg: '🖼️',
      jpeg: '🖼️',
      png: '🖼️',
      webp: '🖼️',
      gif: '🎞️',
    };
    return icons[format] || '📎';
  };

  return (
    <StyledCard title="文件转换" className="tool-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div>
              <Title level={5}>
                选择文件
                <Tooltip title="支持 PDF、TXT、DOCX、HTML 和常见图片格式">
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </Title>
              <Upload
                accept={Object.keys(SUPPORTED_FORMATS).map((ext) => `.${ext}`).join(',')}
                beforeUpload={() => false}
                onChange={handleFileChange}
                showUploadList={false}
                maxCount={1}
              >
                <UploadArea>
                  <UploadOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <div style={{ marginTop: 16 }}>
                    <Button type="primary" icon={<UploadOutlined />}>
                      选择文件
                    </Button>
                    <div style={{ marginTop: 8, color: '#666' }}>
                      或将文件拖放到此处
                    </div>
                  </div>
                </UploadArea>
              </Upload>
              {file && (
                <StatusText type="success">
                  <CheckCircleOutlined />
                  已选择: {file.name}
                </StatusText>
              )}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div>
              <Title level={5}>选择目标格式</Title>
              <Select
                style={{ width: '100%' }}
                value={targetFormat}
                onChange={setTargetFormat}
                placeholder="请选择目标格式"
                optionLabelProp="label"
              >
                {getTargetFormats(file).map((format) => (
                  <Option key={format} value={format} label={format.toUpperCase()}>
                    <Space>
                      <span>{getFormatIcon(format)}</span>
                      <span>{format.toUpperCase()}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        </Row>

        {loading && (
          <Progress percent={progress} status="active" />
        )}

        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={handleUpload}
          loading={isLoading}
          disabled={!file || !targetFormat}
          block
          size="large"
        >
          开始转换
        </Button>

        <FormatInfo>
          <Title level={5}>支持的格式</Title>
          <div>
            <Text strong>文档格式：</Text>
            {['pdf', 'txt', 'docx', 'html'].map((format) => (
              <FormatTag key={format}>
                {getFormatIcon(format)} {format.toUpperCase()}
              </FormatTag>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <Text strong>图片格式：</Text>
            {['jpg', 'png', 'webp', 'gif'].map((format) => (
              <FormatTag key={format}>
                {getFormatIcon(format)} {format.toUpperCase()}
              </FormatTag>
            ))}
          </div>
        </FormatInfo>
      </Space>
    </StyledCard>
  );
}

export default FileConvert;
