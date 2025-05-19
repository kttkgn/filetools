import React, { useState, useEffect, useRef } from 'react';
import { Upload, Button, message, Space, Row, Col, InputNumber, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import request from '../utils/request';

function ImageCrop() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropParams, setCropParams] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // 当选择新图片时，获取图片尺寸
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height,
        });
        // 设置默认裁剪参数为图片的一半
        setCropParams({
          left: 0,
          top: 0,
          width: Math.floor(img.width / 2),
          height: Math.floor(img.height / 2),
        });
      };
      img.src = url;
    }
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file, imageUrl]);

  // 计算预览图片的缩放比例
  const getPreviewScale = () => {
    if (!imageRef.current || !containerRef.current) return 1;
    const containerWidth = containerRef.current.offsetWidth;
    const imageWidth = imageSize.width;
    return containerWidth / imageWidth;
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('请先选择图片');
      return;
    }

    if (cropParams.width <= 0 || cropParams.height <= 0) {
      message.error('裁剪尺寸必须大于0');
      return;
    }

    if (cropParams.left < 0 || cropParams.top < 0) {
      message.error('裁剪位置不能为负数');
      return;
    }

    if (cropParams.left + cropParams.width > imageSize.width ||
        cropParams.top + cropParams.height > imageSize.height) {
      message.error('裁剪区域超出图片范围');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    // 确保所有参数都是数字类型
    const params = {
      left: Number(cropParams.left) || 0,
      top: Number(cropParams.top) || 0,
      width: Number(cropParams.width) || 0,
      height: Number(cropParams.height) || 0,
    };

    // 验证参数
    if (isNaN(params.left) || isNaN(params.top) || isNaN(params.width) || isNaN(params.height)) {
      message.error('裁剪参数无效');
      return;
    }

    // 添加验证后的参数
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    setLoading(true);
    try {
      const response = await request.post('/api/image/crop', formData, {
        responseType: 'blob',
      });

      if (response.data.success) {
        message.success('裁剪成功');
        setPreview(URL.createObjectURL(response.data));
      }
    } catch (error) {
      console.error('裁剪失败:', error);
      message.error(error.response?.data?.message || '裁剪失败');
    } finally {
      setLoading(false);
    }
  };

  const scale = getPreviewScale();
  const previewStyle = {
    width: imageSize.width * scale,
    height: imageSize.height * scale,
    position: 'relative',
  };

  const cropBoxStyle = {
    position: 'absolute',
    left: cropParams.left * scale,
    top: cropParams.top * scale,
    width: cropParams.width * scale,
    height: cropParams.height * scale,
    border: '2px solid #1890ff',
    backgroundColor: 'rgba(24, 144, 255, 0.1)',
    pointerEvents: 'none',
  };

  return (
    <Card>
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

        {file && (
          <>
            <div ref={containerRef} style={{ marginTop: 16, overflow: 'hidden' }}>
              <div style={previewStyle}>
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="预览"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <div style={cropBoxStyle} />
              </div>
            </div>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: 8 }}>左偏移：</span>
                  <InputNumber
                    min={0}
                    max={imageSize.width}
                    value={cropParams.left}
                    onChange={(value) => setCropParams({ ...cropParams, left: value })}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: 8 }}>上偏移：</span>
                  <InputNumber
                    min={0}
                    max={imageSize.height}
                    value={cropParams.top}
                    onChange={(value) => setCropParams({ ...cropParams, top: value })}
                  />
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: 8 }}>宽度：</span>
                  <InputNumber
                    min={1}
                    max={imageSize.width - cropParams.left}
                    value={cropParams.width}
                    onChange={(value) => setCropParams({ ...cropParams, width: value })}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <span style={{ marginRight: 8 }}>高度：</span>
                  <InputNumber
                    min={1}
                    max={imageSize.height - cropParams.top}
                    value={cropParams.height}
                    onChange={(value) => setCropParams({ ...cropParams, height: value })}
                  />
                </div>
              </Col>
            </Row>
          </>
        )}

        <Button
          type="primary"
          onClick={handleUpload}
          loading={loading}
          disabled={!file || cropParams.width <= 0 || cropParams.height <= 0}
        >
          开始裁剪
        </Button>

        {preview && (
          <div style={{ marginTop: 16 }}>
            <h3>裁剪结果：</h3>
            <img src={preview} alt="裁剪结果" style={{ maxWidth: '100%' }} />
          </div>
        )}
      </Space>
    </Card>
  );
}

export default ImageCrop;
