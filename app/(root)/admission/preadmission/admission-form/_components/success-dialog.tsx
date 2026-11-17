'use client';

import { AdaptiveBody, AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { CheckCircle2 } from 'lucide-react';

export default function ApplicationFormSuccessDialog({
    isOpen,
    onClose,
    title = 'Application Submitted Successfully',
    message = 'Successfully submitted application form'
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}) {
    return (
        <div className='flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
            <AdaptiveDialog
                title={title}
                isOpen={isOpen}
                onClose={onClose}
                size='md'
                showCloseButton={true}
                isTitleRequired={false}
                className='max-h-[95vh] overflow-scroll'>
                <AdaptiveBody className='max-h-none overflow-visible p-0'>
                    <div className='flex flex-col items-center space-y-4 text-center'>
                        {/* Animated Success Icon */}
                        <div className='relative'>
                            <div className='absolute inset-0 animate-pulse rounded-full bg-green-400 opacity-30 blur-2xl' />
                            <div className='zoom-in-50 relative animate-in rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-4 shadow-xl duration-500'>
                                <CheckCircle2 className='zoom-in-0 h-16 w-16 animate-in text-white delay-200 duration-700' />
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className='fade-in slide-in-from-bottom-4 animate-in space-y-2 delay-300 duration-500'>
                            <h2 className='font-bold text-2xl text-slate-900 md:text-3xl'>
                                {title.replace(/Successfully? (submitted|saved|Updated)?/i, '').trim() || title}
                            </h2>
                            {!title.includes('Updated') && <p className='max-w-sm text-slate-600 text-sm md:text-base'>{message}</p>}
                        </div>

                        {/* Info Cards */}

                        {/* Reference Number */}
                        {/* <div className='w-full bg-slate-100 rounded-lg p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700'>
                            <p className='text-slate-500 text-xs font-medium mb-1'>Application Reference</p>
                            <p className='text-slate-900 font-mono text-lg font-semibold tracking-wider'>
                                APP-2025-
                                {Math.floor(Math.random() * 10000)
                                    .toString()
                                    .padStart(4, '0')}
                            </p>
                        </div> */}
                    </div>
                </AdaptiveBody>
            </AdaptiveDialog>
        </div>
    );
}
