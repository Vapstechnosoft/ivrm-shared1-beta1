'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minus, Maximize2, Minimize2, MessageSquare, User, Loader2, Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useUserAccessibleModules } from '@/hooks/common';

import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    link?: string;
}

export const Chatbot = () => {
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
    const context = () => {
        if (pathname.toLowerCase().includes('admission')) return { name: 'Admission', color: 'from-sky-500 to-indigo-600' };
        if (pathname.toLowerCase().includes('fees')) return { name: 'Fees', color: 'from-emerald-500 to-teal-600' };
        if (pathname.toLowerCase().includes('exam')) return { name: 'Exams', color: 'from-violet-500 to-purple-600' };
        return { name: 'Help Desk', color: 'from-indigo-600 to-blue-700' };
    };
    const currentContext = context();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello! I am your AI VRM Help Desk. Select an option below or type your query once enabled.`,
            role: 'assistant',
            timestamp: new Date()
        }
    ]);

    type MenuState = 'ROOT' | 'ACADEMIC' | 'ANALYSIS' | 'STUDENT' | 'OFFICE' | 'ENABLE_CHAT';
    const [menuState, setMenuState] = useState<MenuState>('ROOT');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Welcome Message Effect
    useEffect(() => {
        if (messages.length === 1) {
            setMessages([{
                id: '1',
                text: `Hello! I am your AI VRM Help Desk. How can I assist you today?`,
                role: 'assistant',
                timestamp: new Date()
            }]);
        }
    }, [pathname, currentContext.name, messages.length]);

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

    // Early guard AFTER all hooks are declared
    // Strictly Admin Portal only (Exclude Student and Staff portals)
    const isStudentPortal = pathname?.toLowerCase().includes('studentportal');
    const isStaffPortal = pathname?.toLowerCase().includes('staffportal');

    if (!mounted || isStudentPortal || isStaffPortal) return null;

    // Helper to resolve links from common.ts data (environment-aware)
    const resolveLink = (targetName: string, fallbackLink?: string) => {
        if (!accessibleModule?.data) return fallbackLink;
        for (const module of accessibleModule.data) {
            for (const menu of module.menu) {
                for (const subMenu of menu.sub_menu) {
                    const page = subMenu.pages.find(p =>
                        p.name.toLowerCase() === targetName.toLowerCase() ||
                        p.title?.toLowerCase() === targetName.toLowerCase()
                    );
                    if (page) return page.url;
                }
            }
        }
        return fallbackLink;
    };

    const MENU_STRUCTURE: Record<string, any> = {
        ROOT: [
            { label: 'Academic Operations', id: 'ACADEMIC' },
            { label: 'Performance Analysis', id: 'ANALYSIS' },
            { label: 'Student Records', id: 'STUDENT' },
            { label: 'Staff ESS (Self Service)', id: 'OFFICE' },
            { label: 'Detailed Query', id: 'ENABLE_CHAT' }
        ],
        ACADEMIC: [
            { label: 'Marks Entry', response: 'Enter marks in Exam > Exam Module > Marks Entry.', pageName: 'Marks Entry', link: '/Exam/exam-module/marks-entry/exam-marks-entry' },
            { label: 'Hall Ticket Gen', response: 'Generate hall tickets in Exam > Exam Mapping > Hall Ticket Generation.', pageName: 'Hall Ticket Generation', link: '/Exam/exam-module/exam-mapping/exam-hall-ticket-generation' },
            { label: 'Marks Calculation', response: 'Calculate final scores in Exam > Marks Calculation.', pageName: 'Exam Marks Calculation', link: '/Exam/exam-module/calculation/marks-calculation' },
            { label: 'Cumulative Report', response: 'View overall academic summary in Exam > Reports > Cumulative Report.', pageName: 'Cumulative Report', link: '/Exam/exam-module/reports/cumulative-report' },
        ],
        ANALYSIS: [
            { label: 'AI Class Analysis', response: 'Analyze performance trends in Exam > AI Performance Analysis.', pageName: 'AI Performance Analysis', link: '/Exam/exam-module/ai-performance-analysis' },
            { label: 'Progress Card Report', response: 'View student progress cards in Exam > Reports > Progress Card Report.', pageName: 'Progress Card Report', link: '/Exam/exam-module/reports/vvehpc_exam-report-card' },
            { label: 'Toppers List', response: 'View exam toppers in Exam > Reports > Toppers List Report.', pageName: 'Toppers List Report', link: '/Exam/exam-module/reports/toppers-list-report' },
            { label: 'Grade Slab Report', response: 'View grade distribution in Exam > Reports > Grade Slab Report.', pageName: 'Grade Slab Report', link: '/Exam/exam-module/reports/grade-slab-report' },
        ],
        STUDENT: [
            { label: 'Mark Attendance', response: 'Record daily attendance in Admission > Attendance Entry > Student Attendance.', pageName: 'Student Attendance', link: '/admission/preadmission/attendance-entry/student-attendance' },
            { label: 'Student Search', response: 'Find student details in Admission > Reports > Student Search.', pageName: 'Student Search', link: '/admission/preadmission/reports/student-search' },
            { label: 'Admission Register', response: 'View student register in Admission > Admission > Reports > Admission Register Report.', pageName: 'Admission Register Report', link: '/admission/preadmission/reports/admission-register-report' },
            { label: 'Total Strength', response: 'View school strength report in Admission > Reports > Total Strength Report.', pageName: 'Total Strength Report', link: '/admission/preadmission/reports/total-strength' },
            { label: 'TC Application', response: 'Apply for TC in Admission > Preadmission > Student TC > Apply TC.', pageName: 'Apply TC', link: '/admission/preadmission/student-transfer-certificate/apply' },
        ],
        OFFICE: [
            { label: 'Apply Leave', response: 'Apply for leave in HRMS > Leave Management > Apply Leave.', pageName: 'Apply Leave', link: '/hrms/leave-management/apply-leave' },
            { label: 'Salary Slips', response: 'Download salary slips in HRMS > Reports > Salary Slip.', pageName: 'Salary Slip', link: '/hrms/reports/salary-slip' },
            { label: 'Cumulative Salary', response: 'View salary summary in HRMS > Reports > Cumulative Salary Report.', pageName: 'Cumulative Salary Report', link: '/hrms/reports/cumulative-salary-report' },
            { label: 'Employee Profile', response: 'View your profile in HRMS > Employee > Employee Register.', pageName: 'Employee Register', link: '/hrms/employee' },
        ]
    };


    const handleOptionClick = (option: any) => {
        if (option.id === 'ENABLE_CHAT') {
            setIsChatEnabled(true);
            const msg: Message = {
                id: `${Date.now()}-user`,
                text: "My query not listed",
                role: 'user',
                timestamp: new Date()
            };
            const botMsg: Message = {
                id: `${Date.now()}-bot`,
                text: "Chatbox enabled. Please type your query precisely.",
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, msg, botMsg]);
            return;
        }

        // Category transition
        if (['ACADEMIC', 'ANALYSIS', 'STUDENT', 'OFFICE'].includes(option.id)) {
            setMenuState(option.id as MenuState);
            const userMsg: Message = {
                id: `${Date.now()}-user`,
                text: option.label,
                role: 'user',
                timestamp: new Date()
            };
            const botMsg: Message = {
                id: `${Date.now()}-bot`,
                text: "What can I help you with?",
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, userMsg, botMsg]);
            return;
        }

        // Local response (Avoids API call for menu options)
        if (option.response) {
            const resolvedLink = option.pageName ? resolveLink(option.pageName, option.link) : option.link;
            const userMsg: Message = {
                id: `${Date.now()}-user`,
                text: option.label,
                role: 'user',
                timestamp: new Date()
            };
            const botMsg: Message = {
                id: `${Date.now()}-bot`,
                text: option.response,
                role: 'assistant',
                timestamp: new Date(),
                link: resolvedLink
            };
            setMessages(prev => [...prev, userMsg, botMsg]);
        }
    };

    const handleSend = async (text?: string, link?: string) => {
        const messageText = text || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: `${Date.now()}-user-${Math.random().toString(36).substr(2, 9)}`,
            text: messageText,
            role: 'user',
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.map(m => ({ role: m.role, content: m.text })).concat({ role: 'user', content: messageText }),
                    context: currentContext.name // Pass context to API
                })
            });

            const data = await response.json();

            if (data.text) {
                // If we have a link (from menu click), we pass it to the message object

                const botMessage: Message = {
                    id: `${Date.now()}-bot-${Math.random().toString(36).substr(2, 9)}`,
                    text: data.text,
                    role: 'assistant',
                    timestamp: new Date(),
                    link: link // Attach link if present
                };
                setMessages((prev) => [...prev, botMessage]);

                // Reset to root after meaningful interaction? Or stay? Let's stay in context for now.
                // setMenuState('ROOT'); 
            } else if (data.error) {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: `${Date.now()}-error-${Math.random().toString(36).substr(2, 9)}`,
                text: "I'm having trouble connecting right now. Please try again later.",
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    return (
        <div className="fixed bottom-3 right-3 z-[2147483647] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isMaximized ? 'min(90vw, 900px)' : '350px',
                            height: isMaximized ? 'min(85vh, 800px)' : '480px'
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            "bg-white dark:bg-zinc-900 border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-4",
                            isMaximized && "fixed inset-4 m-auto z-[2147483647]"
                        )}
                    >
                        {/* Header */}
                        <div className={cn("p-4 flex items-center justify-between text-white bg-gradient-to-r", currentContext.color)}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative">
                                    <Bot className="w-6 h-6 text-white" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                                        AI VRM {currentContext.name}
                                        <Sparkles className="w-3 h-3 text-yellow-300" />
                                    </h3>
                                    <p className="text-[11px] opacity-80 mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                        Always here to help you
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                                    title="Minimize"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsMaximized(!isMaximized)}
                                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                                    title={isMaximized ? "Restore" : "Maximize"}
                                >
                                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                                    title="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-zinc-800/30">
                            <ScrollArea className="h-full" ref={scrollRef}>
                                <div className="flex flex-col gap-4 p-5">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full flex-col gap-1.5",
                                                msg.role === 'user' ? "ml-auto items-end" : "items-start"
                                            )}
                                        >
                                            <div className={cn(
                                                "px-4 py-3 rounded-2xl text-[14px] shadow-sm leading-relaxed max-w-[85%] break-words whitespace-pre-wrap flex flex-col gap-2",
                                                msg.role === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-white dark:bg-zinc-800 border border-border/50 rounded-tl-none text-foreground"
                                            )}>
                                                <span>{msg.text}</span>
                                                {msg.role === 'assistant' && msg.link && (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (msg.link) router.push(msg.link);
                                                        }}
                                                        className="w-full mt-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white h-7 text-xs font-semibold shadow-sm"
                                                    >
                                                        Go to Page →
                                                    </Button>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground px-1 uppercase tracking-wider font-semibold opacity-60">
                                                {msg.role === 'assistant' ? 'AI Assistant' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}

                                    {/* Quick Help Chips (Hierarchical Menu) */}
                                    {!isLoading && (
                                        <div className="flex flex-col gap-2 mt-2 px-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="flex flex-wrap gap-2">
                                                {MENU_STRUCTURE[menuState]?.map((opt: any, i: number) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleOptionClick(opt)}
                                                        className="bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-border/60 text-xs px-3 py-2 rounded-full shadow-sm text-foreground/80 transition-all text-left flex items-center gap-2"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Back Button for Sub-menus */}
                                            {menuState !== 'ROOT' && (
                                                <button
                                                    onClick={() => setMenuState('ROOT')}
                                                    className="self-start mt-2 text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 px-2"
                                                >
                                                    ← Back to Main Menu
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {isLoading && (
                                        <div className="flex items-start gap-2">
                                            <div className="bg-white dark:bg-zinc-800 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                                </div>
                                                <span className="text-xs text-muted-foreground ml-2">Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-white dark:bg-zinc-900">
                            <div className="flex gap-2 items-center">
                                <div className="flex-1 relative">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={isChatEnabled ? "Type your query precisely..." : "Click 'My query not listed' to type"}
                                        className="bg-slate-100 dark:bg-zinc-800 border-none focus-visible:ring-2 focus-visible:ring-primary/20 h-11 pr-10 shadow-inner rounded-xl disabled:opacity-50"
                                        disabled={isLoading || !isChatEnabled}
                                    />
                                    <MessageSquare className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                </div>
                                <Button
                                    size="icon"
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim() || !isChatEnabled}
                                    className="bg-primary hover:bg-primary/90 rounded-xl shrink-0 h-11 w-11 shadow-lg transition-all active:scale-90 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-[9px] text-center text-muted-foreground mt-3 opacity-60">
                                AI responses are generated based on ERP knowledge and subject policy.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimized Bar */}
            <AnimatePresence>
                {isOpen && isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={() => setIsMinimized(false)}
                        className={cn("text-white px-4 py-3 rounded-t-xl mb-4 cursor-pointer shadow-2xl flex items-center gap-3 w-[300px] border border-white/20 backdrop-blur-md bg-gradient-to-r", currentContext.color)}
                    >
                        <Bot className="w-5 h-5" />
                        <span className="text-xs font-bold truncate tracking-tight">Support: AI VRM {currentContext.name}</span>
                        <Maximize2 className="w-4 h-4 ml-auto opacity-70" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <div className="flex flex-col items-center gap-1.5">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleChat}
                    className={cn(
                        "w-[52px] h-[52px] rounded-full shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-500 ring-2 ring-white/90 dark:ring-zinc-800/90 overflow-hidden relative group",
                        isOpen && !isMinimized ? "bg-red-500 ring-red-100" : cn("bg-gradient-to-tr", currentContext.color)
                    )}
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    {isOpen && !isMinimized ? (
                        <X className="w-5 h-5 text-white z-10" />
                    ) : (
                        <div className="relative flex flex-col items-center justify-center w-full h-full">
                            <Bot className="w-6 h-6 text-white z-10 drop-shadow-lg" />

                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute top-1 right-1 w-2.5 h-2.5 bg-white rounded-full z-20 flex items-center justify-center"
                            >
                                <Sparkles className="w-1.5 h-1.5 text-primary" />
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
