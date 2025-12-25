import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { Star, Gift, Sparkles, Loader2, Share2, Check, Heart, Music } from "lucide-react";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 背景散景光斑
const Bokeh = ({ left, top, size, color, delay }: any) => (
    <div 
        className="absolute rounded-full opacity-20 blur-xl"
        style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animation: `float ${Math.random() * 5 + 5}s infinite ease-in-out ${delay}s`,
            zIndex: 0
        }}
    />
);

const Snowflake = ({ left, duration, delay, size }: { left: number, duration: number, delay: number, size: number }) => (
    <div 
        className="snow" 
        style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `fall ${duration}s linear ${delay}s infinite`,
        }}
    />
);

// 碎灯串
const FairyLights = ({ count, width }: { count: number, width: number }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => {
                // 计算对角线分布
                const x = (i / count) * 100;
                const y = (i / count) * 100;
                const color = i % 2 === 0 ? '#fef08a' : '#fca5a5'; // 黄红相间
                
                return (
                    <div
                        key={i}
                        className="fairy-light absolute rounded-full z-20"
                        style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            width: '6px',
                            height: '6px',
                            backgroundColor: color,
                            color: color,
                            boxShadow: `0 0 8px ${color}`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                );
            })}
        </>
    )
};

const TreeLayer = ({ width, top, zIndex }: { width: number, top: number, zIndex: number }) => (
    <div 
        className="absolute left-1/2 -translate-x-1/2"
        style={{
            width: `${width}px`,
            height: `${width * 0.75}px`,
            top: `${top}px`,
            zIndex: zIndex,
        }}
    >
        {/* 树叶主体 */}
        <div 
            className="w-full h-full overflow-hidden relative"
            style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                // 更鲜亮的渐变
                background: `linear-gradient(180deg, #4ade80 0%, #166534 60%, #14532d 100%)`,
                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)' 
            }}
        >
            {/* 边缘高光 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-full border-l-[40px] border-l-transparent border-b-[100px] border-b-white/10" />
            
            {/* 积雪 */}
            <div className="absolute bottom-0 left-0 w-full h-4 bg-white/90 blur-[1px] mix-blend-overlay" />
            
            {/* 缠绕的灯串 (通过裁剪显示在树内) */}
            <div className="absolute top-0 left-0 w-full h-full opacity-90">
                <FairyLights count={Math.floor(width / 12)} width={width} />
            </div>
        </div>
    </div>
);

const Bauble = ({ top, left, color, delay, size = 12 }: { top: number, left: number, color: string, delay: number, size?: number }) => (
    <div 
        className="bauble absolute rounded-full z-[40]"
        style={{
            top: `${top}px`,
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            // 玻璃质感
            background: `radial-gradient(circle at 35% 35%, white 0%, ${color} 40%, #000 100%)`,
            animationDelay: `${delay}s`,
            boxShadow: `0 4px 6px rgba(0,0,0,0.3)`
        }}
    />
);

const GiftBox = ({ color, size, left, rotate }: { color: string, size: number, left: number, rotate: number }) => (
    <div 
        className="absolute bottom-8 z-50 shadow-2xl transition-transform hover:scale-110 duration-300"
        style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            left: `${left}px`,
            transform: `rotate(${rotate}deg)`,
            borderRadius: '4px'
        }}
    >
        <div className="absolute top-1/2 left-0 w-full h-3 bg-yellow-400/90 -translate-y-1/2 shadow-sm" />
        <div className="absolute top-0 left-1/2 h-full w-3 bg-yellow-400/90 -translate-x-1/2 shadow-sm" />
        {/* 蝴蝶结 */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-md">
            <Gift size={size * 0.8} strokeWidth={1.5} />
        </div>
    </div>
);

const App = () => {
    const [name, setName] = useState('');
    const [wish, setWish] = useState('');
    const [loading, setLoading] = useState(false);
    const [snowflakes, setSnowflakes] = useState<any[]>([]);
    const [bokehs, setBokehs] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);
    const [recipient, setRecipient] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const to = params.get('to');
        if (to) {
            setRecipient(to);
            setName(to);
        }

        // 生成雪花
        const initialSnow = Array.from({ length: 80 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            duration: Math.random() * 5 + 4,
            delay: Math.random() * 5,
            size: Math.random() * 4 + 2
        }));
        setSnowflakes(initialSnow);

        // 生成背景光斑
        const initialBokeh = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 150 + 50,
            color: Math.random() > 0.5 ? '#fbbf24' : '#f87171', // 金色或红色
            delay: Math.random() * 5
        }));
        setBokehs(initialBokeh);
    }, []);

    const generateWish = async () => {
        if (!name.trim() && !loading) return;
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `为 "${name}" 写一段简短温暖的圣诞祝福。包含灯光、奇迹、温暖等词汇。中文，40字左右。`,
                config: { temperature: 0.9 }
            });
            setWish(response.text || "愿你的圣诞像这棵树一样，光芒万丈，温暖如初。");
        } catch (error) {
            setWish("愿这漫天星光，都为你而闪烁。祝你拥有一个最明亮的圣诞节！");
        } finally {
            setLoading(false);
        }
    };

    const copyShareLink = () => {
        const url = new URL(window.location.href);
        if (name) url.searchParams.set('to', name);
        navigator.clipboard.writeText(url.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
            {/* 背景光斑层 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {bokehs.map(b => <Bokeh key={b.id} {...b} />)}
            </div>

            {snowflakes.map(snow => <Snowflake key={snow.id} {...snow} />)}

            <div className="z-10 w-full max-w-lg flex flex-col items-center">
                
                {/* Header with Glassmorphism */}
                <div className="mb-8 text-center relative">
                    {recipient ? (
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 text-yellow-100 text-base font-medium animate-bounce shadow-[0_0_20px_rgba(253,224,71,0.3)] backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            For You, {recipient}
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>
                    ) : (
                         <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            Merry Christmas
                        </div>
                    )}
                </div>

                {/* Tree Section - Increased Height to show Trunk */}
                <div className="relative tree-container h-[580px] w-[340px] mb-8">
                    {/* Super Bright Star */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] group">
                        {/* 星星光晕 */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-100/40 rounded-full blur-xl" />
                        <Star className="text-yellow-100 fill-yellow-200 w-20 h-20 drop-shadow-[0_0_15px_rgba(255,215,0,1)] relative z-10 animate-[twinkle_3s_infinite]" strokeWidth={1} />
                    </div>

                    {/* Layers with Lights */}
                    <TreeLayer width={100} top={40} zIndex={5} />
                    <TreeLayer width={170} top={100} zIndex={4} />
                    <TreeLayer width={230} top={180} zIndex={3} />
                    <TreeLayer width={300} top={280} zIndex={2} />

                    {/* Trunk - Positioned lower and with texture */}
                    <div className="absolute top-[480px] left-1/2 -translate-x-1/2 w-16 h-28 bg-gradient-to-b from-[#451a03] via-[#5c3a16] to-[#271503] rounded-b-lg z-[1] shadow-2xl flex flex-col justify-end items-center pb-2 border-l border-r border-[#2e1003]">
                         <div className="w-full h-[1px] bg-white/10 mb-2"></div>
                         <div className="w-full h-[1px] bg-white/5 mb-2"></div>
                    </div>

                    {/* Rich Baubles */}
                    <Bauble top={70} left={46} color="#ef4444" delay={0} size={16} />
                    <Bauble top={130} left={35} color="#3b82f6" delay={0.4} size={14} />
                    <Bauble top={150} left={65} color="#fbbf24" delay={0.8} size={15} />
                    <Bauble top={220} left={25} color="#ec4899" delay={1.2} size={18} />
                    <Bauble top={240} left={75} color="#10b981" delay={1.6} size={14} />
                    <Bauble top={330} left={40} color="#8b5cf6" delay={0.2} size={16} />
                    <Bauble top={350} left={20} color="#fbbf24" delay={0.6} size={15} />
                    <Bauble top={360} left={80} color="#ef4444" delay={1.0} size={18} />
                    <Bauble top={380} left={55} color="#ffffff" delay={1.4} size={12} />

                    {/* Gifts Stack - Adjusted position */}
                    <div className="absolute bottom-10 w-full flex justify-center items-end gap-2 px-4 z-[60]">
                        <GiftBox color="#b91c1c" size={50} left={40} rotate={-8} />
                        <GiftBox color="#15803d" size={40} left={100} rotate={4} />
                        <GiftBox color="#1e3a8a" size={55} left={200} rotate={12} />
                        <GiftBox color="#c2410c" size={35} left={160} rotate={-5} />
                    </div>
                </div>

                {/* Interaction Card */}
                <div className="w-full bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] space-y-4 ring-1 ring-white/10">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="输入名字点亮祝福..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:ring-2 focus:ring-yellow-400/50 outline-none transition-all text-sm"
                            />
                            <button 
                                onClick={generateWish}
                                disabled={loading || !name}
                                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-900/40 whitespace-nowrap"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                点亮
                            </button>
                        </div>
                        
                        <button 
                            onClick={copyShareLink}
                            className="text-xs text-white/50 hover:text-white flex items-center justify-center gap-1.5 transition-colors py-2 rounded-lg hover:bg-white/5"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                            {copied ? '链接已复制' : '复制专属链接'}
                        </button>
                    </div>

                    {wish && (
                        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 bg-gradient-to-br from-indigo-950/50 to-purple-900/30 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                            <Sparkles className="absolute top-2 left-2 w-4 h-4 text-yellow-300/40 animate-pulse" />
                            <Sparkles className="absolute bottom-2 right-2 w-3 h-3 text-yellow-300/40 animate-pulse delay-700" />
                            <p className="text-base leading-relaxed text-indigo-100/90 font-light text-center relative z-10">
                                “{wish}”
                            </p>
                        </div>
                    )}
                </div>

                <footer className="mt-8 text-white/20 text-[10px] uppercase tracking-[0.3em] font-light text-center">
                    Magic Christmas Night
                </footer>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
