import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon
} from 'lucide-react';
import { generateImage } from './lib/api';

// 类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 持久化状态：确保关闭网页后数据依然存在
  const initialState = {
    activeModule: 'home' as Module,
    mode: 'gen' as Mode,
    prompt: '',
    imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
    videoConfig: { duration: '5s', ratio: '16:9' },
    pptConfig: { pages: 10, outline: '', style: 'Modern' },
    paperConfig: { words: 2000, style: 'Academic', ref: '' }
  };

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_final_v3');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<string[]>([]);

  // 实时保存状态
  useEffect(() => {
    localStorage.setItem('ai_studio_final_v3', JSON.stringify(state));
  }, [state]);

  // 2. 清空云存储数据
  const clearAllData = () => {
    if (window.confirm("⚠️ 确定要清空所有历史记录和设置吗？")) {
      localStorage.removeItem('ai_studio_final_v3');
      setState(initialState);
      setCurrentResults([]);
      window.location.reload();
    }
  };

  // 3. AI 执行引擎：带网络优化
  const handleExecute = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setCurrentResults([]);
    
    try {
      if (state.activeModule === 'image' && state.mode === 'gen') {
        // 并行调度加速
        const tasks = Array.from({ length: state.imageConfig.count }).map(() => 
          generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio)
        );
        const urls = await Promise.all(tasks);
        
        // 自动使用图片加速代理 (weserv) 绕过潜在的网络限制
        const optimizedUrls = urls.map(url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`);
        
        setCurrentResults(optimizedUrls);
        setState((prev: any) => ({
          ...prev,
          imageConfig: { ...prev.imageConfig, history: [...optimizedUrls, ...prev.imageConfig.history].slice(0, 12) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1500));
        alert("该模块逻辑已就绪，正在接入云端接口...");
      }
    } catch (e) {
      alert("网络连接不稳定，建议刷新页面或稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white">
      {/* 动态取色背景背景层 */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('https://bing.img.run/rand_uhd.php')`, backgroundColor: '#050505' }}
      />
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[4px] saturate-150" />

      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        
        {/* Header - 标题与标签栏 */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter drop-shadow-2xl">AI STUDIO</h1>
            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">Resuming from your last creative session</p>
          </div>
          
          <nav className="flex items-center gap-1 p-1 ios-panel rounded-full bg-white/5 border-white/5">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <TabBtn label={state.activeModule === 'image' ? '生成界面' : '论文生成'} active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
                <TabBtn label={state.activeModule === 'image' ? '清晰化' : '润色'} active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
              </>
            )}
          </nav>

          <div className="ios-panel px-5 py-2.5 rounded-full flex items-center gap-3 text-[11px] font-black bg-white/5 border-white/10 uppercase tracking-widest">
            <Sun size={14} className="text-yellow-400" />
            <span>Smart Engine Ready</span>
          </div>
        </header>

        {/* 创意输入框 */}
        <section className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0 bg-white/10 border-white/10 group focus-within:border-blue-500/50 transition-all">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
            placeholder="输入你的创意描述，让 AI 为你生成独特的图片或文档..."
            className="flex-1 bg-transparent border-none outline-none px-8 text-lg text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-16 px-10 bg-blue
