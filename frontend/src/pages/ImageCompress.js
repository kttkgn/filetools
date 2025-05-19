import React, { useState } from 'react';
import { Upload, Button, Slider, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

function ImageCompress() {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

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

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compressed_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setCompressedSize(response.data.size);
      message.success('压缩成功');
    } catch (error) {
      message.error('压缩失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setFile(file);
    setOriginalSize(file.size);
    setCompressedSize(0);
    return false;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container">
      <Card title="图片压缩" className="upload-card">
        <Upload
          beforeUpload={handleFileSelect}
          maxCount={1}
          accept="image/*"
          style={{ width: '100%' }}
        >
          <div style={{
            border: '2px dashed #90caf9',
            borderRadius: 12,
            padding: 24,
            background: '#f5faff',
            textAlign: 'center',
            transition: 'all 0.3s',
            marginBottom: 16,
            cursor: 'pointer',
          }}>
            <Button icon={<UploadOutlined />} type="primary" size="large" style={{ borderRadius: 8 }}>
              选择图片
            </Button>
            <div style={{ color: '#888', marginTop: 8 }}>支持 PNG、JPG、WEBP、GIF</div>
          </div>
        </Upload>

        {file && (
          <>
            <div style={{ marginTop: 16 }}>
              <p>原始大小：{formatSize(originalSize)}</p>
              {compressedSize > 0 && (
                <p>压缩后大小：{formatSize(compressedSize)}</p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <span style={{ marginRight: 8 }}>压缩质量：</span>
              <Slider
                value={quality}
                onChange={setQuality}
                min={1}
                max={100}
                style={{ width: 200 }}
              />
              <span style={{ marginLeft: 8 }}>{quality}%</span>
            </div>

            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              style={{ marginTop: 16 }}
            >
              开始压缩
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default ImageCompress;
