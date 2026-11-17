'use client';

import Image from 'next/image';

interface BirthdayTemplateProps {
    participant: any;
    type: string;
}

export default function BirthdayTemplate({ participant, type }: BirthdayTemplateProps) {
    const name = type === 'Staff' ? participant.employeeName : participant.studentName;
    const photo = type === 'Staff' ? participant.PhotoPath : participant.photoPath;
    const id = type === 'Staff' ? participant.hrmE_Id : participant.amsT_Id;

    return (
        <div
            id={`birthday-card-${id}`}
            className='relative h-[400px] w-full max-w-[320px] overflow-hidden rounded-xl border-4 border-primary/20 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-primary/10'>
            {/* Main Background Image - Using a placeholder if the original is unavailable */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5'>
                <Image
                    src='https://vapsclg.blob.core.windows.net/files/Jan 23 A-01.jpg'
                    alt='Birthday Background'
                    fill
                    className='object-cover opacity-80'
                    crossOrigin='anonymous'
                />
            </div>

            {/* Content Container */}
            <div className='relative flex h-full flex-col items-center justify-center p-6 text-center'>
                {/* Participant Photo Overlay */}
                <div className='relative mt-8 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg'>
                    {photo ? (
                        <Image src={photo} alt={name} fill className='object-cover' crossOrigin='anonymous' />
                    ) : (
                        <div className='flex h-full w-full items-center justify-center bg-muted'>
                            <span className='text-4xl'>🎂</span>
                        </div>
                    )}
                </div>

                {/* Name Overlay */}
                <div className='mt-6 space-y-2'>
                    <h2 className='font-bold text-2xl text-primary tracking-tight drop-shadow-sm'>{name}</h2>
                    <p className='font-medium text-muted-foreground text-xs uppercase tracking-widest'>Happy Birthday!</p>
                </div>

                {/* Decorative Elements */}
                <div className='absolute bottom-6 flex gap-2'>
                    <span className='text-2xl'>🎈</span>
                    <span className='text-2xl'>🎉</span>
                    <span className='text-2xl'>🎁</span>
                </div>
            </div>

            {/* Stylish Border/Frame */}
            <div className='pointer-events-none absolute inset-0 rounded-lg border border-white/20' />
        </div>
    );
}
