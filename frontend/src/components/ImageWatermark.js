import React, { useState } from 'react';
import { Upload, Button, message, Space, Card, Slider, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Option } = Select;

function ImageWatermark() {
  const [file, setFile] = useState(null);
  const [watermark, setWatermark] = useState('');
  const [position, setPosition] = useState('center');
  const [opacity, setOpacity] = useState(50);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    if (!watermark.trim()) {
      message.error('请输入水印文字');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // 确保所有参数都是正确的类型
    const params = {
      text: watermark.trim(),
      position: position,
      opacity: Number(opacity),
    };

    // 验证参数
    if (isNaN(params.opacity) || params.opacity < 0 || params.opacity > 100) {
      message.error('透明度必须在0-100之间');
      return;
    }

    // 添加验证后的参数
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const response = await request.post('/api/image/watermark', formData, {
        responseType: 'blob',
      });

      if (response.data.success) {
        message.success('添加水印成功');
        setPreview(`http://localhost:3004${response.data.data.path}`);
      }
    } catch (error) {
      console.error('添加水印失败:', error);
      message.error(error.response?.data?.message || '添加水印失败');
    }
  };

  return (
    <Card title="图片水印" className="upload-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Upload
          beforeUpload={(file) => {
            if (!file.type.startsWith('image/')) {
              message.error('请上传图片文件');
              return false;
            }
            setFile(file);
            setPreview(null);
            return false;
          }}
          maxCount={1}
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

        <div className="mb-4">
          <label htmlFor="watermark-input" className="block text-sm font-medium text-gray-700 mb-2">
            水印文字
          </label>
          <input
            id="watermark-input"
            type="text"
            value={watermark}
            onChange={(e) => setWatermark(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入水印文字"
          />
        </div>

        <div>
          <span style={{ marginRight: 8 }}>位置：</span>
          <Select
            value={position}
            onChange={(value) => setPosition(value)}
            style={{ width: 200 }}
          >
            <Option value="top-left">左上</Option>
            <Option value="top-right">右上</Option>
            <Option value="center">居中</Option>
            <Option value="bottom-left">左下</Option>
            <Option value="bottom-right">右下</Option>
          </Select>
        </div>

        <div>
          <span style={{ marginRight: 8 }}>透明度：</span>
          <Slider
            min={0}
            max={100}
            value={opacity}
            onChange={(value) => setOpacity(value)}
            style={{ width: 200, display: 'inline-block', marginLeft: 8 }}
          />
          <span style={{ marginLeft: 8 }}>{opacity}%</span>
        </div>

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!file || !watermark.trim()}
        >
          添加水印
        </Button>

        {preview && (
          <div style={{ marginTop: 16 }}>
            <h3>预览：</h3>
            <img src={preview} alt="水印效果" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </Space>
    </Card>
  );
}

export default ImageWatermark;
