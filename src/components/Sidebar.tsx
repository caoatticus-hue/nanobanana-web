import React from 'react';
import { useChatStore } from '../store';
import { formatTime, truncateText } from '../utils';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { 
    sessions, 
    currentSession, 
    createSession, 
    deleteSession, 
    selectSession,
    updateSession,
  } = useChatStore();

  const handleNewChat = () => {
    createSession();
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个对话吗？')) {
      deleteSession(id);
    }
  };

  const handleSelectSession = (id: string) => {
    selectSession(id);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={handleNewChat}>
          <span>+</span> 新建对话
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sessions-list">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${currentSession?.id === session.id ? 'active' : ''}`}
              onClick={() => handleSelectSession(session.id)}
            >
              <div className="session-info">
                <span className="session-icon">💬</span>
                <span className="session-title">
                  {truncateText(session.title || '新对话', 15)}
                </span>
              </div>
              <div className="session-meta">
                <span className="session-time">
                  {formatTime(session.updatedAt)}
                </span>
                <button 
                  className="delete-btn"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">U</div>
          <span className="user-name">用户</span>
        </div>
      </div>
    </aside>
  );
};

