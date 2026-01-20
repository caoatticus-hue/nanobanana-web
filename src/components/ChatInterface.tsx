import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, Message } from '../types';
import { api } from '../services/api';
import { useChatStore } from '../store';
import { formatTime, copyToClipboard } from '../utils';
import './ChatInterface.css';

interface ChatInterfaceProps {
  session: ChatSession;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ session }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, updateLastMessage } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(session.id, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chat({
        messages: [...session.messages, userMessage],
        modelId: session.modelId,
      });

      const assistantMessage: Message = {
        id: response.id || crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0]?.message?.content || '没有收到响应',
        timestamp: Date.now(),
        modelId: session.modelId,
      };

      addMessage(session.id, assistantMessage);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `错误：${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: Date.now(),
      };
      addMessage(session.id, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string) => {
    await copyToClipboard(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {session.messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">AI</div>
            <h2>AI Studio</h2>
            <p>开始与AI助手对话吧</p>
            <div className="suggestions">
              <button onClick={() => setInput('你好，请介绍一下你自己')}>
                介绍你自己
              </button>
              <button onClick={() => setInput('你能帮我做什么？')}>
                能力范围
              </button>
              <button onClick={() => setInput('讲个笑话吧')}>
                讲个笑话
              </button>
            </div>
          </div>
        ) : (
          session.messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '我' : 'AI'}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? '你' : 'AI助手'}
                  </span>
                  <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="message-text">
                  {message.content}
                </div>
                {message.role === 'assistant' && (
                  <button 
                    className="copy-btn"
                    onClick={() => handleCopy(message.content)}
                    title="复制"
                  >
                    复制
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message assistant loading">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            disabled={isLoading}
          />
          <b
