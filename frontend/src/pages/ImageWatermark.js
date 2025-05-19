import React, { useState } from 'react';
import { Upload, Button, Input, Select, Slider, message, Card, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Option } = Select;

function ImageWatermark() {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('center');
  const [opacity, setOpacity] = useState(50);
  const [fontSize, setFontSize] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    if (!watermarkText.trim()) {
      message.error('请输入水印文字');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', watermarkText.trim());
    formData.append('position', position);
    formData.append('opacity', opacity.toString());
    formData.append('fontSize', fontSize.toString());

    setLoading(true);
    try {
      const response = await request.post('/api/image/watermark', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `watermarked_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      message.success('添加水印成功');
    } catch (error) {
      message.error('添加水印失败: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card title="图片水印" className="upload-card">
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          maxCount={1}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>

        {file && (
          <>
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>水印文字：</div>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="请输入水印文字"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>字体大小：</div>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min={12}
                max={72}
              />
              <p className="mt-1 text-sm text-gray-500">建议范围：12-72</p>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>水印位置：</div>
              <Select
                value={position}
                onChange={setPosition}
                style={{ width: '100%' }}
              >
                <Option value="top-left">左上</Option>
                <Option value="top-right">右上</Option>
                <Option value="center">中心</Option>
                <Option value="bottom-left">左下</Option>
                <Option value="bottom-right">右下</Option>
              </Select>
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>透明度：</div>
              <Row align="middle">
                <Col flex="auto">
                  <Slider
                    value={opacity}
                    onChange={setOpacity}
                    min={1}
                    max={100}
                  />
                </Col>
                <Col style={{ marginLeft: 16 }}>
                  <span>{opacity}%</span>
                </Col>
              </Row>
            </div>

            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              style={{ marginTop: 16 }}
            >
              添加水印
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

export default ImageWatermark;
