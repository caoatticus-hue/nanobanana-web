import React, { useState } from 'react';
import { 
  Home, Search, Layout, Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon 
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
      alert("生成失败: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f2f5] text-[#1a1a1a] font-sans">
      
      {/* 左侧垂直导航栏 - 参考 B 站平板端布局 */}
      <aside className="w-20 bg-white/70 backdrop-blur-xl border-r border-gray-200 flex flex-col items-center py-10 gap-8 sticky top-0 h-screen z-20">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200/50 mb-4">
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
        
        {/* 顶部搜索栏 - 胶囊设计 */}
        <header className="h-24 px-10 flex items-center justify-between sticky top-0 bg-[#f0f2f5]/90 backdrop-blur-md z-10">
          <div className="flex-1 max-w-3xl relative group">
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="描述你想生成的画面..."
              className="w-full h-14 bg-white rounded-full px-8 pr-16 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-transparent focus:border-blue-400 focus:outline-none transition-all text-lg"
            />
            <button 
              onClick={handleGenerate}
              className="absolute right-2.5 top-2.5 bottom-2.5 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
          
          <div className="flex items-center gap-6 ml-10">
             <div className="w-11 h-11 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-200">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" />
             </div>
          </div>
        </header>

        {/* 内容主体 */}
        <section className="px-10 pb-10">
          {/* 功能标签 */}
          <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton label="个性化生图" active={activeTab === 'image'} onClick={() => setActiveTab('image')} />
            <TabButton label="智能 PPT" active={activeTab === 'ppt'} onClick={() => setActiveTab('ppt')} />
            <TabButton label="文献助手" active={activeTab === 'paper'} onClick={() => setActiveTab('paper')} />
            <TabButton label="热门灵感" active={activeTab === 'hot'} onClick={() => setActiveTab('hot')} />
          </div>

          {/* 生成展示卡片 */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white p-8 min-h-[65vh] flex items-center justify-center relative group">
            {image ? (
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img src={image} className="max-w-full h-auto animate-in fade-in zoom-in duration-500" alt="Result" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl">保存图片</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 text-gray-200">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center">
                   <ImageIcon size={48} strokeWidth={1} />
                </div>
                <p className="text-xl font-light text-gray-400">在上方输入创意，开启 AI 创作之旅</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-[2.5rem]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0"></div>
                </div>
                <p className="mt-4 text-blue-600 font-bold tracking-widest">AI 处理中...</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// 子组件：导航图标
function NavIcon({ icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
        active 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' 
        : 'text-gray-400 hover:bg-gray-100 hover:text-blue-500'
      }`}
    >
      {icon}
    </button>
  );
}

// 子组件：功能切换按钮
function TabButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 rounded-2xl text-base font-semibold whitespace-nowrap transition-all ${
        active 
        ? 'bg-blue-500 text-white shadow-xl shadow-blue-100 scale-105' 
        : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

export default App;
