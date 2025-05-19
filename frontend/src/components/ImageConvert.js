import React, { useState } from 'react';
import { Upload, Button, message, Select, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Option } = Select;

function ImageConvert() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetFormat, setTargetFormat] = useState('jpg');

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', targetFormat);

    setLoading(true);
    try {
      const response = await request.post('/api/image/convert', formData, {
        responseType: 'blob',
      });

      if (response.data.success) {
        message.success('转换成功');
        window.open(`http://localhost:3004${response.data.data.path}`, '_blank');
      }
    } catch (error) {
      message.error('转换失败');
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

      <Select
        value={targetFormat}
        onChange={setTargetFormat}
        style={{ width: 200 }}
      >
        <Option value="jpg">JPG</Option>
        <Option value="png">PNG</Option>
        <Option value="webp">WebP</Option>
        <Option value="gif">GIF</Option>
      </Select>

      <Button
        type="primary"
        onClick={handleUpload}
        loading={loading}
        disabled={!file}
      >
        开始转换
      </Button>
    </Space>
  );
}

export default ImageConvert;
