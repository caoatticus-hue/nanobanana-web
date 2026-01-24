import { useState } from 'react';
import { 
  Sun, Settings, Sparkles, 
  FileText, Presentation, Loader2, Image as ImageIcon,
  Zap, Download
} from 'lucide-react';
import { generateImage } from './lib/api';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'fast' | 'high'>('fast'); // 默认极速，应对生成能力弱的问题
  const [ratio, setRatio] = useState('1:1');
  const [count, setCount] = useState(1);

  // 必应壁纸固定接口
  const bgUrl = "https://bing.img.run/rand_uhd.php";

  const onGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    // 立即清除旧图或保持旧图直到新图加载，这里选择清除以获得反馈
    setImage(null); 
    
    try {
      const url = await generateImage(prompt, mode, ratio);
      setImage(url);
      // 注意：为了解决“迟迟无法生成”的体感，我们在获取 URL 后立即关闭初步 loading
      // 依靠浏览器原生的图片加载流
    } catch (e) {
      alert("AI 服务暂时忙碌，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-8 overflow-hidden">
      {/* 稳定背景层 */}
      <div 
        className="absolute inset-0 bg-stable"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* 智能色彩蒙版：跟随系统深浅色 */}
      <div className="absolute inset-0 bg-[var(--mask-opacity)]" />

      {/* 侧边栏：圆形按钮组 */}
      <aside className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-50">
        <CircleNavBtn icon={<Sparkles size={22} />} active />
        <CircleNavBtn icon={<Presentation size={22} />} />
        <CircleNavBtn icon={<FileText size={22} />} />
        <div className="h-10" />
        <CircleNavBtn icon={<Sun size={22} />} />
        <CircleNavBtn icon={<Settings size={22} />} />
      </aside>

      {/* 主容器 */}
      <main className="relative w-full max-w-6xl h-full flex flex-col gap-8 ml-20">
        
        {/* 顶部搜索条：iOS 连续圆角 */}
        <header className="w-full ios-card p-2 flex items-center shadow-xl">
          <input 
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
            placeholder="描述你想生成的画面..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg dark:text-white text-gray-800 placeholder:opacity-50"
          />
          <button 
            onClick={onGenerate}
            className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-[28px] flex items-center gap-2 transition-transform active:scale-95 font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
            生成
          </button>
        </header>

        <div className="flex-1 flex gap-8 min-h-0 mb-4">
          
          {/* 预览区：iOS 连续圆角 */}
          <section className="flex-[2] ios-card relative overflow-hidden flex items-center justify-center shadow-2xl group">
            {image ? (
              <div className="relative w-full h-full flex items-center justify-center p-6">
                <img 
                  src={image} 
                  className="max-w-full max-h-full rounded-[30px] object-contain shadow-lg" 
                  alt="AI Result"
                />
                <button 
                  onClick={() => window.open(image)}
                  className="absolute top-6 right-6 p-4 ios-card rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Download size={20} className="dark:text-white" />
                </button>
              </div>
            ) : (
              <div className="dark:text-white/20 text-black/20 flex flex-col items-center gap-4">
                <ImageIcon size={100} strokeWidth={1} />
                <p className="tracking-[0.3em] font-medium text-sm">DESIGNED BY AI STUDIO</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 ios-card flex flex-col items-center justify-center z-10 bg-white/20 dark:bg-black/20">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="mt-4 font-bold text-blue-500 tracking-widest">AI 正在加速出图中...</p>
              </div>
            )}
          </section>

          {/* 设置区：iOS 连续圆角 */}
          <section className="flex-1 ios-card p-10 flex flex-col gap-10 shadow-2xl dark:text-white text-gray-800">
            <div>
              <div className="text-xs font-black opacity-40 mb-6 tracking-widest uppercase">模式选择</div>
              <div className="grid grid-cols-1 gap-4">
                <ModeItem 
                  title="极速模式" desc="约 10s 出图，适合快速试错" 
                  active={mode === 'fast'} 
                  onClick={() => setMode('fast')}
                />
                <ModeItem 
                  title="画质模式" desc="精细渲染，耗时较长" 
                  active={mode === 'high'} 
                  onClick={() => setMode('high')}
                />
              </div>
            </div>

            <div>
              <div className="text-xs font-black opacity-40 mb-6 tracking-widest uppercase">比例选择</div>
              <div className="grid grid-cols-2 gap-4">
                {['1:1', '16:9', '9:16', '4:3'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setRatio(r)}
                    className={`py-4 rounded-[20px] text-sm font-bold transition-all border-2 ${ratio === r ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-black opacity-40 mb-6 tracking-widest">
                <span>生成张数</span>
                <span className="text-blue-500">{count} 张</span>
              </div>
              <input 
                type="range" min="1" max="4" value={count} 
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-500/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// 侧边栏圆形按钮
function CircleNavBtn({ icon, active }: { icon: any, active?: boolean }) {
  return (
    <button className={`w-14 h-14 ios-btn-circle flex items-center justify-center transition-all shadow-lg ${active ? 'bg-blue-600 text-white scale-110' : 'ios-card dark:text-white/60 text-black/60 hover:scale-105'}`}>
      {icon}
    </button>
  );
}

// 模式选择项
function ModeItem({ title, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-[24px] text-left transition-all border-2 ${active ? 'border-blue-500 bg-blue-500/10 shadow-inner' : 'border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10'}`}
    >
      <div className={`font-bold mb-1 ${active ? 'text-blue-500' : ''}`}>{title}</div>
      <div className="text-[11px] opacity-50 leading-relaxed">{desc}</div>
    </button>
  );
}

export default App;
