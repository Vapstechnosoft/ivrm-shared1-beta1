'use client';

import { AdaptiveBody, AdaptiveDialog } from '@/components/ui/extension/adaptive-dialog';
import { Bell, CheckCircle2, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationFormSuccessDialog({
    isOpen,
    onClose,
    title = 'Application Submitted Successfully',
    message = 'Successfully submitted application form',
    fee_required = false
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    fee_required?: boolean;
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
                        {!title.includes('Updated') && (
                            <div className='fade-in slide-in-from-bottom-4 w-full animate-in space-y-3 delay-500 duration-500'>
                                {fee_required && (
                                    <div className='rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md'>
                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-lg bg-amber-500 p-2'>
                                                <Clock className='h-4 w-4 text-white' />
                                            </div>
                                            <div className='flex-1 text-left'>
                                                <h3 className='mb-1 font-semibold text-slate-900 text-sm'>Fee Required</h3>
                                                <p className='text-slate-600 text-xs leading-relaxed'>
                                                    Please make payment to complete your application. You can access the payment link from
                                                    your application list.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <Link href='/' className='block cursor-pointer'>
                                    <div className='rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md'>
                                        <div className='flex items-start gap-3'>
                                            <div className='mt-0.5 rounded-lg bg-blue-500 p-2'>
                                                <FileText className='h-4 w-4 text-white' />
                                            </div>
                                            <div className='flex-1 text-left'>
                                                <h3 className='mb-1 font-semibold text-slate-900 text-sm'>Track Your Application</h3>
                                                <p className='text-slate-600 text-xs leading-relaxed'>
                                                    Monitor your application status in your dashboard
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                <div className='rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md'>
                                    <div className='flex items-start gap-3'>
                                        <div className='mt-0.5 rounded-lg bg-purple-500 p-2'>
                                            <Bell className='h-4 w-4 text-white' />
                                        </div>
                                        <div className='flex-1 text-left'>
                                            <h3 className='mb-1 font-semibold text-slate-900 text-sm'>Email Confirmation Sent</h3>
                                            <p className='text-slate-600 text-xs leading-relaxed'>
                                                Check your inbox for confirmation details
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

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
