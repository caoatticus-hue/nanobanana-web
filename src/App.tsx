import { useState, useEffect } from 'react';
import { 
  Search, Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon,
  Download, Zap, Crown
} from 'lucide-react';
import { generateImage } from './lib/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  // 新增设置项
  const [mode, setMode] = useState<'fast' | 'high'>('high');
  const [ratio, setRatio] = useState('1:1');
  const [count, setCount] = useState(1);

  // 必应每日壁纸
  const bgUrl = "https://bing.img.run/rand_uhd.php";

  const onGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setImage(null);
    try {
      const url = await generateImage(prompt, mode, ratio);
      setImage(url);
    } catch (e) {
      alert("生成失败");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-6 transition-all">
      {/* 背景层 */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* 颜色蒙版 */}
      <div className="absolute inset-0 bg-[var(--mask-color)] transition-colors duration-500" />

      {/* 悬浮胶囊侧边栏 */}
      <aside className="absolute left-6 top-1/2 -translate-y-1/2 w-16 h-[400px] glass-panel rounded-full flex flex-col items-center py-8 gap-6 z-50">
        <NavBtn icon={<Sparkles size={22} />} active />
        <NavBtn icon={<Presentation size={22} />} />
        <NavBtn icon={<FileText size={22} />} />
        <div className="flex-1" />
        <NavBtn icon={<Sun size={22} />} />
        <NavBtn icon={<Settings size={22} />} />
      </aside>

      {/* 主操作区 */}
      <main className="relative w-full max-w-5xl h-full flex flex-col gap-6 ml-20">
        
        {/* 顶部搜索条 */}
        <header className="w-full glass-panel rounded-3xl p-2 flex items-center shadow-2xl">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            placeholder="输入创意描述..."
            className="flex-1 bg-transparent border-none outline-none px-6 text-lg placeholder:text-gray-400"
          />
          <button 
            onClick={onGenerate}
            className="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl flex items-center gap-2 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            <span className="font-bold">生成</span>
          </button>
        </header>

        {/* 下方分栏 */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* 左侧：预览区 */}
          <section className="flex-[2] glass-panel rounded-[2.5rem] relative overflow-hidden flex items-center justify-center group">
            {image ? (
              <img 
                src={image} 
                onLoad={() => setLoading(false)}
                className="max-w-full max-h-full object-contain animate-in fade-in zoom-in duration-500" 
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-4">
                <ImageIcon size={64} strokeWidth={1} />
                <p>等待灵感降临...</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 glass-panel flex flex-col items-center justify-center z-10">
                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 animate-[loading_2s_infinite]" />
                </div>
                <p className="mt-4 font-bold text-blue-500">正在{mode === 'fast' ? '极速' : '精细'}渲染</p>
              </div>
            )}
          </section>

          {/* 右侧：设置区 */}
          <section className="flex-1 glass-panel rounded-[2.5rem] p-8 flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
                <Zap size={16} /> 生成模式
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <SelectBtn 
                  label="极速" 
                  desc="~5s 响应" 
                  active={mode === 'fast'} 
                  onClick={() => setMode('fast')}
                />
                <SelectBtn 
                  label="高质量" 
                  desc="精细渲染" 
                  active={mode === 'high'} 
                  onClick={() => setMode('high')}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-4">画幅比例</h3>
              <div className="grid grid-cols-2 gap-3">
                {['1:1', '16:9', '9:16', '4:3'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`py-2 rounded-xl border-2 transition-all ${ratio === r ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-4">生成数量: {count} 张</h3>
              <input 
                type="range" min="1" max="4" value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// 辅助子组件
function NavBtn({ icon, active }: any) {
  return (
    <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-500 text-white shadow-lg scale-110' : 'text-gray-400 hover:bg-white/10'}`}>
      {icon}
    </button>
  );
}

function SelectBtn({ label, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl text-left transition-all border-2 ${active ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
    >
      <div className={`font-bold ${active ? 'text-blue-500' : ''}`}>{label}</div>
      <div className="text-xs opacity-50">{desc}</div>
    </button>
  );
}

export default App;
