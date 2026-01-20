import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useChatStore } from './store';
import './App.css';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { sessions, currentSession, loadSessions, createSession } = useChatStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 如果没有会话，创建一个新的
  useEffect(() => {
    if (sessions.length === 0) {
      createSession();
    }
  }, [sessions.length, createSession]);

  return (
    <div className="app">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen}
      />
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
          {currentSession ? (
            <ChatInterface session={currentSession} />
          ) : (
            <div className="no-session">
              <h2>欢迎使用 AI Studio</h2>
              <p>选择一个会话或开始新的对话</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;

