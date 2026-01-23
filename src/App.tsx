import React, { useState } from 'react';
import { EngineSelector } from './components/EngineSelector';
import { ImageGenerator } from './components/ImageGenerator';
import './App.css';

function App() {
  const [selectedEngine, setSelectedEngine] = useState<string | null>(null);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">✦</span>
          <h1>AI Studio</h1>
        </div>
        <div className="header-actions">
          <button className="header-btn">设置</button>
          <div className="user-avatar">U</div>
        </div>
      </header>

      <main className="main-content">
        {!selectedEngine ? (
          <EngineSelector onSelect={setSelectedEngine} />
        ) : (
          <ImageGenerator 
            engine={selectedEngine} 
            onBack={() => setSelectedEngine(null)}
          />
        )}
      </main>

      <footer className="footer">
        <p>AI Studio v2.0 • Created by MiniMax Agent</p>
      </footer>
    </div>
  );
}

export default App;

