'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4'>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className='mb-4 text-center font-bold text-6xl text-primary'>404</h1>
                <p className='mb-8 text-muted-foreground text-xl'>We couldn't find the page you're looking for.</p>
                <Button variant='default' size='lg' href='/' className='gap-2' prefix={<ArrowLeft className='h-4 w-4' />}>
                    Back to Home
                </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                <svg width='240' height='120' viewBox='0 0 240 120' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                        x='20'
                        y='20'
                        width='200'
                        height='80'
                        rx='8'
                        stroke='currentColor'
                        strokeWidth='2'
                        className='text-muted-foreground'
                    />
                    <path d='M20 40H220' stroke='currentColor' strokeWidth='2' className='text-muted-foreground' />
                    <circle cx='30' cy='30' r='2' fill='currentColor' className='text-primary' />
                    <circle cx='40' cy='30' r='2' fill='currentColor' className='text-primary' />
                    <circle cx='50' cy='30' r='2' fill='currentColor' className='text-primary' />
                    <path
                        d='M80 70L100 90L120 60'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-primary'
                    />
                    <path d='M140 90H180' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='text-primary' />
                    <path d='M140 80H160' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='text-primary' />
                </svg>
            </motion.div>
        </div>
    );
}
