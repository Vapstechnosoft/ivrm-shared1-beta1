'use client';

import { Button } from '@/components/ui/button';
import { AdaptiveBody, AdaptiveDialog, AdaptiveFooter } from '@/components/ui/extension/adaptive-dialog';
import { FormError } from '@/components/ui/extension/field';
import type { IAlumniInteraction, IAlumniInteractionReply } from '@/types/alumni/alumni-interactions';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar, Loader2, Paperclip, Plus, Send, Trash2, User, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type InteractionReplySchema, interactionReplySchema } from './schema';

interface ViewReplyModalProps {
    message: IAlumniInteraction;
    userHrmeId: number;
    onClose: () => void;
    onSuccess: () => void;
}

import { deleteAlumniInteraction, replyAlumniInteraction, searchAlumniForInteraction } from '@/server/alumni/alumni-interactions';
import { uploadDocument } from '@/server/document_upload';

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export default function ViewReplyModal({ message, userHrmeId, onClose, onSuccess }: ViewReplyModalProps) {
    const [replies, setReplies] = useState<IAlumniInteractionReply[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const form = useForm<InteractionReplySchema>({
        resolver: zodResolver(interactionReplySchema),
        defaultValues: {
            istinT_Interaction: '',
            images_paths: []
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = form;
    const images_paths = watch('images_paths') || [];

    const fetchThread = async () => {
        setIsLoading(true);
        try {
            const res = await searchAlumniForInteraction({
                alsminT_Id: message.ALSMINT_Id,
                alsminT_ComposedById: message.ALSMINT_ComposedById
            });
            if (res.success && res.data) {
                setReplies(res.data.viewmessage || []);
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('Failed to load message thread');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [message.ALSMINT_Id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [replies]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('File', file);
            formData.append('folder', 'Alumni_Interaction');

            try {
                const res = await uploadDocument(formData);
                let path = '';
                if (res?.success && res.data) {
                    path = res.data;
                }

                if (path) {
                    setValue('images_paths', [...images_paths, { path, name: file.name }]);
                    toast.success('File uploaded successfully');
                }
                // biome-ignore lint/correctness/noUnusedVariables: <explanation>
            } catch (err) {
                toast.error('File upload failed');
            } finally {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteReply = async (id: number) => {
        if (!confirm('Are you sure you want to delete this specific message?')) return;
        try {
            const res = await deleteAlumniInteraction(id);
            if (res.success) {
                toast.success('Message deleted from thread');
                fetchThread();
            } else {
                toast.error(res.message || 'Failed to delete message');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('An error occurred while deleting');
        }
    };

    const onSubmit = async (data: InteractionReplySchema) => {
        try {
            const payload: any = {
                alsminT_Id: message.ALSMINT_Id,
                alstinT_Id: 0,
                mI_Id: 0,
                hrmE_Id: 0,
                almsT_Id: 0,
                ivrmrT_Id: 0,
                alsminT_ComposedById: message.ALSMINT_ComposedById,
                asmaY_Id: 0,
                alstinT_Interaction: data.istinT_Interaction,
                alstinT_ComposedByFlg: 'Alumni',
                images_paths: data.images_paths?.map((p: any) => p.path) || [],
                alsminT_DateTime: new Date().toISOString(),
                alsminT_ActiveFlag: true
            };

            const res = await replyAlumniInteraction(payload);
            if (res.success) {
                toast.success('Reply sent successfully');
                reset();
                fetchThread();
            } else {
                toast.error(res.message || 'Failed to send reply');
            }
            // biome-ignore lint/correctness/noUnusedVariables: <explanation>
        } catch (error) {
            toast.error('An error occurred while sending your reply');
        }
    };

    return (
        <AdaptiveDialog
            isOpen={true}
            onClose={onClose}
            title={
                <div className='flex flex-col'>
                    <span className='font-bold text-lg'>{message.ALSMINT_Subject}</span>
                    <span className='mt-1 flex items-center gap-2 font-normal text-muted-foreground text-xs'>
                        {message.ALSMINT_GroupOrIndFlg === 'Group' ? <Users className='h-3 w-3' /> : <User className='h-3 w-3' />}
                        {message.ALSMINT_GroupOrIndFlg} •
                        <Calendar className='ml-2 h-3 w-3' />
                        {format(new Date(message.ALSMINT_DateTime), 'MMM dd, yyyy h:mm a')}
                    </span>
                </div>
            }
            size='3xl'>
            <AdaptiveBody className='flex flex-col gap-6 p-6'>
                {/* Original Message Header */}
                <div className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div
                                className={`rounded-full p-2 ${message.ALSMINT_GroupOrIndFlg === 'Group' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {message.ALSMINT_GroupOrIndFlg === 'Group' ? <Users size={18} /> : <User size={18} />}
                            </div>
                            <div>
                                <h4 className='font-bold text-blue-800'>Original Message</h4>
                                <p className='text-blue-600 text-xs'>
                                    {message.ALSMINT_ComposedById === userHrmeId ? 'You' : message.Sender} •
                                    {format(new Date(message.ALSMINT_DateTime), 'MMM dd, h:mm a')}
                                </p>
                            </div>
                        </div>
                        {message.ALSTINT_Attachment && (
                            <a
                                href={message.ALSTINT_Attachment}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 font-medium text-blue-600 text-sm hover:text-blue-800'>
                                <Paperclip size={14} /> View Attachment
                            </a>
                        )}
                    </div>
                    <p className='whitespace-pre-wrap rounded-r border-blue-500 border-l-4 bg-white py-2 pl-4 text-gray-700'>
                        {message.ALSMINT_Interaction}
                    </p>
                </div>

                {/* Thread Messages */}
                <div
                    className='max-h-[500px] min-h-[400px] flex-1 space-y-6 overflow-y-auto rounded-lg border bg-gray-50/50 p-4 px-1'
                    ref={scrollRef}>
                    {isLoading ? (
                        <div className='flex h-full min-h-[300px] items-center justify-center'>
                            <div className='flex flex-col items-center gap-3'>
                                <Loader2 className='h-10 w-10 animate-spin text-primary' />
                                <p className='text-muted-foreground'>Loading conversation...</p>
                            </div>
                        </div>
                    ) : replies.length === 0 ? (
                        <div className='flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-gray-300 border-dashed bg-white p-8 text-muted-foreground'>
                            <div className='mb-4 rounded-full bg-primary/10 p-4'>
                                <Plus className='h-10 w-10 text-primary/50' />
                            </div>
                            <h3 className='mb-2 font-bold text-gray-700 text-lg'>Start the Conversation</h3>
                            <p className='max-w-md text-center'>No replies yet. Be the first to respond to this message.</p>
                        </div>
                    ) : (
                        <div className='space-y-6'>
                            {replies.map((reply, idx) => {
                                const isMe = reply.ALSTINT_ComposedById === userHrmeId;
                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`group relative max-w-[85%] rounded-2xl px-5 py-3 shadow-md ${
                                                isMe
                                                    ? 'rounded-br-none bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                    : 'rounded-bl-none border border-gray-200 bg-white shadow-sm'
                                            }`}>
                                            <div className='mb-2 flex items-center justify-between'>
                                                <span className={`font-bold text-xs ${isMe ? 'text-blue-100' : 'text-blue-600'}`}>
                                                    {isMe ? 'You' : reply.Sender}
                                                </span>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-[10px] opacity-70'>
                                                        {format(new Date(reply.ALSTINT_DateTime), 'h:mm a')}
                                                    </span>
                                                    {isMe && (
                                                        // biome-ignore lint/a11y/useButtonType: <explanation>
                                                        <button
                                                            onClick={() => handleDeleteReply(reply.ALSTINT_Id)}
                                                            className='opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-70'
                                                            title='Delete message'
                                                        >
                                                            <Trash2 size={12} className={isMe ? 'text-white' : 'text-gray-400'} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className='mb-3 whitespace-pre-wrap break-words text-sm leading-relaxed'>
                                                {reply.ALSTINT_Interaction}
                                            </p>

                                            {reply.ALSTINT_Attachment && (
                                                <div className={`mt-3 border-t pt-3 ${isMe ? 'border-blue-400/30' : 'border-gray-200'}`}>
                                                    <a
                                                        href={reply.ALSTINT_Attachment}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className={`flex items-center gap-2 font-medium text-xs hover:underline ${isMe ? 'text-blue-200' : 'text-blue-600'}`}>
                                                        <Paperclip size={12} /> View Attachment
                                                    </a>
                                                </div>
                                            )}

                                            <div className='mt-2 text-right font-medium text-[10px] opacity-60'>
                                                {format(new Date(reply.ALSTINT_DateTime), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 border-t pt-6'>
                    <div className='flex flex-col gap-3'>
                        {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                        <label className='font-medium text-gray-700 text-sm'>Your Reply</label>
                        <textarea
                            {...register('istinT_Interaction')}
                            placeholder='Type your reply here...'
                            className='min-h-[100px] w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition-all hover:shadow focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        />
                        {errors.istinT_Interaction && <FormError>{errors.istinT_Interaction.message}</FormError>}
                    </div>

                    <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                        <div className='flex flex-1 flex-col gap-2'>
                            <div className='flex items-center gap-3'>
                                <input
                                    type='file'
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className='hidden'
                                    accept='image/*,application/pdf,application/msword'
                                />
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='sm'
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className='gap-2'>
                                    {uploading ? <Loader2 size={14} className='animate-spin' /> : <Plus size={14} />}
                                    Attach File
                                </Button>

                                <div className='flex gap-2 overflow-x-auto pb-1'>
                                    {images_paths.map((f, i) => (
                                        <div
                                            key={i}
                                            className='flex items-center gap-1 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700 text-xs'>
                                            <span className='max-w-[100px] truncate' title={f.name}>
                                                {f.name}
                                            </span>
                                            <X
                                                size={12}
                                                className='ml-1 cursor-pointer transition-transform hover:scale-125'
                                                onClick={() => {
                                                    const updated = [...images_paths];
                                                    updated.splice(i, 1);
                                                    setValue('images_paths', updated);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            <Button type='button' variant='ghost' onClick={onClose} className='min-w-[100px]'>
                                Close
                            </Button>
                            <Button
                                type='submit'
                                size='lg'
                                disabled={isSubmitting || uploading}
                                isLoading={isSubmitting}
                                className='min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:from-blue-700 hover:to-purple-700'>
                                <Send size={16} className='mr-2' /> Send Reply
                            </Button>
                        </div>
                    </div>
                </form>
            </AdaptiveBody>
            <AdaptiveFooter className='hidden'>
                <div />
            </AdaptiveFooter>
        </AdaptiveDialog>
    );
}
