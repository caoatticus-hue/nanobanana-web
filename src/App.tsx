import { useState } from 'react';
import { 
  Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon,
  Zap, RefreshCw
} from 'lucide-react';
import { generateImage } from './lib/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'fast' | 'high'>('high');
  const [ratio, setRatio] = useState('1:1');
  const [count, setCount] = useState(1);

  // 必应随机壁纸 API
  const bgUrl = "https://bing.img.run/rand_uhd.php";

  const onGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    setImage(null);
    try {
      const url = await generateImage(prompt, mode, ratio);
      setImage(url);
    } catch (e) {
      alert("生成请求异常");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* 必应背景层 */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[20s] animate-pulse"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* 智能遮罩：白天模式浅色，黑夜模式深色 */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/50 transition-colors" />

      {/* 悬浮胶囊侧边栏 */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-[420px] glass-panel rounded-full flex flex-col items-center py-10 gap-8 z-50 shadow-2xl">
        <NavBtn icon={<Sparkles size={22} />} active />
        <NavBtn icon={<Presentation size={22} />} />
        <NavBtn icon={<FileText size={22} />} />
        <div className="flex-1" />
        <NavBtn icon={<Sun size={22} />} />
        <NavBtn icon={<Settings size={22} />} />
      </aside>

      {/* 主画布 */}
      <main className="relative w-full max-w-6xl h-full flex flex-col gap-6 ml-24">
        
        {/* 搜索栏 */}
        <header className="w-full glass-panel rounded-3xl p-2 flex items-center shadow-xl">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            placeholder="让 AI 为你绘制..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg text-white placeholder:text-white/60"
          />
          <button 
            onClick={onGenerate}
            className="h-12 px-10 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-lg font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            生成
          </button>
        </header>

        {/* 核心功能区 */}
        <div className="flex-1 flex gap-6 min-h-0 pb-4">
          
          {/* 预览卡片 */}
          <section className="flex-[2] glass-panel rounded-[3rem] relative overflow-hidden flex items-center justify-center shadow-2xl group">
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img 
                  src={image} 
                  onLoad={() => setLoading(false)}
                  className="max-w-full max-h-full rounded-2xl object-contain transition-all duration-700 ease-out" 
                  alt="Result"
                />
                <div className="absolute bottom-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => window.open(image)} className="p-4 glass-panel rounded-full text-white hover:bg-blue-500"><RefreshCw size={20}/></button>
                </div>
              </div>
            ) : (
              <div className="text-white/40 flex flex-col items-center gap-4">
                <ImageIcon size={80} strokeWidth={1} className="opacity-20" />
                <p className="tracking-widest font-light">AI STUDIO V2.0</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 glass-panel flex flex-col items-center justify-center z-10">
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-1/2 animate-loading" />
                </div>
                <p className="mt-6 font-bold text-blue-300 tracking-[0.2em] animate-pulse">
                  {mode === 'fast' ? '极速出图中' : '精细构思中'}
                </p>
              </div>
            )}
          </section>

          {/* 设置面板 */}
          <section className="flex-1 glass-panel rounded-[3rem] p-8 flex flex-col gap-10 shadow-2xl text-white">
            <div>
              <div className="text-xs font-bold text-white/40 mb-5 tracking-widest uppercase">渲染模式</div>
              <div className="grid grid-cols-2 gap-4">
                <ModeCard 
                  label="极速" desc="优先响应" 
                  active={mode === 'fast'} 
                  onClick={() => setMode('fast')}
                />
                <ModeCard 
                  label="质量" desc="细节拉满" 
                  active={mode === 'high'} 
                  onClick={() => setMode('high')}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-white/40 mb-5 tracking-widest uppercase">画布比例</div>
              <div className="grid grid-cols-2 gap-3">
                {['1:1', '16:9', '9:16', '4:3'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`py-3 rounded-2xl text-sm transition-all border ${ratio === r ? 'border-blue-400 bg-blue-400/20 text-white' : 'border-white/5 bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold text-white/40 mb-4 tracking-widest uppercase">
                <span>生成数量</span>
                <span className="text-blue-400">{count} 张</span>
              </div>
              <input 
                type="range" min="1" max="4" value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function NavBtn({ icon, active }: { icon: any, active?: boolean }) {
  return (
    <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-500 text-white shadow-xl scale-110' : 'text-white/50 hover:bg-white/10'}`}>
      {icon}
    </button>
  );
}

function ModeCard({ label, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-5 rounded-[2rem] text-left transition-all border ${active ? 'border-blue-400 bg-blue-400/20' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
    >
      <div className={`text-lg font-bold ${active ? 'text-blue-400' : 'text-white'}`}>{label}</div>
      <div className="text-[10px] opacity-40 mt-1 uppercase tracking-tighter">{desc}</div>
    </button>
  );
}

export default App;
