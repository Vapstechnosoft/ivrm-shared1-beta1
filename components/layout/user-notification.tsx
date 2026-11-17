'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserNotification } from '@/hooks/common';
import { cn } from '@/lib/utils';
import { markAllReadUserNotification, markReadUserNotification } from '@/server/common';
import type { UserNotification } from '@/types';
import { AlertTriangle, Bell, BellRing, Check, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type NotificationPriority = 'high' | 'medium' | 'normal';

export default function UserNotificationPage() {
    const { data: notifications, isLoading: loading, error: isError, refetch: refetchAll } = useUserNotification();
    const [open, setOpen] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({
        high: 0,
        medium: 0,
        normal: 0
    });
    const [bellAnimating, setBellAnimating] = useState(false);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Initialize audio element
    useEffect(() => {
        // Create audio element for notification sound
        audioRef.current = new Audio('/sounds/high-notification.mp3');
        audioRef.current.preload = 'auto';

        // Try to load from localStorage if available
        const savedSoundPreference = localStorage.getItem('notificationSoundEnabled');
        if (savedSoundPreference !== null) {
            setSoundEnabled(savedSoundPreference === 'true');
        }

        return () => {
            // Cleanup audio when component unmounts
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (notifications?.data) {
            // Calculate unread notifications by priority
            const counts = {
                high: notifications.data.filter((n) => n.priority === 'high').length,
                medium: notifications.data.filter((n) => n.priority === 'medium').length,
                normal: notifications.data.filter((n) => n.priority === 'normal').length
            };
            setUnreadCounts(counts);
        }
    }, [notifications]);

    // Get total unread count
    const totalUnread = unreadCounts.high + unreadCounts.medium + unreadCounts.normal;

    // Play notification sound
    const playNotificationSound = () => {
        if (soundEnabled && audioRef.current) {
            // Reset audio to start position to ensure it plays every time
            audioRef.current.currentTime = 0;

            // Play sound with error handling
            audioRef.current.play().catch((error) => {
                console.error('Failed to play notification sound:', error);
                // If auto-play is blocked by browser policy, inform the user
                if (error.name === 'NotAllowedError') {
                    toast.error('Notification sounds require user interaction first. Click anywhere to enable sounds.');
                }
            });
        }
    };

    // Toggle sound setting
    const toggleSound = () => {
        const newSetting = !soundEnabled;
        setSoundEnabled(newSetting);
        // Save preference to localStorage
        localStorage.setItem('notificationSoundEnabled', String(newSetting));
        toast.success(`Notification sounds ${newSetting ? 'enabled' : 'disabled'}`);
    };

    // Setup bell animation to run every 10 seconds if there are high priority notifications
    useEffect(() => {
        // Only animate if there are high priority notifications and popover is closed
        const animateBell = () => {
            if (unreadCounts.high > 0 && !open) {
                setBellAnimating(true);

                // Play notification sound when bell animates
                playNotificationSound();

                setTimeout(() => {
                    setBellAnimating(false);
                }, 1000); // Animation duration
            }
        };

        // Initial animation if we have high priority notifications
        if (unreadCounts.high > 0) {
            animateBell();
        }

        // Set up interval
        const intervalId = setInterval(animateBell, 60000); // Every 1 minute

        return () => {
            clearInterval(intervalId);
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [unreadCounts.high, open]);

    // Format relative time (e.g., "2 hours ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString();
    };

    const handleMarkAsRead = async (id: number, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }

        const response = await markReadUserNotification(id);

        if (response.success) {
            refetchAll();
        } else {
            toast.error(response.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        const response = await markAllReadUserNotification();

        if (response.success) {
            refetchAll();
            setOpen(false);
        } else {
            toast.error(response.message);
        }
    };

    const handleNotificationClick = (notification: UserNotification) => {
        if (notification.link) {
            // Navigate to the link if provided
            window.location.href = notification.link;
        }
        // Mark as read
        handleMarkAsRead(notification.id);
    };

    // Sort notifications by priority (high > medium > normal)
    const sortedNotifications = notifications?.data?.sort((a, b) => {
        const priorityOrder: Record<NotificationPriority, number> = {
            high: 3,
            medium: 2,
            normal: 1
        };
        return priorityOrder[b.priority as NotificationPriority] - priorityOrder[a.priority as NotificationPriority];
    });

    // Get priority icon and styles
    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'high':
                return {
                    icon: <AlertTriangle className='h-3 w-3 text-red-500' />,
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-l-4 border-l-red-500',
                    text: 'text-red-600 dark:text-red-400'
                };
            case 'medium':
                return {
                    icon: <BellRing className='h-3 w-3 text-yellow-500' />,
                    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                    border: 'border-l-4 border-l-yellow-500',
                    text: 'text-yellow-600 dark:text-yellow-400'
                };
            default:
                return {
                    icon: <Bell className='h-3 w-3 text-blue-500' />,
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    border: 'border-l-4 border-l-blue-500',
                    text: 'text-blue-600 dark:text-blue-400'
                };
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button variant='ghost' size='icon' className='relative'>
                                {unreadCounts.high > 0 ? (
                                    <BellRing className={cn('h-5 w-5 text-red-500', bellAnimating && 'animate-bell')} />
                                ) : (
                                    <Bell className={cn('h-5 w-5', bellAnimating && 'animate-bell')} />
                                )}
                                {totalUnread > 0 && (
                                    <Badge
                                        className={cn(
                                            '-top-1 -right-1 absolute flex h-5 min-w-5 items-center justify-center rounded-full',
                                            unreadCounts.high > 0 ? 'bg-red-500' : 'bg-primary',
                                            'px-1 text-primary-foreground text-xs',
                                            bellAnimating && 'animate-pulse'
                                        )}>
                                        {totalUnread > 99 ? '99+' : totalUnread}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side='bottom' className='bg-accent text-foreground text-xs'>
                        <p>Notifications</p>
                        {unreadCounts.high > 0 && <p className='text-red-500'>{unreadCounts.high} high priority</p>}
                        {unreadCounts.medium > 0 && <p className='text-yellow-500'>{unreadCounts.medium} medium priority</p>}
                        {unreadCounts.normal > 0 && <p className='text-blue-500'>{unreadCounts.normal} normal priority</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <PopoverContent className='w-80 p-0' align='end' sideOffset={8}>
                <div className='sticky top-0 z-10 flex items-center justify-between border-b bg-card p-3'>
                    <h6 className='flex items-center font-semibold text-base'>
                        <Bell className='mr-2 h-4 w-4' />
                        Notifications
                        {totalUnread > 0 && (
                            <Badge variant='secondary' className='ml-1'>
                                {totalUnread}
                            </Badge>
                        )}
                    </h6>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={toggleSound}
                            className='h-6 w-6 rounded-full'
                            title={soundEnabled ? 'Disable notification sound' : 'Enable notification sound'}>
                            {soundEnabled ? (
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='14'
                                    height='14'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'>
                                    <path d='M11 5L6 9H2v6h4l5 4V5z' />
                                    <path d='M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07' />
                                </svg>
                            ) : (
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='14'
                                    height='14'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'>
                                    <path d='M11 5L6 9H2v6h4l5 4V5z' />
                                    <line x1='23' y1='9' x2='17' y2='15' />
                                    <line x1='17' y1='9' x2='23' y2='15' />
                                </svg>
                            )}
                        </Button>
                        {sortedNotifications && sortedNotifications.length > 0 && (
                            <Button variant='ghost' size='sm' onClick={handleMarkAllAsRead} className='w-fit text-xs hover:bg-accent'>
                                <Check className='mr-1 h-3 w-3' />
                                Mark all read
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className='flex h-24 items-center justify-center text-muted-foreground'>
                        <div className='flex animate-pulse space-x-2'>
                            <div className='h-2 w-2 animate-bounce rounded-full bg-primary' />
                            <div className='h-2 w-2 animate-bounce rounded-full bg-primary delay-75' />
                            <div className='h-2 w-2 animate-bounce rounded-full bg-primary delay-150' />
                        </div>
                    </div>
                ) : sortedNotifications?.length === 0 && isError ? (
                    <div className='flex flex-col items-center justify-center p-8 text-center'>
                        <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
                            <Bell className='h-6 w-6 text-muted-foreground' />
                        </div>
                        <h3 className='mb-1 font-medium text-lg'>No notifications</h3>
                        <p className='text-muted-foreground text-sm'>You're all caught up!</p>
                    </div>
                ) : (
                    <ScrollArea className='h-[calc(100vh-16rem)] max-h-96'>
                        <div className='flex flex-col divide-y divide-border'>
                            {sortedNotifications?.map((notification) => {
                                const priorityStyles = getPriorityStyles(notification.priority);
                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            'group relative transition-colors duration-150',
                                            priorityStyles.bg,
                                            priorityStyles.border,
                                            'hover:bg-accent/50'
                                        )}>
                                        <div className='flex cursor-pointer p-3' onClick={() => handleNotificationClick(notification)}>
                                            <div className='mt-1 mr-3 flex-shrink-0'>{priorityStyles.icon}</div>
                                            <div className='min-w-0 flex-1'>
                                                <div className='mb-1 flex items-center justify-between gap-2'>
                                                    <h4 className={cn('truncate font-medium text-sm', priorityStyles.text)}>
                                                        {notification.title}
                                                    </h4>
                                                    {notification.priority === 'high' && (
                                                        <Badge variant='destructive' className='text-xs'>
                                                            High
                                                        </Badge>
                                                    )}
                                                    {notification.priority === 'medium' && (
                                                        <Badge variant='secondary' className='bg-yellow-500 text-xs'>
                                                            Medium
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className='mb-1 text-muted-foreground text-sm'>{notification.message}</p>
                                                <div className='flex items-center text-muted-foreground text-xs'>
                                                    {notification.link && (
                                                        <div className='mr-3 flex items-center text-primary'>
                                                            <ExternalLink className='mr-1 h-3 w-3' />
                                                            <span>View details</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            className={cn(
                                                'absolute top-2 right-2 h-6 w-6 rounded-full p-0',
                                                'opacity-0 transition-opacity group-hover:opacity-100',
                                                'bg-accent/80 hover:bg-accent'
                                            )}
                                            size='icon'
                                            variant='ghost'
                                            aria-label='Mark as read'>
                                            <X className='h-3 w-3' />
                                        </Button>

                                        <div className='mr-4 mb-2 text-end text-muted-foreground text-xs'>
                                            {formatRelativeTime(notification.created_timestamp)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    );
}
