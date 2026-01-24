import { useState, useEffect } from 'react';
import { 
  Sparkles, Video, FileText, Presentation, Settings, 
  Sun, Zap, Download, Clock, Upload, Trash2,
  Layout, Maximize2, Image as ImageIcon, ExternalLink, ChevronRight
} from 'lucide-react';
import { generateImage } from './lib/api';

type Module = 'home' | 'image' | 'video' | 'ppt' | 'paper';
type Mode = 'gen' | 'fix';

export default function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ai_studio_v9');
    return saved ? JSON.parse(saved) : {
      activeModule: 'home' as Module,
      mode: 'gen' as Mode,
      prompt: '',
      imageConfig: { ratio: '1:1', quality: 'fast', count: 1, history: [] as string[] },
      videoConfig: { duration: '5s' },
      pptConfig: { pages: 10, outline: '' },
      paperConfig: { words: 2000 }
    };
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('ai_studio_v9', JSON.stringify(state));
  }, [state]);

  const handleAction = async () => {
    if (!state.prompt || loading) return;
    setLoading(true);
    setResults([]);
    try {
      if (state.activeModule === 'image') {
        // 修复参数传递: (prompt, quality, ratio)
        const urls = await generateImage(state.prompt, state.imageConfig.quality, state.imageConfig.ratio);
        // 如果返回的是单张，转为数组；如果是多张则直接使用
        const urlArray = Array.isArray(urls) ? urls : [urls];
        const optimized = urlArray.map(u => `https://images.weserv.nl/?url=${encodeURIComponent(u)}`);
        setResults(optimized);
        setState((s: any) => ({
          ...s,
          imageConfig: { ...s.imageConfig, history: [...optimized, ...s.imageConfig.history].slice(0, 12) }
        }));
      } else {
        await new Promise(r => setTimeout(r, 1500));
        alert("指令已发送至云端算力集群");
      }
    } catch (e) {
      alert("生成任务异常，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050505] text-[#ececec] font-sans overflow-hidden">
      
      {/* 侧边导航栏 - 纯正 Minimaxi 风格 */}
      <aside className="w-[68px] border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4 transition-transform active:scale-95 cursor-pointer">
          <Zap size={20} fill="currentColor" />
        </div>
        <NavBtn icon={<Layout size={20}/>} active={state.activeModule === 'home'} onClick={() => setState({...state, activeModule:'home'})} />
        <NavBtn icon={<Sparkles size={20}/>} active={state.activeModule === 'image'} onClick={() => setState({...state, activeModule:'image'})} />
        <NavBtn icon={<Video size={20}/>} active={state.activeModule === 'video'} onClick={() => setState({...state, activeModule:'video'})} />
        <NavBtn icon={<Presentation size={20}/>} active={state.activeModule === 'ppt'} onClick={() => setState({...state, activeModule:'ppt'})} />
        <NavBtn icon={<FileText size={20}/>} active={state.activeModule === 'paper'} onClick={() => setState({...state, activeModule:'paper'})} />
        <div className="flex-1" />
        <button className="p-3 text-white/10 hover:text-white transition-colors"><Settings size={20}/></button>
      </aside>

      {/* 主画布区域 */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#080808]">
        
        {/* 顶部状态栏 */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black tracking-widest uppercase opacity-80">
              {state.activeModule === 'home' ? 'Dashboard' : state.activeModule}
            </h2>
            {state.activeModule !== 'home' && (
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
                <button onClick={() => setState({...state, mode:'gen'})} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${state.mode === 'gen' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}>
                  {state.activeModule === 'paper' ? '论文撰写' : '智能生成'}
                </button>
                <button onClick={() => setState({...state, mode:'fix'})} className={`px-4 py-1 rounded-md text-[10px] font-bold transition-all ${state.mode === 'fix' ? 'bg-white/10 text-white' : 'text-white/20 hover:text-white'}`}>
                  {state.activeModule === 'paper' ? '深度润色' : '后期增强'}
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-blue-500/50 uppercase tracking-tighter hidden md:block">System Status: Optimal</div>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-
