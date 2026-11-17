'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GeneralSettingWizardPage() {
    return (
        <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 p-4 dark:from-slate-900 dark:to-slate-800'>
            <div className='absolute inset-0 z-0 overflow-hidden'>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                    }}
                    className='absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-3xl filter dark:bg-blue-600/10'
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: 'linear',
                    }}
                    className='absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-teal-400/20 blur-3xl filter dark:bg-teal-600/10'
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className='relative z-10 w-full max-w-lg'
            >
                <Card className='overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80'>
                    <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-teal-400' />
                    <CardContent className='flex flex-col items-center p-12 text-center'>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className='mb-8'
                        >
                            <CircularProgress />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className='mb-3 flex items-center justify-center gap-2 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100'>
                                <Settings className='h-8 w-8 text-blue-500' />
                                Setting Wizard
                            </h2>
                            <p className='mx-auto mb-8 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
                                Initial configuration required for the Institution level forms. Complete this wizard to unlock full system capabilities.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className='w-full'
                        >
                            <GettingStartedButton />
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function GettingStartedButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStart = () => {
        setIsLoading(true);
        setTimeout(() => {
            console.log("Navigating to module...");
            setIsLoading(false);
            router.push('/SuperAdmin/super-admin-module/general-setting/module');
        }, 1500);
    };

    return (
        <Button
            onClick={handleStart}
            disabled={isLoading}
            size='lg'
            className='group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500 text-lg font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl'
        >
            <span className='z-10 flex items-center justify-center gap-2'>
                {isLoading ? 'Initializing...' : 'Get Started'}
                {!isLoading && <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />}
            </span>
            <div className='absolute inset-0 -z-10 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
        </Button>
    );
}

function CircularProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const start = 0;
        const end = 100;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progressRatio = Math.min(elapsed / duration, 1);

            // Custom bouncy ease-out
            const c4 = (2 * Math.PI) / 3;
            const ease = progressRatio === 1
                ? 1
                : Math.pow(2, -10 * progressRatio) * Math.sin((progressRatio * 10 - 0.75) * c4) + 1;

            setProgress(Math.round(start + (end - start) * (progressRatio < 1 ? ease : 1)));

            if (progressRatio < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    const size = 180;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className='relative flex items-center justify-center' style={{ width: size, height: size }}>
            {/* Soft Glow Behind */}
            <div className='absolute inset-0 rounded-full bg-blue-400/20 blur-xl' />

            <svg className='relative h-full w-full -rotate-90 transform'>
                {/* Background Track */}
                <circle
                    className='text-slate-100 dark:text-slate-800'
                    stroke='currentColor'
                    strokeWidth={strokeWidth}
                    fill='transparent'
                    r={radius}
                    cx={center}
                    cy={center}
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id='progressGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                        <stop offset='0%' stopColor='#3b82f6' /> {/* Blue-500 */}
                        <stop offset='100%' stopColor='#14b8a6' /> {/* Teal-500 */}
                    </linearGradient>
                </defs>

                {/* Animated Progress Circle */}
                <motion.circle
                    className='drop-shadow-sm'
                    stroke='url(#progressGradient)'
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap='round'
                    fill='transparent'
                    r={radius}
                    cx={center}
                    cy={center}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                />
            </svg>

            {/* Center Text with Layout Transition */}
            <motion.div
                key={progress}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className='absolute flex flex-col items-center'
            >
                <span className='text-5xl font-extrabold tracking-tighter text-slate-800 dark:text-slate-100'>
                    {progress}%
                </span>
                <span className='text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400'>
                    Setup
                </span>
            </motion.div>
        </div>
    );
}
