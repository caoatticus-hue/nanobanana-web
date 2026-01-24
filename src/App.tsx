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
      
      {/* 左侧垂直导航栏 - 磨砂玻璃效果 */}
      <aside className="w-20 bg-white/70 backdrop-blur-xl border-r border-gray-200 flex flex-col items-center py-10 gap-8 sticky top-0 h-screen z-20">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4 cursor-pointer">
          <Sparkles size={24} />
        </div>
        
        <nav className="flex flex-col gap-6 flex-1">
          <NavIcon icon={<Home size={24} />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavIcon icon={<ImageIcon size={24} />} active={activeTab === 'image'} onClick={() => setActiveTab('image')} />
          <NavIcon icon={<Presentation size={24} />} active={activeTab === 'ppt'} onClick={() => setActiveTab('ppt')} />
          <NavIcon icon={<FileText size={24} />} active={activeTab === 'paper'} onClick={() => setActiveTab('paper')} />
        </nav>

        <div className="flex flex-col gap-6 border-t border-gray-100 pt-8">
          <NavIcon icon={<Sun size={24} />} />
          <NavIcon icon={<Settings size={24} />} />
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* 顶部搜索栏 */}
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 bg-[#f0f2f5]/90 backdrop-blur-md z-10">
          <div className="flex-1 max-w-3xl relative group">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="输入灵感提示词，如：一个在云端喝咖啡的猫..."
              className="w-full h-14 bg-white rounded-full px-8 pr-16 shadow-sm border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all text-lg"
            />
            <button 
              onClick={handleGenerate}
              className="absolute right-2.5 top-2.5 bottom-2.5 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:brightness-110 active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
          
          <div className="flex items-center gap-4 ml-10">
             <div className="w-11 h-11 rounded-full border-2 border-white shadow-sm bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
               AI
             </div>
          </div>
        </header>

        {/* 内容展示区 */}
        <section className="px-10 pb-10 flex-1 flex flex-col">
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton label="AI 生图工作室" active={activeTab === 'image'} onClick={() => setActiveTab('image')} />
            <TabButton label="历史记录" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          </div>

          {/* 生成主卡片 */}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 flex items-center justify-center relative overflow-hidden">
            {image ? (
              <div className="relative h-full w-full flex flex-col items-center justify-center gap-6">
                <div className="relative group max-h-[70vh] overflow-hidden rounded-3xl shadow-2xl border border-gray-100">
                  <img src={image} className="max-w-full h-full object-contain animate-in fade-in zoom-in duration-500" alt="Generated" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                        onClick={() => { const a = document.createElement('a'); a.href = image; a.download = 'ai-studio.png'; a.click(); }}
                        className="p-4 bg-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Download className="text-black" />
                    </button>
                    <button onClick={handleGenerate} className="p-4 bg-white rounded-full hover:scale-110 transition-transform">
                      <RefreshCw className="text-black" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-lg text-center px-4 italic">"{prompt}"</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 text-gray-200">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                   <ImageIcon size={48} strokeWidth={1} className="text-gray-300" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-medium text-gray-400">开启你的创意实验</p>
                    <p className="text-gray-300 text-sm mt-2">支持英文/中文描述词</p>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-blue-600 font-bold tracking-widest animate-pulse">正在构思画面...</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function NavIcon({ icon, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}>
      {icon}
    </button>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}>
      {label}
    </button>
  );
}

export default App;
