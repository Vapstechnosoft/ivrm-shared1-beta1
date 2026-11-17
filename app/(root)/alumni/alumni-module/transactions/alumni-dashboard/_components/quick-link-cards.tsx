'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, ChevronRight, GraduationCap, HeartHandshake, Images, Megaphone, UserCircle, UserRoundPlus } from 'lucide-react';
import Image from 'next/image';

interface QuickLinkCardsProps {
    onProfile: () => void;
    onDonation: () => void;
    onBirthday: () => void;
    onGallery: () => void;
    onNotice: () => void;
    onEvents: () => void;
    onFriendRequest: () => void;
    onDirectory: () => void;
    totalCount?: number;
    donationAmount?: number;
}

export default function QuickLinkCards({
    onProfile,
    onDonation,
    onBirthday,
    onGallery,
    onNotice,
    onEvents,
    onFriendRequest,
    onDirectory,
    totalCount = 0,
    donationAmount = 0
}: QuickLinkCardsProps) {
    const cards = [
        {
            title: 'MY PROFILE',
            icon: '/assets/student_academic.png',
            fallbackIcon: <UserCircle className='h-8 w-8 text-green-500' />,
            action: onProfile,
            detail: 'View your profile details',
            color: 'border-green-500/20'
        },
        {
            title: 'DONATION',
            icon: '/assets/logo1.png',
            fallbackIcon: <HeartHandshake className='h-8 w-8 text-blue-500' />,
            action: onDonation,
            detail: `Total Donate: ₹${donationAmount}`,
            color: 'border-blue-500/20'
        },
        {
            title: 'GALLERY',
            icon: '/assets/sophia_banner.jpg',
            fallbackIcon: <Images className='h-8 w-8 text-orange-500' />,
            action: onGallery,
            detail: 'Photo & Video Gallery',
            color: 'border-orange-500/20'
        },
        {
            title: 'NOTICE',
            icon: '/assets/tunbridge_logo.png',
            fallbackIcon: <Megaphone className='h-8 w-8 text-purple-500' />,
            action: onNotice,
            detail: 'Important Notifications',
            color: 'border-purple-500/20'
        },
        {
            title: 'EVENTS',
            icon: '/assets/Login_BG.png',
            fallbackIcon: <CalendarDays className='h-8 w-8 text-red-500' />,
            action: onEvents,
            detail: 'All Events',
            color: 'border-red-500/20'
        },
        {
            title: 'FRIEND REQUEST',
            icon: '/assets/student_academic.png',
            fallbackIcon: <UserRoundPlus className='h-8 w-8 text-teal-500' />,
            action: onFriendRequest,
            detail: `Pending: ${totalCount}`,
            color: 'border-teal-500/20'
        },
        {
            title: 'ALUMNI Details',
            icon: '/assets/student_academic.png',
            fallbackIcon: <GraduationCap className='h-8 w-8 text-cyan-500' />,
            action: onDirectory,
            detail: 'Search Alumni Network',
            color: 'border-cyan-500/20'
        }
    ];

    return (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {cards.map((card, idx) => (
                <Card
                    key={idx}
                    className={`cursor-pointer border-l-4 transition-all hover:scale-[1.02] hover:shadow-lg ${card.color}`}
                    onClick={card.action}>
                    <CardContent className='flex flex-col items-center justify-center space-y-3 p-6 text-center'>
                        <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-muted/30'>
                            <Image
                                src={card.icon}
                                alt={card.title}
                                fill
                                className='object-contain transition-opacity duration-300'
                                onError={(e) => {
                                    (e.target as any).style.opacity = '0';
                                }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center transition-opacity hover:opacity-100'>
                                {card.fallbackIcon}
                            </div>
                        </div>
                        <div className='space-y-1'>
                            <h3 className='font-bold text-primary'>{card.title}</h3>
                            <p className='text-muted-foreground text-xs'>{card.detail}</p>
                        </div>
                        <div className='flex w-full items-center justify-between border-t pt-3 font-medium text-muted-foreground text-xs'>
                            <span>Go to details</span>
                            <ChevronRight className='h-3 w-3' />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
