import { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Palette, List, AlignLeft, ChevronRight, ChevronLeft
} from 'lucide-react';
import { generateImage } from './lib/api';

// 类型定义
type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  // 1. 深度持久化状态
  const initialState = {
    activeModule: 'home' as Module,
    mode: 'gen' as Mode,
    prompt: '',
    imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
    videoConfig: { duration: '5s', ratio: '16:9', refImg: null },
    pptConfig: { pages: 10, outline: '', style: 'Modern', results: [] as string[] },
    paperConfig: { words: 2000, style: 'Academic', ref: '', results: [] as string[] }
  };

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_final_v1');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [loading, setLoading] = useState(false);
  const [currentResults, setCurrentResults] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // 状态自动同步
  useEffect(() => {
    localStorage.setItem('ai_studio_final_v1', JSON.stringify(state));
  }, [state]);

  // 2. 云存储删除逻辑
  const clearAllData = () => {
    if (confirm("确定要删除所有云存储数据并重置吗？此操作不可撤销。")) {
      localStorage.removeItem('ai_studio_final_v1');
      setState(initialState);
      setCurrentResults([]);
      window.location.reload();
    }
  };

  // 3. 优化后的 AI 调度
  const handleExecute = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setCurrentResults([]);
    
    try {
      if (state.activeModule === 'image' && state.mode === 'gen') {
        // 并行调度：根据设置张数同时生成
        const tasks = Array.from({ length: state.imageConfig.count }).map(() => 
          generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio)
        );
        const urls = await Promise.all(tasks);
        setCurrentResults(urls);
        // 保存历史
        setState(prev => ({
          ...prev,
          imageConfig: { ...prev.imageConfig, history: [...urls, ...prev.imageConfig.history].slice(0, 12) }
        }));
      } else {
        // 模拟其他模块的快速响应
        await new Promise(r => setTimeout(r, 1500));
        setCurrentResults(['success_placeholder']);
      }
    } catch (e) {
      alert("AI 引擎忙碌，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col text-white font-sans selection:bg-blue-500/30">
      {/* 动态吸色背景 */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a] transition-all duration-1000"
           style={{ backgroundImage: `url('https://bing.img.run/rand_uhd.php')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="fixed inset-0 z-10 bg-black/40 backdrop-blur-[2px] transition-colors duration-500" />

      <div className="relative z-20 flex flex-col h-full p-6 lg:p-10 gap-6">
        
        {/* 顶部：标题与模块切换 */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter drop-shadow-lg">AI STUDIO <span className="text-blue-500 text-sm ml-2 opacity-80">V2.2 Final</span></h1>
            <p className="text-white/40 text-xs mt-1 font-medium tracking-widest uppercase">From your last creation</p>
          </div>
          
          <nav className="ios-panel p-1.5 flex gap-1 rounded-full bg-white/5 border-white/10">
            {['image', 'paper'].includes(state.activeModule) && (
              <>
                <TabBtn label={state.activeModule === 'image' ? '生成界面' : '论文生成'} active={state.mode === 'gen'} onClick={() => setState({...state, mode:'gen'})} />
                <TabBtn label={state.activeModule === 'image' ? '清晰化' : '润色'} active={state.mode === 'fix'} onClick={() => setState({...state, mode:'fix'})} />
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="ios-panel px-4 py-2 rounded-full flex items-center gap-3 text-xs font-bold bg-white/5">
              <Sun size={14} className="text-yellow-400" />
              <span>智能引擎已就绪</span>
            </div>
          </div>
        </header>

        {/* 创意输入框 */}
        <section className="ios-panel p-2 flex items-center shadow-2xl h-20 shrink-0 bg-white/10 border-white/20">
          <input 
            value={state.prompt}
            onChange={(e) => setState({...state, prompt: e.target.value})}
            placeholder="输入你的创意描述，让 AI 为你生成独特的作品..."
            className="flex-1 bg-transparent border-none outline-none px-6 text-lg text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleExecute}
            className="h-16 px-10 bg-blue
