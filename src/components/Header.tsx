import React from 'react';
import './Header.css';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarOpen }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="menu-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">AI Studio</span>
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn" title="设置">
          ⚙️
        </button>
        <button className="header-btn" title="帮助">
          ❓
        </button>
      </div>
    </header>
  );
};

