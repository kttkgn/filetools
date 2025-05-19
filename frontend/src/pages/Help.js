import React from 'react';
import { Card, Typography, Collapse } from 'antd';

const { Title, Paragraph } = Typography;

function Help() {
  const helpItems = [
    {
      key: '1',
      label: '文件转换',
      children: (
        <Paragraph>
          <ol>
            <li>点击&quot;选择文件&quot;按钮上传需要转换的文件</li>
            <li>选择目标格式</li>
            <li>点击&quot;开始转换&quot;按钮</li>
            <li>转换完成后会自动下载转换后的文件</li>
          </ol>
        </Paragraph>
      ),
    },
    {
      key: '2',
      label: '图片压缩',
      children: (
        <Paragraph>
          <ol>
            <li>点击&quot;选择图片&quot;按钮上传需要压缩的图片</li>
            <li>使用滑块调节压缩质量（1-100）</li>
            <li>点击&quot;开始压缩&quot;按钮</li>
            <li>压缩完成后会自动下载压缩后的图片</li>
          </ol>
        </Paragraph>
      ),
    },
    {
      key: '3',
      label: '图片裁剪',
      children: (
        <Paragraph>
          <ol>
            <li>点击&quot;选择图片&quot;按钮上传需要裁剪的图片</li>
            <li>输入裁剪参数：
              <ul>
                <li>左边距：距离图片左边的像素数</li>
                <li>上边距：距离图片上边的像素数</li>
                <li>宽度：裁剪区域的宽度</li>
                <li>高度：裁剪区域的高度</li>
              </ul>
            </li>
            <li>点击&quot;开始裁剪&quot;按钮</li>
            <li>裁剪完成后会自动下载裁剪后的图片</li>
          </ol>
        </Paragraph>
      ),
    },
    {
      key: '4',
      label: '图片水印',
      children: (
        <Paragraph>
          <ol>
            <li>点击&quot;选择图片&quot;按钮上传需要添加水印的图片</li>
            <li>输入水印文字</li>
            <li>选择水印位置（左上、右上、中心、左下、右下）</li>
            <li>调节水印透明度（1-100）</li>
            <li>点击&quot;添加水印&quot;按钮</li>
            <li>处理完成后会自动下载添加水印后的图片</li>
          </ol>
        </Paragraph>
      ),
    },
  ];

  const faqItems = [
    {
      key: '6',
      label: '支持哪些文件格式？',
      children: (
        <Paragraph>
          我们支持多种常见的文件格式，包括但不限于：
          <ul>
            <li>文档格式：PDF、TXT、DOC、DOCX等</li>
            <li>图片格式：PNG、JPG、WEBP、GIF等</li>
          </ul>
        </Paragraph>
      ),
    },
    {
      key: '7',
      label: '文件大小有限制吗？',
      children: (
        <Paragraph>
          是的，为了确保服务的稳定性，我们对上传文件的大小有一定限制：
          <ul>
            <li>单个文件最大不超过50MB</li>
            <li>图片文件建议不超过20MB</li>
          </ul>
        </Paragraph>
      ),
    },
    {
      key: '8',
      label: '如何保证文件安全？',
      children: (
        <Paragraph>
          我们非常重视用户数据安全：
          <ul>
            <li>所有文件处理都在服务器端进行</li>
            <li>处理完成后立即删除文件</li>
            <li>使用HTTPS加密传输</li>
            <li>不会保存或分享您的文件</li>
          </ul>
        </Paragraph>
      ),
    },
  ];

  return (
    <div className="container">
      <Card>
        <Typography>
          <Title level={2}>使用帮助</Title>
          <Paragraph>
            欢迎使用我们的文件转换和图片处理工具。以下是各个功能的使用说明：
          </Paragraph>

          <Collapse defaultActiveKey={['1']} items={helpItems} />

          <Title level={3} style={{ marginTop: 24 }}>常见问题</Title>
          <Collapse items={faqItems} />
        </Typography>
      </Card>
    </div>
  );
}

export default Help;
