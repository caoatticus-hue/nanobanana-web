import { useState } from 'react';
import { 
  Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon,
  Zap, Download, Clock
} from 'lucide-react';
import { generateImage } from './lib/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'fast' | 'high'>('fast');
  const [ratio, setRatio] = useState('1:1');
  const [count, setCount] = useState(1);

  // 必应背景预设
  const bgUrl = "https://bing.img.run/rand_uhd.php";

  // 修复后的下载逻辑：真正保存文件
  const handleDownload = async () => {
    if (!image) return;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI-Studio-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      window.open(image, '_blank'); // 备选方案
    }
  };

  const onGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    
    try {
      // 传入当前模式和比例
      const url = await generateImage(prompt, mode, ratio);
      
      // 预加载图片对象，确保加载成功后再显示
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImage(url);
        setLoading(false);
      };
      img.onerror = () => {
        throw new Error("Load failed");
      };
    } catch (e) {
      alert("生成超时，请检查网络或更换节点");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden text-white/90">
      {/* 稳定背景层 */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})`, backgroundColor: '#1a1a1a' }}
      />
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-[2px]" />

      <div className="app-container relative z-10">
        
        {/* 顶部搜索条：高度统一，圆角适中 */}
        <header className="w-full h-20 ios-card p-2 flex items-center shadow-lg">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            placeholder="描述你想生成的画面..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg placeholder:text-white/40"
          />
          <button 
            onClick={onGenerate}
            className="h-16 px-10 bg-blue-600 hover:bg-blue-500 rounded-[22px] flex items-center gap-2 transition-transform active:scale-95 font-bold shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            生成
          </button>
        </header>

        <div className="flex-1 flex gap-8 min-h-0">
          
          {/* 侧边栏：纯圆形按钮，悬浮感 */}
          <aside className="flex flex-col gap-6">
            <CircleNavBtn icon={<Sparkles size={24} />} active />
            <CircleNavBtn icon={<Presentation size={24} />} />
            <CircleNavBtn icon={<Clock size={24} />} />
            <div className="flex-1" />
            <CircleNavBtn icon={<Sun size={24} />} />
            <CircleNavBtn icon={<Settings size={24} />} />
          </aside>

          {/* 预览区 */}
          <section className="flex-[3] ios-card relative overflow-hidden flex items-center justify-center group shadow-2xl">
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <img 
                  src={image} 
                  className="max-w-full max-h-full rounded-[20px] object-contain shadow-2xl transition-all" 
                  alt="AI Result"
                />
                <button 
                  onClick={handleDownload}
                  className="absolute top-8 right-8 p-5 ios-card rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 shadow-xl"
                >
                  <Download size={24} />
                </button>
              </div>
            ) : (
              <div className="opacity-20 flex flex-col items-center gap-6">
                <ImageIcon size={120} strokeWidth={0.5} />
                <p className="tracking-[0.5em] text-xs font-light">READY TO CREATE</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 ios-card flex flex-col items-center justify-center z-20 bg-black/40">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="mt-6 font-bold tracking-widest text-blue-400">正在同步云端算力...</p>
              </div>
            )}
          </section>

          {/* 设置区 */}
          <section className="flex-1 ios-card p-8 flex flex-col gap-8 shadow-2xl overflow-y-auto no-scrollbar">
            <div>
              <div className="text-[10px] font-black opacity-30 mb-4 tracking-[0.2em] uppercase">渲染引擎</div>
              <div className="flex flex-col gap-3">
                <ModeItem 
                  title="极速模式" desc="约 10s 出图" 
                  active={mode === 'fast'} 
                  onClick={() => setMode('fast')}
                />
                <ModeItem 
                  title="画质模式" desc="深度细节" 
                  active={mode === 'high'} 
                  onClick={() => setMode('high')}
                />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black opacity-30 mb-4 tracking-[0.2em] uppercase">画幅比例</div>
              <div className="grid grid-cols-2 gap-3">
                {['1:1', '16:9', '9:16', '4:3'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`py-4 rounded-[18px] text-xs font-bold transition-all border-2 ${ratio === r ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-[10px] font-black opacity-30 mb-4 tracking-[0.2em]">
                <span>生成张数</span>
                <span className="text-blue-400">{count} 张</span>
              </div>
              <input 
                type="range" min="1" max="4" value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function CircleNavBtn({ icon, active }: { icon: any, active?: boolean }) {
  return (
    <button className={`ios-btn-circle transition-all shadow-lg ${active ? 'bg-blue-600 text-white scale-110 shadow-blue-500/40' : 'ios-card text-white/50 hover:scale-105'}`}>
      {icon}
    </button>
  );
}

function ModeItem({ title, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-5 rounded-[22px] text-left transition-all border-2 ${active ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
    >
      <div className={`text-sm font-bold ${active ? 'text-blue-400' : ''}`}>{title}</div>
      <div className="text-[10px] opacity-40 mt-1">{desc}</div>
    </button>
  );
}

export default App;
