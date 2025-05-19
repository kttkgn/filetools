import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

function About() {
  return (
    <div className="page-container">
      <Card>
        <Typography>
          <Title level={2}>关于我们</Title>
          <Paragraph>
            我们是一个专注于提供高质量文件转换和图片处理服务的团队。我们的目标是帮助用户轻松处理各种文件格式转换和图片编辑需求。
          </Paragraph>

          <Title level={3}>我们的服务</Title>
          <Paragraph>
            <ul>
              <li>文件格式转换：支持多种文件格式之间的相互转换</li>
              <li>图片格式转换：支持主流图片格式的转换</li>
              <li>图片压缩：帮助减小图片文件大小</li>
              <li>图片裁剪：精确控制图片尺寸和范围</li>
              <li>图片水印：为图片添加文字水印</li>
            </ul>
          </Paragraph>

          <Title level={3}>我们的优势</Title>
          <Paragraph>
            <ul>
              <li>简单易用：直观的界面设计，操作简单</li>
              <li>快速处理：高效的转换和处理速度</li>
              <li>安全可靠：保护用户数据安全</li>
              <li>专业支持：提供专业的技术支持</li>
            </ul>
          </Paragraph>

          <Title level={3}>联系我们</Title>
          <Paragraph>
            如果您有任何问题或建议，欢迎通过以下方式联系我们：
            <br />
            邮箱：support@example.com
          </Paragraph>
        </Typography>
      </Card>
    </div>
  );
}

export default About;
