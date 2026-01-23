import React from 'react';
import './EngineSelector.css';

interface EngineSelectorProps {
  onSelect: (engineId: string) => void;
}

const engines = [
  { id: 'doubao', name: '豆包', provider: '字节跳动', icon: '💎', region: '国内' },
  { id: 'gemini', name: 'Google Gemini', provider: 'Google', icon: '🌐', region: '国际' },
  { id: 'openai', name: 'OpenAI DALL-E', provider: 'OpenAI', icon: '🎨', region: '国际' },
  { id: 'baidu', name: '百度文心', provider: '百度', icon: '🔍', region: '国内' },
  { id: 'ali', name: '阿里通义', provider: '阿里云', icon: '☁️', region: '国内' },
  { id: 'xunfei', name: '讯飞星火', provider: '讯飞', icon: '🔥', region: '国内' },
  { id: 'tencent', name: '腾讯混元', provider: '腾讯', icon: '🐧', region: '国内' },
  { id: 'midjourney', name: 'Midjourney', provider: 'Discord', icon: '🎭', region: '国际' },
  { id: 'stability', name: 'Stability AI', provider: 'Stability', icon: '⚡', region: '国际' },
];

export const EngineSelector: React.FC<EngineSelectorProps> = ({ onSelect }) => {
  return (
    <div className="engine-selector">
      <div className="welcome-section">
        <h2>欢迎使用 AI Studio</h2>
        <p>选择最适合你的 AI 图像生成引擎</p>
      </div>

      <div className="engine-categories">
        <div className="category">
          <h3>💎 付费 API</h3>
          <div className="engine-grid">
            {engines.map(engine => (
              <div 
                key={engine.id}
                className="engine-card"
                onClick={() => onSelect(engine.id)}
              >
                <span className="engine-icon">{engine.icon}</span>
                <div className="engine-info">
                  <span className="engine-name">{engine.name}</span>
                  <span className="engine-provider">{engine.provider}</span>
                </div>
                <span className="engine-region">{engine.region}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="category">
          <h3>🖥️ 本地 AI</h3>
          <div className="local-ai-card" onClick={() => onSelect('local')}>
            <span className="local-icon">🖥️</span>
            <div className="local-info">
              <span className="local-name">暂不配置，使用本地AI进行图片生成</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
