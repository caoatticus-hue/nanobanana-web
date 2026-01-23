import React, { useState, useRef } from 'react';
import { ImageGeneratorProps, GenerationHistory } from '../types';
import { suggestions } from '../utils/constants';
import './ImageGenerator.css';

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ engine, onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageCount, setImageCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 生成示例图片
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(
          Math.random() * 512,
          Math.random() * 512,
          Math.random() * 80 + 20,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      setResult(canvas.toDataURL('image/png'));
    }
    
    setIsGenerating(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="image-generator">
      <button className="back-btn" onClick={onBack}>
        ← 选择其他引擎
      </button>

      <div className="generator-layout">
        <div className="main-area">
          <div className="input-section">
            <div className="reference-upload" onClick={() => fileInputRef.current?.click()}>
              {referenceImage ? (
                <img src={referenceImage} alt="Reference" className="reference-preview" />
              ) : (
                <div className="upload-placeholder">
                  <span>📷</span>
                  <p>拖拽图片到此处或点击上传</p>
                  <span className="hint">支持 JPG、PNG 格式</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileUpload}
                hidden
              />
            </div>

            <div className="settings-row">
              <div className="setting-group">
                <label>图片尺寸</label>
                <div className="aspect-buttons">
                  {['1:1', '16:9', '9:16', '4:3', '3:4'].map(ratio => (
                    <button
                      key={ratio}
                      className={`aspect-btn ${aspectRatio === ratio ? 'active' : ''}`}
                      onClick={() => setAspectRatio(ratio)}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>生成张数</label>
                <select 
                  value={imageCount} 
                  onChange={(e) => setImageCount(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} 张</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="prompt-section">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述你想要的图片"
                rows={4}
              />
              
              <div className="suggestions">
                {suggestions.map((text, index) => (
                  <button
                    key={index}
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(text)}
                  >
                    {text}
                  </button>
                ))}
              </div>

              <button 
                className="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? '生成中...' : '开始生成'}
              </button>
            </div>
          </div>

          {result && (
            <div className="result-section">
              <img src={result} alt="Generated" 
              className="result-image" />

