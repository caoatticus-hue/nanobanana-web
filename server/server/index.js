/**
 * Vercel Serverless Function - AI Studio Backend
 */

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 健康检查
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'AI Studio Backend',
    platform: 'vercel'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    platform: 'vercel'
  });
});

// 阿里通义图像生成任务
app.post('/api/tasks', async (req, res) => {
  try {
    const { apiKey, prompt, negative_prompt, size, style, n } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: '缺少API密钥',
        message: '请在设置中配置阿里云API密钥'
      });
    }

    const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

    const payload = {
      model: 'wanx-v1',
      input: {
        prompt: prompt,
        negative_prompt: negative_prompt || '低质量, 模糊, 扭曲, 畸形',
      },
      parameters: {
        style: style || '<auto>',
        size: size || '1024*1024',
        n: n || 1,
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-DashScope-Async': 'enable',
      },
      timeout: 60000,
    });

    if (response.data.output?.task_id) {
      res.json({
        success: true,
        output: { task_id: response.data.output.task_id }
      });
    } else {
      res.status(500).json({
        error: '创建任务失败',
        message: '响应中未包含task_id'
      });
    }

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: '创建任务失败',
      message: error.response?.data?.message || error.message
    });
  }
});

// 查询任务状态
app.get('/api/task-status/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const apiKey = req.headers.authorization?.replace('Bearer ', '') || req.query.apiKey;

    if (!apiKey) {
      return res.status(400).json({ error: '缺少API密钥' });
    }

    const url = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;

    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      timeout: 30000,
    });

    const result = { success: true, output: response.data.output };

    if (response.data.output?.task_status === 'SUCCEEDED') {
      const url = response.data.output?.results?.[0]?.url;
      if (url) result.output.url = url;
    }

    res.json(result);

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: '查询任务失败',
      message: error.message
    });
  }
});

// 导出为 Vercel Serverless Function
module.exports = app;

