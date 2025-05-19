import React, { useState } from 'react';
import { Upload, Button, Input, message, Card, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

function ImageCrop() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropParams, setCropParams] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    if (!cropParams.width || !cropParams.height) {
      message.error('请输入裁剪尺寸');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('left', cropParams.left);
    formData.append('top', cropParams.top);
    formData.append('width', cropParams.width);
    formData.append('height', cropParams.height);

    setLoading(true);
    try {
      const response = await request.post('/api/image/crop', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cropped_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success('裁剪成功');
    } catch (error) {
      message.error('裁剪失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setFile(file);
    return false;
  };

  const handleParamChange = (param, value) => {
    setCropParams((prev) => ({
      ...prev,
      [param]: Number(value) || 0,
    }));
  };

  return (
    <div className="page-container">
      <Card title="图片裁剪" className="upload-card">
        <Upload
          beforeUpload={handleFileSelect}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>

        {file && (
          <>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>左边距：</div>
                <Input
                  type="number"
                  value={cropParams.left}
                  onChange={(e) => handleParamChange('left', e.target.value)}
                  min={0}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>上边距：</div>
                <Input
                  type="number"
                  value={cropParams.top}
                  onChange={(e) => handleParamChange('top', e.target.value)}
                  min={0}
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>宽度：</div>
                <Input
                  type="number"
                  value={cropParams.width}
                  onChange={(e) => handleParamChange('width', e.target.value)}
                  min={1}
                />
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>高度：</div>
                <Input
                  type="number"
                  value={cropParams.height}
                  onChange={(e) => handleParamChange('height', e.target.value)}
                  min={1}
                />
              </Col>
            </Row>

            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              style={{ marginTop: 16 }}
            >
              开始裁剪
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default ImageCrop;
