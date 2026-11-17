'use client';

import ViewReplyModal from '@/app/(root)/alumni/alumni-module/transactions/alumni-interactions/_components/view-reply-modal';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteAlumniInteraction } from '@/server/alumni/alumni-interactions';
import type { IAlumniInteraction } from '@/types/alumni/alumni-interactions';
import { format } from 'date-fns';
import { Calendar, Clock, Loader2, MessageCircle, MessageSquare, Paperclip, Trash2, User, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InboxListProps {
    messages: IAlumniInteraction[];
    userHrmeId: number;
    onRefresh: () => void;
}

export default function InboxList({ messages, userHrmeId, onRefresh }: InboxListProps) {
    const [selectedMessage, setSelectedMessage] = useState<IAlumniInteraction | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this interaction?')) return;
        setIsDeleting(id);
        try {
            const res = await deleteAlumniInteraction(id);
            if (res.success) {
                toast.success('Interaction deleted');
                onRefresh();
            } else {
                toast.error(res.message || 'Failed to delete');
            }
        } catch (error) {
            toast.error('An error occurred while deleting');
        } finally {
            setIsDeleting(null);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return format(date, 'MMM dd');
    };

    if (messages.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-gray-300 border-dashed bg-gradient-to-br from-gray-50 to-white p-12 text-center'>
                <div className='mb-6 rounded-full bg-primary/10 p-6'>
                    <MessageCircle className='h-16 w-16 text-primary/60' />
                </div>
                <h3 className='mb-3 font-bold text-gray-700 text-xl'>Your Inbox is Empty</h3>
                <p className='mb-6 max-w-md text-center text-muted-foreground'>
                    No messages yet. Start conversations with fellow alumni using the Group or Individual message tabs.
                </p>
                <div className='flex gap-3'>
                    <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                        <Users className='mb-1 h-5 w-5 text-blue-600' />
                        <p className='font-medium text-blue-700 text-xs'>Group Messages</p>
                    </div>
                    <div className='rounded-lg border border-green-200 bg-green-50 p-3'>
                        <User className='mb-1 h-5 w-5 text-green-600' />
                        <p className='font-medium text-green-700 text-xs'>Individual Messages</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='mb-4 flex items-center justify-between px-2'>
                <div className='text-muted-foreground text-sm'>
                    <span className='font-medium text-primary'>{messages.length}</span> message{messages.length !== 1 ? 's' : ''} total
                </div>
                <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                    <Badge variant='outline' className='h-5 gap-1'>
                        <Users className='h-3 w-3' /> {messages.filter((m) => m.ALSMINT_GroupOrIndFlg === 'Group').length} Group
                    </Badge>
                    <Badge variant='outline' className='h-5 gap-1'>
                        <User className='h-3 w-3' /> {messages.filter((m) => m.ALSMINT_GroupOrIndFlg === 'Individual').length} Individual
                    </Badge>
                </div>
            </div>

            <Accordion type='single' collapsible className='w-full space-y-3'>
                {messages.map((msg) => (
                    <AccordionItem
                        key={msg.ALSMINT_Id}
                        value={String(msg.ALSMINT_Id)}
                        className='overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md'>
                        <AccordionTrigger className='px-6 py-5 hover:no-underline'>
                            <div className='flex w-full items-start gap-4 text-left'>
                                <div
                                    className={`rounded-full p-3 ${msg.ALSMINT_GroupOrIndFlg === 'Group' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                    {msg.ALSMINT_GroupOrIndFlg === 'Group' ? <Users size={20} /> : <User size={20} />}
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <div className='mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center'>
                                        <h4 className='truncate font-bold text-base text-gray-900'>{msg.ALSMINT_Subject}</h4>
                                        <div className='flex items-center gap-2'>
                                            <div className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-muted-foreground text-xs'>
                                                <Clock className='h-3 w-3' />
                                                <span>{getTimeAgo(msg.ALSMINT_DateTime)}</span>
                                            </div>
                                            <div className='rounded-full bg-gray-100 px-2 py-1 text-[10px] text-muted-foreground'>
                                                {format(new Date(msg.ALSMINT_DateTime), 'MMM dd')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2 text-sm md:flex-row md:items-center'>
                                        <div className='flex items-center gap-2'>
                                            {msg.ALSMINT_ComposedById === userHrmeId ? (
                                                <div className='flex items-center gap-1 text-blue-700'>
                                                    <span className='rounded bg-blue-100 px-2 py-0.5 text-xs'>To:</span>
                                                    <span className='font-medium'>{msg.Receiver}</span>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-1 text-green-700'>
                                                    <span className='rounded bg-green-100 px-2 py-0.5 text-xs'>From:</span>
                                                    <span className='font-medium'>{msg.Sender}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            {msg.ALSTINT_Attachment && (
                                                <Badge
                                                    variant='secondary'
                                                    className='h-5 gap-1 bg-orange-100 px-2 py-0 text-orange-700 hover:bg-orange-100'>
                                                    <Paperclip size={12} /> Attachment
                                                </Badge>
                                            )}
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs ${msg.ALSMINT_GroupOrIndFlg === 'Group' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                {msg.ALSMINT_GroupOrIndFlg}
                                            </span>
                                        </div>
                                    </div>

                                    <p className='mt-3 line-clamp-2 text-gray-600 text-sm'>{msg.ALSMINT_Interaction}</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className='border-t bg-gray-50 px-6 pt-4 pb-6'>
                            <div className='space-y-4'>
                                <div className='rounded-lg border bg-white p-4 shadow-sm'>
                                    <div className='mb-3 flex items-center justify-between'>
                                        <h5 className='font-semibold text-gray-700'>Message Preview</h5>
                                        <div className='flex items-center gap-2 text-muted-foreground text-xs'>
                                            <Calendar className='h-3 w-3' />
                                            {format(new Date(msg.ALSMINT_DateTime), 'MMMM dd, yyyy h:mm a')}
                                        </div>
                                    </div>
                                    <p className='whitespace-pre-wrap rounded-r border-primary border-l-4 bg-primary/5 py-2 pl-4 text-gray-700 leading-relaxed'>
                                        {msg.ALSMINT_Interaction}
                                    </p>

                                    {msg.ALSTINT_Attachment && (
                                        <div className='mt-4 border-t pt-4'>
                                            <a
                                                href={msg.ALSTINT_Attachment}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='inline-flex items-center gap-2 font-medium text-blue-600 text-sm hover:text-blue-800'>
                                                <Paperclip size={14} /> Download Attachment
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className='flex items-center justify-between pt-4'>
                                    <Button
                                        variant='default'
                                        size='lg'
                                        onClick={() => setSelectedMessage(msg)}
                                        className='gap-3 bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:from-blue-700 hover:to-purple-700'>
                                        <MessageSquare size={16} /> View Thread & Reply
                                    </Button>

                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        disabled={isDeleting === msg.ALSMINT_Id}
                                        onClick={() => handleDelete(msg.ALSMINT_Id)}
                                        className='border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'>
                                        {isDeleting === msg.ALSMINT_Id ? (
                                            <Loader2 size={14} className='mr-2 animate-spin' />
                                        ) : (
                                            <Trash2 size={14} className='mr-2' />
                                        )}
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {selectedMessage && (
                <ViewReplyModal
                    message={selectedMessage}
                    userHrmeId={userHrmeId}
                    onClose={() => setSelectedMessage(null)}
                    onSuccess={() => {
                        setSelectedMessage(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}
