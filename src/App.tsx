import { useState, useEffect } from 'react';
import { 
  Sun, Settings, Sparkles, 
  Presentation, Loader2, Image as ImageIcon,
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

  // 必应背景
  const bgUrl = "https://bing.img.run/rand_uhd.php";

  // 真正的下载函数
  const downloadImg = async () => {
    if (!image) return;
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `AI-STUDIO-${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(image, '_blank');
    }
  };

  const onGenerate = async () => {
    if (!prompt || loading) return;
    setLoading(true);
    try {
      const url = await generateImage(prompt, mode, ratio);
      const tempImg = new Image();
      tempImg.src = url;
      tempImg.onload = () => {
        setImage(url);
        setLoading(false);
      };
    } catch (e) {
      alert("生成失败，请重试");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col">
      {/* 1. 最底层背景 */}
      <img 
        src={bgUrl} 
        className="absolute inset-0 w-full h-full object-cover z-0" 
        alt="background"
      />
      {/* 2. 背景遮罩 */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 z-10" />

      {/* 3. 内容层：按照设计稿排布 */}
      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        
        {/* 顶部标题区 */}
        <div className="flex items-center justify-between px-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">AI 绘画</h1>
          <div className="flex items-center gap-4 ios-panel px-4 py-2 rounded-full text-sm text-white/80">
            <Sparkles size={16} className="text-blue-400" />
            <span>智能引擎已就绪</span>
          </div>
        </div>

        {/* 创意输入框 (横跨全屏) */}
        <div className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            placeholder="输入你的创意描述，让 AI 为你生成独特的图片..."
            className="flex-1 bg-transparent border-none outline-none px-6 text-lg text-white placeholder:text-white/40"
          />
          <button 
            onClick={onGenerate}
            className="h-16 px-12 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center gap-2 transition-all active:scale-95 text-white font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
            生成按钮
          </button>
        </div>

        {/* 下方三栏自适应区域 */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* 左侧：侧边栏 (圆形按钮，胶囊背景) */}
          <aside className="w-20 ios-panel flex flex-col items-center py-8 gap-6 shrink-0">
            <NavIcon icon={<Sparkles />} active />
            <NavIcon icon={<Presentation />} />
            <NavIcon icon={<Clock />} />
            <div className="flex-1" />
            <NavIcon icon={<Sun />} />
            <NavIcon icon={<Settings />} />
          </aside>

          {/* 中间：预览区 (最大) */}
          <section className="flex-1 ios-panel relative overflow-hidden flex items-center justify-center group">
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center p-6">
                <img src={image} className="max-w-full max-h-full rounded-xl object-contain shadow-2xl" alt="result" />
                <button 
                  onClick={downloadImg}
                  className="absolute top-6 right-6 p-4 ios-panel rounded-full hover:bg-blue-600 text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Download size={24} />
                </button>
              </div>
            ) : (
              <div className="text-white/20 flex flex-col items-center gap-4">
                <ImageIcon size={100} strokeWidth={0.5} />
                <p className="tracking-[0.4em] text-xs">AI STUDIO V2.2</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center z-30">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="mt-4 font-bold text-blue-400">正在绘制...</p>
              </div>
            )}
          </section>

          {/* 右侧：设置区 (固定宽度) */}
          <section className="w-80 ios-panel p-8 flex flex-col gap-8 shrink-0 overflow-y-auto no-scrollbar">
            <div>
              <p className="text-[10px] font-black opacity-30 mb-4 tracking-widest text-white uppercase">渲染引擎</p>
              <div className="flex flex-col gap-3">
                <ModeBtn title="极速模式" active={mode === 'fast'} onClick={() => setMode('fast')} />
                <ModeBtn title="画质模式" active={mode === 'high'} onClick={() => setMode('high')} />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black opacity-30 mb-4 tracking-widest text-white uppercase">画幅比例</p>
              <div className="grid grid-cols-2 gap-3">
                {['1:1', '16:9', '9:16', '4:3', '3:4'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${ratio === r ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-transparent bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-[10px] font-black opacity-30 mb-4 text-white">
                <span>生成张数</span>
                <span className="text-blue-400">{count} 张</span>
              </div>
              <input 
                type="range" min="1" max="4" value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none accent-blue-500 cursor-pointer"
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// 子组件：侧边栏图标
function NavIcon({ icon, active }: { icon: any, active?: boolean }) {
  return (
    <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:bg-white/10'}`}>
      {icon}
    </button>
  );
}

// 子组件：模式选择
function ModeBtn({ title, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-4 rounded-2xl text-left border-2 transition-all ${active ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-transparent bg-white/5 text-white/60 hover:bg-white/10'}`}
    >
      <p className="text-sm font-bold">{title}</p>
    </button>
  );
}

export default App;
