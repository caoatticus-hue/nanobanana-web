import React, { useState } from 'react';
import { 
  Home, Search, Layout, Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon,
  Download, RefreshCw
} from 'lucide-react';
import { generateImage } from './lib/api';

function App() {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setImage(null); // 清除旧图
    try {
      const url = await generateImage(prompt);
      setImage(url);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#1a1a1a] font-sans">
      
      {/* 侧边导航 */}
      <aside className="w-20 bg-white/70 backdrop-blur-xl border-r border-gray-200 flex flex-col items-center py-10 gap-8 sticky top-0 h-screen z-20">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <Sparkles size={24} />
        </div>
        
        <nav className="flex flex-col gap-6 flex-1 text-gray-400">
          <button onClick={() => setActiveTab('image')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeTab === 'image' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-100 hover:text-blue-500'}`}>
            <ImageIcon size={24} />
          </button>
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gray-100">
            <Presentation size={24} />
          </button>
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gray-100">
            <FileText size={24} />
          </button>
        </nav>

        <div className="flex flex-col gap-6 border-t border-gray-100 pt-8 text-gray-400">
          <button className="hover:text-blue-500"><Sun size={24} /></button>
          <button className="hover:text-blue-500"><Settings size={24} /></button>
        </div>
      </aside>

      {/* 主界面 */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 bg-[#f0f2f5]/90 backdrop-blur-md z-10">
          <div className="flex-1 max-w-3xl relative">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="输入你的创意灵感 (支持中文)..."
              className="w-full h-14 bg-white rounded-full px-8 pr-16 shadow-sm border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all text-lg"
            />
            <button 
              onClick={handleGenerate}
              className="absolute right-2.5 top-2.5 bottom-2.5 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
          <div className="ml-8 w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">AI</div>
        </header>

        <section className="px-10 pb-10 flex-1 flex flex-col">
          <div className="flex gap-4 mb-8">
            <button className="px-8 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white shadow-lg">生图模式</button>
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-white p-8 flex items-center justify-center relative overflow-hidden">
            {image ? (
              <div className="relative group max-h-full">
                <img src={image} className="max-w-full max-h-[65vh] rounded-3xl shadow-2xl animate-in zoom-in" alt="AI Generated" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 rounded-3xl">
                  <button onClick={() => window.open(image)} className="p-4 bg-white rounded-full"><Download size={24} /></button>
                  <button onClick={handleGenerate} className="p-4 bg-white rounded-full"><RefreshCw size={24} /></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-300">
                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <ImageIcon size={40} />
                </div>
                <p className="text-gray-400">在上方搜索框输入，开启免费 AI 生成</p>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-bold">AI 正在努力画图中...</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
