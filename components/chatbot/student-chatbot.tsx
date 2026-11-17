'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minus, Maximize2, Minimize2, MessageSquare, User, Loader2, Sparkles, GraduationCap, Wallet, FileText, LifeBuoy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useUserAccessibleModules } from '@/hooks/common';

interface Message {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    link?: string;
}

export const StudentChatbot = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChatEnabled, setIsChatEnabled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: accessibleModule } = useUserAccessibleModules();

    // Context and Messages State
    const getContextInfo = () => {
        if (pathname.toLowerCase().includes('fees')) return { name: 'Student Fees', color: 'from-emerald-500 to-teal-600', icon: Wallet };
        if (pathname.toLowerCase().includes('exam')) return { name: 'Student Academics', color: 'from-violet-500 to-purple-600', icon: GraduationCap };
        return { name: 'Student Support', color: 'from-blue-600 to-indigo-700', icon: Bot };
    };
    const currentContext = getContextInfo();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Welcome to your Student Portal Assistant! How can I help you with your studies or payments today?`,
            role: 'assistant',
            timestamp: new Date()
        }
    ]);

    type MenuState = 'ROOT' | 'ACADEMICS' | 'PAYMENTS' | 'COE' | 'FEEDBACK';
    const [menuState, setMenuState] = useState<MenuState>('ROOT');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Scrolling Effect
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages, isOpen, isMinimized, isLoading]);

    // Menu Reset Effect
    useEffect(() => {
        setMenuState('ROOT');
        setIsChatEnabled(false);
    }, [pathname, isOpen]);

    // Only show in Student Portal - Guard AFTER hooks
    if (!mounted || !pathname?.toLowerCase().includes('studentportal')) return null;

    // Helper to resolve links from common.ts data (environment-aware)
    const resolveLink = (targetName: string, fallbackLink?: string) => {
        if (!accessibleModule?.data) return fallbackLink;

        // Flatten pages for searching
        const allPages = accessibleModule.data.flatMap(module =>
            module.menu.flatMap(menu =>
                menu.sub_menu.flatMap(subMenu => subMenu.pages)
            )
        );

        const page = allPages.find(p =>
            p.name.toLowerCase().trim() === targetName.toLowerCase().trim() ||
            p.title?.toLowerCase().trim() === targetName.toLowerCase().trim()
        );

        if (page) return page.url;

        // Second pass: partial match if no exact match found
        const partialMatch = allPages.find(p =>
            p.name.toLowerCase().includes(targetName.toLowerCase()) ||
            p.title?.toLowerCase().includes(targetName.toLowerCase())
        );

        return partialMatch ? partialMatch.url : fallbackLink;
    };

    const MENU_STRUCTURE: Record<string, any> = {
        ROOT: [
            { label: 'My Academics & Results', id: 'ACADEMICS' },
            { label: 'Fees & Payments', id: 'PAYMENTS' },
            { label: 'coe', id: 'COE' },
            { label: 'complaints and feedbacks', id: 'FEEDBACK' },
            { label: 'Ask a specific query', id: 'ENABLE_CHAT' }
        ],
        ACADEMICS: [
            { label: 'Check Progress Card', response: 'View your latest results in Reports > Progress Card Report.', pageName: 'Exam Report', link: '/StudentPortal/student-dashboard/Exam/ExamReport' },
            { label: 'Apply Leave', response: 'To apply leave, Go to Admission > Leave Apply Online', pageName: 'Online Leave Application', link: '/StudentPortal/student-dashboard/Admission/OnlineLeaveApp' },

            { label: 'My Attendance', response: 'Check your yearly attendance in Reports > Student Yearly Attendance Report.', pageName: 'Attendance Details', link: '/StudentPortal/masters/attendance-details' },
        ],
        PAYMENTS: [
            { label: 'Pay Fees Online', response: 'Pay your outstanding fees securely in Masters > Fee Online Payment.', pageName: 'Fee Online Payment', link: '/StudentPortal/masters/feeonlinpayment' },
            { label: 'Fees dashboard', response: 'Visualise your fees history > Fee Cumulative.', pageName: 'Cumulative Fee Analysis', link: '/StudentPortal/masters/feecumulative' },
            { label: 'Download Fee Receipt', response: 'Download your payment receipts in Student Dashboard > Fees > Reports > Portal Fee Receipt.', pageName: 'Portal Fee Receipt', link: '/StudentPortal/student-dashboard/Fees/Reports/PortalFeeReceipt' },
        ],
        COE: [
            { label: 'School events', response: 'See your events >.', pageName: 'Calendar of Events', link: '/StudentPortal/coe/coe' }

        ],
        FEEDBACK: [
            { label: 'Complaints', response: 'You can raise your complaints here.', pageName: 'Student Complaints', link: '/StudentPortal/student-dashboard/Feedback/Transaction/StudentCompliantsView' },
            { label: 'Feedbacks', response: 'Check student feedbacks.', pageName: 'Student Feedback Details', link: '/StudentPortal/feedback/studentfeedback' },
        ]
    };

    const handleOptionClick = (option: any) => {
        if (option.id === 'ENABLE_CHAT') {
            setIsChatEnabled(true);
            setMessages(prev => [...prev,
            { id: `${Date.now()}-user`, text: option.label, role: 'user', timestamp: new Date() },
            { id: `${Date.now()}-bot`, text: "Student Portal Chat enabled. How can I assist you with your academic record?", role: 'assistant', timestamp: new Date() }
            ]);
            return;
        }

        if (MENU_STRUCTURE[option.id]) {
            setMenuState(option.id as MenuState);
            setMessages(prev => [...prev,
            { id: `${Date.now()}-user`, text: option.label, role: 'user', timestamp: new Date() },
            { id: `${Date.now()}-bot`, text: `Checking your ${option.label.toLowerCase()} details. What would you like to see?`, role: 'assistant', timestamp: new Date() }
            ]);
            return;
        }

        if (option.response) {
            const resolvedLink = option.pageName ? resolveLink(option.pageName, option.link) : option.link;
            setMessages(prev => [...prev,
            { id: `${Date.now()}-user`, text: option.label, role: 'user', timestamp: new Date() },
            { id: `${Date.now()}-bot`, text: option.response, role: 'assistant', timestamp: new Date(), link: resolvedLink }
            ]);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg: Message = { id: `${Date.now()}-user`, text: input, role: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.text })).concat({ role: 'user', content: input }),
                    context: 'StudentPortal'
                })
            });
            const data = await response.json();
            if (data.text) {
                setMessages(prev => [...prev, { id: `${Date.now()}-bot`, text: data.text, role: 'assistant', timestamp: new Date() }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-3 right-3 z-[2147483647] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                            opacity: 1, scale: 1, y: 0,
                            width: isMaximized ? 'min(90vw, 900px)' : '350px',
                            height: isMaximized ? 'min(85vh, 800px)' : '480px'
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={cn(
                            "bg-white dark:bg-zinc-900 border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4",
                            isMaximized && "fixed inset-4 m-auto z-[2147483647]"
                        )}
                    >
                        {/* Header */}
                        <div className={cn("p-4 flex items-center justify-between text-white bg-gradient-to-r", currentContext.color)}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                                        Student Assistant
                                        <Sparkles className="w-3 h-3 text-yellow-300" />
                                    </h3>
                                    <p className="text-[11px] opacity-80 mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                        Your personal portal helper
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><Minus className="w-4 h-4" /></button>
                                <button onClick={() => setIsMaximized(!isMaximized)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors">
                                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-zinc-800/30">
                            <ScrollArea className="h-full" ref={scrollRef}>
                                <div className="flex flex-col gap-4 p-5">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={cn("flex w-full flex-col gap-1.5", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
                                            <div className={cn(
                                                "px-4 py-3 rounded-2xl text-[14px] shadow-sm leading-relaxed max-w-[85%] break-words whitespace-pre-wrap flex flex-col gap-2",
                                                msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white dark:bg-zinc-800 border border-border/50 rounded-tl-none text-foreground"
                                            )}>
                                                <span>{msg.text}</span>
                                                {msg.role === 'assistant' && msg.link && (
                                                    <Button variant="default" size="sm" onClick={() => {
                                                        if (msg.link) window.location.href = msg.link;
                                                    }} className="w-full mt-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-7 text-xs font-semibold shadow-sm">
                                                        Go to Page →
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {!isLoading && (
                                        <div className="flex flex-wrap gap-2 mt-2 px-1">
                                            {MENU_STRUCTURE[menuState]?.map((opt: any, i: number) => (
                                                <button key={i} onClick={() => handleOptionClick(opt)} className="bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 border border-border/60 text-xs px-3 py-2 rounded-full shadow-sm text-foreground/80 transition-all flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
                                                    {opt.label}
                                                </button>
                                            ))}
                                            {menuState !== 'ROOT' && (
                                                <button onClick={() => setMenuState('ROOT')} className="w-full text-center mt-2 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                                                    ← Back to Services
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="flex items-start gap-2">
                                            <div className="bg-white dark:bg-zinc-800 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-blue-800 rounded-full animate-bounce" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-white dark:bg-zinc-900">
                            <div className="flex gap-2 items-center">
                                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={isChatEnabled ? "Describe your academic need..." : "Select an option or enable chat"} className="bg-slate-100 dark:bg-zinc-800 border-none h-11 rounded-xl" disabled={isLoading || !isChatEnabled} />
                                <Button size="icon" onClick={() => handleSend()} disabled={isLoading || !input.trim() || !isChatEnabled} className="bg-blue-600 hover:bg-indigo-700 h-11 w-11 rounded-xl shadow-lg"><Send className="w-4 h-4" /></Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col items-center gap-1.5">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-[52px] h-[52px] rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 overflow-hidden relative group border-2 border-white/90",
                        isOpen ? "bg-red-500" : "bg-gradient-to-tr from-blue-600 to-indigo-700"
                    )}
                >
                    {isOpen ? <X className="w-5 h-5 text-white" /> : (
                        <div className="relative flex flex-col items-center justify-center w-full h-full">
                            <GraduationCap className="w-6 h-6 text-white z-10 drop-shadow-lg" />

                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full z-20 flex items-center justify-center"
                            >
                                <Sparkles className="w-1.5 h-1.5 text-blue-600" />
                            </motion.div>
                        </div>
                    )}
                </motion.button>
                {!isOpen && (
                    <span className="text-[10px] font-bold text-foreground/80 dark:text-white/80 tracking-wider bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap shadow-sm border border-black/5">
                        AI VRM HELP
                    </span>
                )}
            </div>
        </div>
    );
};
