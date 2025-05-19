import React, { useState } from 'react';
import { Upload, Button, message, Slider, Space, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

function ImageCompress() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality);

    setLoading(true);
    try {
      const response = await request.post('/api/image/compress', formData, {
        responseType: 'blob',
      });

      if (response.data.success) {
        message.success('压缩成功');
        setPreview(`http://localhost:3004${response.data.data.path}`);
      }
    } catch (error) {
      message.error('压缩失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Upload
        beforeUpload={(file) => {
          if (!file.type.startsWith('image/')) {
            message.error('请上传图片文件');
            return false;
          }
          setFile(file);
          return false;
        }}
        maxCount={1}
      >
        <Button icon={<UploadOutlined />}>选择图片</Button>
      </Upload>

      <div>
        <p>压缩质量：{quality}%</p>
        <Slider
          min={60}
          max={100}
          value={quality}
          onChange={setQuality}
        />
      </div>

      <Button
        type="primary"
        onClick={handleUpload}
        loading={loading}
        disabled={!file}
      >
        开始压缩
      </Button>

      {preview && (
        <Row gutter={16}>
          <Col span={12}>
            <p>原图：</p>
            <img
              src={URL.createObjectURL(file)}
              alt="原图"
              style={{ maxWidth: '100%' }}
            />
          </Col>
          <Col span={12}>
            <p>压缩后：</p>
            <img
              src={preview}
              alt="压缩后"
              style={{ maxWidth: '100%' }}
            />
          </Col>
        </Row>
      )}
    </Space>
  );
}

export default ImageCompress;
